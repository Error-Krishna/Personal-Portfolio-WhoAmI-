"""Report which stage of the Ask Krish pipeline fails. Secrets are never printed."""

import os
import re
import sys
import traceback
from importlib import metadata
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.assistant.knowledge import load_public_knowledge
from apps.assistant.services import AssistantService

PROBE_MESSAGE = "Reply with the single word OK."
SAMPLE_QUESTION = "What does Krish build?"
KEY_PATTERN = re.compile(r"gsk_[A-Za-z0-9_\-]+")


def _version(package: str) -> str:
    try:
        return metadata.version(package)
    except metadata.PackageNotFoundError:
        return "not installed"


class Command(BaseCommand):
    help = (
        "Check each stage of the Ask Krish pipeline (configuration, SDK, public knowledge, prompt, "
        "and optionally live Groq requests) and report which one fails. Secret values are never printed."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--live",
            action="store_true",
            help="Also send two real requests to Groq (uses a small amount of quota).",
        )

    def handle(self, *args, **options):
        self.api_key = os.environ.get("GROQ_API_KEY", "").strip()
        self.show_traceback = bool(options.get("traceback"))
        self.failures = 0

        self.stage("configuration", self.check_configuration)
        self.stage("environment file", self.check_env_file)
        self.stage("sdk", self.check_sdk)
        self.stage("public knowledge", self.check_knowledge)
        self.stage("system prompt", self.check_prompt)
        if options["live"]:
            self.stage("live request (minimal prompt)", self.check_live_minimal)
            self.stage("live request (full assistant pipeline)", self.check_live_pipeline)
        else:
            self.stdout.write(
                "Skipped live Groq requests. Re-run with --live to test the key, the model and the full pipeline."
            )

        if self.failures:
            raise CommandError(f"{self.failures} stage(s) failed.")
        self.stdout.write(self.style.SUCCESS("All checked stages passed."))

    # -- helpers -----------------------------------------------------------------

    def stage(self, name, check):
        try:
            detail = check()
        except Exception as exc:
            self.failures += 1
            self.stdout.write(self.style.ERROR(f"FAIL  {name}: {self.describe(exc)}"))
            if self.show_traceback:
                self.stdout.write(self.redact(traceback.format_exc()))
        else:
            suffix = f" - {detail}" if detail else ""
            self.stdout.write(self.style.SUCCESS(f"PASS  {name}") + suffix)

    def redact(self, text: str) -> str:
        if len(self.api_key) >= 8:
            text = text.replace(self.api_key, "[redacted]")
        return KEY_PATTERN.sub("[redacted]", text)

    def describe(self, exc: BaseException) -> str:
        parts, current = [], exc
        while current is not None and len(parts) < 4:
            status = getattr(current, "status_code", None)
            label = type(current).__name__ + (f" (HTTP {status})" if status else "")
            message = self.redact(str(current)).replace("\n", " ")[:300]
            parts.append(f"{label}: {message}" if message else label)
            current = current.__cause__
        return " <- caused by ".join(parts)

    # -- stages ------------------------------------------------------------------

    def check_configuration(self):
        if not self.api_key:
            raise RuntimeError("GROQ_API_KEY is empty or unset in the environment Django sees")
        if not settings.GROQ_MODEL:
            raise RuntimeError("GROQ_MODEL is empty")
        hints = []
        if any(ch.isspace() for ch in self.api_key) or any(ch in self.api_key for ch in "\"'#"):
            hints.append("contains whitespace, quote or '#' characters (check the .env line for stray quotes or inline comments)")
        if not self.api_key.startswith("gsk_"):
            hints.append("does not start with 'gsk_', which is unexpected for a Groq key")
        if hints:
            raise RuntimeError("API key format looks wrong: " + "; ".join(hints))
        return (
            f"model={settings.GROQ_MODEL}, max_tokens={settings.GROQ_MAX_TOKENS}, "
            f"temperature={settings.GROQ_TEMPERATURE}, key length={len(self.api_key)}"
        )

    def check_env_file(self):
        """Detect a shell-exported key silently overriding the one in .env (the loader uses setdefault)."""
        env_file = Path(settings.BASE_DIR) / ".env"
        if not env_file.exists():
            return "no .env file; using the process environment only"
        file_value = None
        for raw_line in env_file.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if line.startswith("GROQ_API_KEY=") and not line.startswith("#"):
                file_value = line.split("=", 1)[1].strip().strip('"').strip("'")
        if file_value is None:
            return "GROQ_API_KEY is not set in .env; using the process environment"
        if file_value != self.api_key:
            raise RuntimeError(
                "the GROQ_API_KEY Django is using differs from the one in .env. A value exported in your "
                "shell (or shell profile) overrides .env. Unset it or update it."
            )
        return "the key Django is using matches .env"

    def check_sdk(self):
        from groq import Groq

        Groq(api_key=self.api_key, timeout=20.0, max_retries=0)
        return (
            f"python {sys.version.split()[0]}, groq {_version('groq')}, "
            f"httpx {_version('httpx')}, pydantic {_version('pydantic')}"
        )

    def check_knowledge(self):
        knowledge = load_public_knowledge()
        if not knowledge.strip():
            raise RuntimeError("public knowledge is empty")
        return f"{len(knowledge):,} characters"

    def check_prompt(self):
        prompt = AssistantService().build_system_prompt()
        return f"{len(prompt):,} characters (about {len(prompt) // 4:,} tokens)"

    def check_live_minimal(self):
        from groq import Groq

        client = Groq(api_key=self.api_key, timeout=20.0, max_retries=0)
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": PROBE_MESSAGE}],
            max_tokens=128,
            temperature=0,
        )
        content = response.choices[0].message.content
        if not isinstance(content, str) or not content.strip():
            raise RuntimeError("Groq returned an empty response")
        return f"model replied {content.strip()[:40]!r}"

    def check_live_pipeline(self):
        reply = AssistantService().generate_reply([{"role": "user", "content": SAMPLE_QUESTION}])
        return f"{len(reply):,} characters returned"
