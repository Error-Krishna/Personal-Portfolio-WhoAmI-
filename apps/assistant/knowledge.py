"""Load portfolio knowledge with a strict public/private boundary."""

import re
import unicodedata
from pathlib import Path

from django.conf import settings


KNOWLEDGE_DIR = Path(settings.BASE_DIR) / "content"

# Private knowledge can live outside the repository in production.
# Local development and existing tests retain their current default.
PRIVATE_KNOWLEDGE_PATH = Path(
    getattr(settings, "KRISH_PRIVATE_KNOWLEDGE_PATH", "")
    or (KNOWLEDGE_DIR / "krish_private.md")
)

# Academic details must never reach public visitors, however the line is worded
# or formatted (bullets, bold, odd Unicode spaces or hyphens).
_PUBLIC_EXCLUDED_LINE = re.compile(
    r"\b(?:cgpa|gpa|graduation|year of study|class 12|percentage|previous schooling)\b"
    r"|^(?:institution|completed)\s*:",
    re.IGNORECASE,
)


def _is_public_excluded(line: str) -> bool:
    normalized = unicodedata.normalize("NFKC", line).replace("‑", "-")
    normalized = normalized.strip().lstrip("-*_• ").replace("*", "").strip()
    return bool(_PUBLIC_EXCLUDED_LINE.search(normalized))


def _knowledge_file_path(filename: str) -> Path:
    """Resolve an explicitly allowlisted knowledge file."""
    if filename == "krish_public.md":
        return KNOWLEDGE_DIR / filename

    if filename == "krish_private.md":
        return PRIVATE_KNOWLEDGE_PATH

    raise ValueError("Unsupported knowledge file.")


def _read_knowledge_file(filename: str) -> str:
    """Read only an explicitly allowlisted knowledge file."""
    path = _knowledge_file_path(filename)

    try:
        content = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        raise RuntimeError(
            f"Unable to load the configured {filename} knowledge file."
        ) from exc

    if not content.strip():
        raise RuntimeError(
            f"The configured {filename} knowledge file is empty."
        )

    return content


def load_public_knowledge() -> str:
    """Load public Markdown while excluding academic details."""
    content = _read_knowledge_file("krish_public.md")

    public_lines = [
        line
        for line in content.splitlines()
        if not _is_public_excluded(line)
    ]

    public_content = "\n".join(public_lines)

    # Preserve the public navigation route expected by the assistant.
    if "/work/udhyog-saathi-platform/" not in public_content:
        public_content += (
            "\n\n## Portfolio Navigation\n"
            "- Udhyog Saathi project: /work/udhyog-saathi-platform/\n"
        )

    return public_content


def load_private_knowledge() -> str:
    """Load private Markdown. Use only after server-side authorization."""
    return _read_knowledge_file("krish_private.md")


def load_admin_knowledge() -> str:
    """Combine public and private knowledge for authenticated Admin Mode."""
    return (
        "# PUBLIC PORTFOLIO KNOWLEDGE\n\n"
        f"{load_public_knowledge()}\n\n"
        "# PRIVATE ADMIN KNOWLEDGE\n\n"
        f"{load_private_knowledge()}"
    )


MAX_KNOWLEDGE_FILE_BYTES = 1_000_000


def update_knowledge_file(
    filename: str,
    action: str,
    content: str,
    old_text: str | None = None,
) -> str:
    """Safely append, replace, or rewrite an allowlisted knowledge file."""
    import os
    import tempfile

    if filename not in {"krish_public.md", "krish_private.md"}:
        raise ValueError("Unsupported knowledge file.")

    if action not in {"append", "replace", "write"}:
        raise ValueError("Unsupported file operation.")

    if not isinstance(content, str) or not content.strip():
        raise ValueError("Content cannot be empty.")

    path = _knowledge_file_path(filename)

    if action == "write":
        updated = content
    else:
        current = _read_knowledge_file(filename)

        if action == "append":
            updated = current.rstrip() + "\n\n" + content.strip() + "\n"
        else:
            if not isinstance(old_text, str) or not old_text:
                raise ValueError("Replacement text cannot be empty.")

            occurrences = current.count(old_text)
            if occurrences != 1:
                raise ValueError(
                    "Replacement requires exactly one matching occurrence."
                )

            updated = current.replace(old_text, content, 1)

    encoded = updated.encode("utf-8")
    if len(encoded) > MAX_KNOWLEDGE_FILE_BYTES:
        raise ValueError("The updated knowledge file exceeds the size limit.")

    path.parent.mkdir(parents=True, exist_ok=True)

    existing_mode = (
        path.stat().st_mode & 0o777
        if path.exists() and filename == "krish_public.md"
        else 0o600 if filename == "krish_private.md"
        else 0o644
    )

    temporary_path = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="wb",
            dir=path.parent,
            prefix=f".{path.name}.",
            delete=False,
        ) as temporary:
            temporary_path = temporary.name
            temporary.write(encoded)
            temporary.flush()
            os.fsync(temporary.fileno())

        os.chmod(temporary_path, existing_mode)
        os.replace(temporary_path, path)
        temporary_path = None
    finally:
        if temporary_path and os.path.exists(temporary_path):
            os.unlink(temporary_path)

    return filename
