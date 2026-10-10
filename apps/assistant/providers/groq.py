import os

from django.conf import settings


class GroqProvider:
    """Small adapter around the existing Groq SDK integration."""

    def generate(self, *, system_prompt: str, messages: list[dict]) -> str:
        api_key = os.environ.get("GROQ_API_KEY", "").strip()
        if not api_key:
            raise RuntimeError("Assistant provider is not configured")
        from groq import Groq

        client = Groq(api_key=api_key, timeout=20.0, max_retries=0)
        request = {
            "model": settings.GROQ_MODEL,
            "messages": [{"role": "system", "content": system_prompt}, *messages],
            "max_completion_tokens": settings.GROQ_MAX_TOKENS,
            "temperature": settings.GROQ_TEMPERATURE,
        }
        if "gpt-oss" in settings.GROQ_MODEL:
            # gpt-oss are reasoning models: reasoning tokens consume the output
            # budget, so keep effort low and keep the reasoning out of the reply.
            request["reasoning_effort"] = "low"
            request["include_reasoning"] = False
        response = client.chat.completions.create(**request)
        return response.choices[0].message.content
