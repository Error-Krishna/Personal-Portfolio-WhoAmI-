"""Public assistant request validation and reply orchestration."""

import re

from .knowledge import load_admin_knowledge, load_public_knowledge
from .prompts import ADMIN_SYSTEM_PROMPT, PUBLIC_SYSTEM_PROMPT
from .providers import GroqProvider

MAX_MESSAGES = 20
MAX_MESSAGE_CHARS = 4_000
MAX_TOTAL_CHARS = 12_000
MAX_BODY_BYTES = 32 * 1024

REFUSAL_PATTERNS = (
    r"ignore (?:all )?(?:previous|prior|above|your) instructions", r"\b(?:system|hidden|developer) prompt\b",
    r"(?:show|reveal|use) (?:your )?hidden knowledge", r"pretend (?:you are|to be) (?:the )?(?:server|administrator|admin)",
    r"\bdeveloper access\b", r"krish_private|private (?:knowledge|notes|file|information|info)",
    r"\b(?:api key|secrets?|environment variables?|admin password)\b",
    r"\b(?:list|print|read|show) (?:all )?(?:server )?files\b", r"\b(?:admin|administrator) access\b",
    r"\b(?:cgpa|gpa|graduation year|year of study|class 12|education details?)\b",
)
REFUSAL = "I can only help with information included in the public portfolio. I can’t provide that detail."


class InvalidAssistantRequest(ValueError):
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.status_code = status_code


class AssistantUnavailable(RuntimeError):
    """A reply could not be produced. ``stage`` records where; the cause is chained."""

    def __init__(self, stage: str):
        super().__init__(f"Assistant unavailable at stage '{stage}'")
        self.stage = stage


class AssistantService:
    def __init__(self, provider=None):
        self.provider = provider or GroqProvider()

    @staticmethod
    def clean_messages(raw_messages) -> list[dict[str, str]]:
        if not isinstance(raw_messages, list) or not raw_messages:
            raise InvalidAssistantRequest("No messages provided")
        if len(raw_messages) > MAX_MESSAGES:
            raise InvalidAssistantRequest("Conversation is too long.")
        cleaned, total = [], 0
        for message in raw_messages:
            if not isinstance(message, dict) or message.get("role") != "user":
                raise InvalidAssistantRequest("Conversation contains an invalid message.")
            content = message.get("content")
            if not isinstance(content, str) or not content.strip():
                raise InvalidAssistantRequest("Messages must contain text.")
            if len(content) > MAX_MESSAGE_CHARS:
                raise InvalidAssistantRequest("A message is too long.")
            total += len(content)
            if total > MAX_TOTAL_CHARS:
                raise InvalidAssistantRequest("Conversation is too long.")
            cleaned.append({"role": "user", "content": content.strip()})
        return cleaned

    def build_system_prompt(self, admin_mode: bool = False) -> str:
        if admin_mode:
            return ADMIN_SYSTEM_PROMPT.format(
                admin_knowledge=load_admin_knowledge()
            )

        return PUBLIC_SYSTEM_PROMPT.format(
            public_knowledge=load_public_knowledge()
        )

    @staticmethod
    def refusal_for(messages):
        # Do not let an earlier question block unrelated follow-up questions.
        if not messages:
            return None

        text = messages[-1]["content"].casefold()
        return (
            REFUSAL
            if any(re.search(pattern, text, re.I) for pattern in REFUSAL_PATTERNS)
            else None
        )

    def generate_reply(
        self,
        messages: list[dict],
        admin_mode: bool = False,
    ) -> str:
        if not admin_mode:
            refusal = self.refusal_for(messages)
            if refusal:
                return refusal

        try:
            system_prompt = self.build_system_prompt(admin_mode=admin_mode)
        except Exception as exc:
            raise AssistantUnavailable("prompt_or_knowledge") from exc
        try:
            reply = self.provider.generate(system_prompt=system_prompt, messages=messages)
        except Exception as exc:
            raise AssistantUnavailable("provider") from exc
        if not isinstance(reply, str) or not reply.strip():
            raise AssistantUnavailable("empty_response")
        return reply.strip()
