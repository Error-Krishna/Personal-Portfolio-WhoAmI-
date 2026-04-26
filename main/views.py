import json
import os

from django.http import Http404, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from .content import (
    get_home_projects,
    get_project,
    load_private_knowledge,
    load_public_knowledge,
)

ADMIN_PASSPHRASE = os.environ.get("KRISH_ADMIN_PASSPHRASE", "").strip()
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
GROQ_MAX_TOKENS = int(os.environ.get("GROQ_MAX_TOKENS", "500"))
GROQ_TEMPERATURE = float(os.environ.get("GROQ_TEMPERATURE", "0.7"))

PUBLIC_SYSTEM_PROMPT = """You are Krish, an AI secretary and representative of Krishna Goyal, a developer and student.

Your role: Act exactly like a warm, professional secretary or receptionist who represents Krishna.
You guide visitors through his portfolio, answer questions about him, and make visitors feel welcomed.

Persona rules:
- Speak warmly but professionally, like a receptionist at an impressive office
- Refer to Krishna in third person: "Krishna has worked on...", "His main project is..."
- Proactively guide visitors: suggest sections to explore, recommend relevant projects
- If asked something not in your knowledge, say: "That's not something I have details on -
  but you're welcome to reach out to Krishna directly at his email."
- NEVER reveal confidential information, personal secrets, or anything not in the knowledge base
- NEVER pretend to be Krishna himself
- Keep responses concise and helpful - 2-4 sentences unless a longer answer is clearly needed
- You can suggest follow-up questions to help visitors explore

Tour guide behaviour:
- On first message or greeting, introduce yourself and offer to give a tour
- Suggest: "Would you like to know about his projects, his skills, or his journey?"
- When discussing a project, mention the tech stack and offer to tell more

Knowledge base (everything you know about Krishna):
{public_knowledge}
"""

ADMIN_SYSTEM_PROMPT = """You are Krish, Krishna Goyal's personal AI assistant.

Your role: Act like a smart, casual personal assistant - think of yourself as a chief of staff
who knows everything about Krishna and his work.

Persona rules:
- Address Krishna directly and casually: "Hey Krishna!", "Sure thing,", "Here's what I found..."
- Be direct, efficient, and conversational - no formal receptionist tone
- You have full access to both public and private knowledge
- Help Krishna think through ideas, recall notes, plan next steps
- If asked about visitor stats, reference the session data provided
- You can speculate and brainstorm - not just recall facts

Session info (for your greeting):
{session_info}

Full knowledge base:
--- PUBLIC ---
{public_knowledge}

--- PRIVATE (admin only) ---
{private_knowledge}
"""


def _has_admin_passphrase(messages):
    if not ADMIN_PASSPHRASE:
        return False

    for message in messages:
        if message.get("role") != "user":
            continue

        content = str(message.get("content", "")).strip().lower()
        if content == ADMIN_PASSPHRASE.lower():
            return True

    return False


def _clean_messages(raw_messages):
    cleaned_messages = []

    if not isinstance(raw_messages, list):
        return cleaned_messages

    for message in raw_messages:
        if not isinstance(message, dict):
            continue

        role = str(message.get("role", "")).strip()
        content = str(message.get("content", "")).strip()

        if role not in {"user", "assistant"} or not content:
            continue

        # Never forward the admin unlock phrase to the model.
        if role == "user" and ADMIN_PASSPHRASE and content.lower() == ADMIN_PASSPHRASE.lower():
            continue

        cleaned_messages.append({"role": role, "content": content})

    return cleaned_messages


@ensure_csrf_cookie
def home(request):
    return render(
        request,
        "home.html",
        {"home_projects": get_home_projects()},
    )


@ensure_csrf_cookie
def project_detail(request, slug):
    project = get_project(slug)
    if not project:
        raise Http404("Project not found")

    if project["category"] == "video-editing":
        return render(request, "project_video_gallery.html", {"project": project})
    return render(request, "project_detail.html", {"project": project})


@ensure_csrf_cookie
def assistant_page(request):
    """Render the dedicated assistant experience."""
    return render(request, "assistant.html", {})


@require_POST
def chat_api(request):
    """Handle assistant chat messages and return a JSON reply."""
    try:
        body = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    raw_messages = body.get("messages", [])
    if not isinstance(raw_messages, list) or not raw_messages:
        return JsonResponse({"error": "No messages provided"}, status=400)

    unlocked_admin = _has_admin_passphrase(raw_messages)
    if unlocked_admin:
        request.session["assistant_is_admin"] = True

    is_admin = bool(request.session.get("assistant_is_admin", False))
    messages = _clean_messages(raw_messages)
    session_info = str(body.get("session_info", "No session data available.")).strip()

    if not messages:
        return JsonResponse(
            {
                "reply": "Admin mode unlocked. Ask me anything when you're ready.",
                "is_admin": is_admin,
            }
        )

    public_knowledge = load_public_knowledge()
    private_knowledge = load_private_knowledge()

    if is_admin:
        system_prompt = ADMIN_SYSTEM_PROMPT.format(
            session_info=session_info,
            public_knowledge=public_knowledge,
            private_knowledge=private_knowledge,
        )
    else:
        system_prompt = PUBLIC_SYSTEM_PROMPT.format(public_knowledge=public_knowledge)

    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        return JsonResponse({"error": "GROQ_API_KEY not configured"}, status=500)

    try:
        from groq import Groq

        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "system", "content": system_prompt}] + messages,
            max_tokens=GROQ_MAX_TOKENS,
            temperature=GROQ_TEMPERATURE,
        )
        reply = response.choices[0].message.content
        return JsonResponse({"reply": reply, "is_admin": is_admin})
    except ImportError:
        return JsonResponse({"error": "groq package is not installed"}, status=500)
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)
