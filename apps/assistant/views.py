from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
import json
import logging
import re

from django.core.exceptions import RequestDataTooBig
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from apps.analytics.services import track_unique_visit
from apps.portfolio.content.repositories import projects
from .rate_limits import (
    clear_admin_login_attempts,
    consume_admin_login_attempt,
    is_admin_login_rate_limited,
    is_rate_limited,
)
from .knowledge import update_knowledge_file
from .services import MAX_BODY_BYTES, AssistantService, InvalidAssistantRequest

logger = logging.getLogger(__name__)
assistant_service = AssistantService()

ADMIN_SESSION_KEY = "assistant_admin_user_id"
ADMIN_LOGIN_MAX_BODY_BYTES = 4096

# Only authenticated Admin Mode responses may execute these blocks.
_ADMIN_WRITE_BLOCK_RE = re.compile(
    r'<krish_write\s+file="(?P<target>public|private)"\s+'
    r'mode="append"\s*>(?P<content>.*?)</krish_write>',
    re.IGNORECASE | re.DOTALL,
)


def _apply_admin_write_actions(reply, is_admin):
    """Apply explicitly requested, allowlisted append actions in admin mode."""
    if not is_admin:
        return reply

    matches = list(_ADMIN_WRITE_BLOCK_RE.finditer(reply or ""))
    if not matches:
        return reply

    summaries = []
    for match in matches:
        target = match.group("target").lower()
        content = match.group("content").strip()

        if not content:
            summaries.append(f"Could not save to {target}: note was empty.")
            continue

        filename = (
            "krish_public.md" if target == "public"
            else "krish_private.md"
        )

        try:
            update_knowledge_file(filename, "append", content)
            summaries.append(f"Successfully saved a note to {target} knowledge.")
        except Exception as exc:
            logger.exception(
                "Admin knowledge append failed (%s).",
                type(exc).__name__,
            )
            summaries.append(
                f"Could not save to {target} knowledge. "
                "Check the server configuration and logs."
            )

    cleaned_reply = _ADMIN_WRITE_BLOCK_RE.sub("", reply or "").strip()
    confirmation = " ".join(summaries)

    if cleaned_reply:
        return f"{cleaned_reply}\n\n{confirmation}"
    return confirmation


def get_admin_mode_user(request):
    """
    Return the configured active account only when the session is valid.

    This marker is separate from Django's normal authenticated-user session.
    """
    user_id = request.session.get(ADMIN_SESSION_KEY)

    if (
        user_id is None
        or isinstance(user_id, bool)
        or not isinstance(user_id, (int, str))
    ):
        request.session.pop(ADMIN_SESSION_KEY, None)
        return None

    User = get_user_model()

    user = User.objects.filter(
        pk=user_id,
        username=settings.ADMIN_MODE_USERNAME,
        is_active=True,
    ).first()

    if user is None:
        request.session.pop(ADMIN_SESSION_KEY, None)

    return user



@require_POST
def admin_logout(request):
    request.session.pop(ADMIN_SESSION_KEY, None)
    request.session.pop("assistant_is_admin", None)

    # Rotate the session key so the previous session identifier is invalidated.
    request.session.cycle_key()

    return JsonResponse({"ok": True})

@require_POST
def admin_login(request):
    if is_admin_login_rate_limited(request):
        return JsonResponse(
            {"error": "Too many login attempts. Please try again later."},
            status=429,
        )

    try:
        if len(request.body) > ADMIN_LOGIN_MAX_BODY_BYTES:
            return JsonResponse(
                {"error": "Request is too large."},
                status=413,
            )

        body = json.loads(request.body.decode("utf-8"))

    except RequestDataTooBig:
        return JsonResponse({"error": "Request is too large."}, status=413)

    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    if not isinstance(body, dict):
        return JsonResponse(
            {"error": "Request body must be an object."},
            status=400,
        )

    password = body.get("password")

    if not isinstance(password, str) or not password or len(password) > 1024:
        return JsonResponse(
            {"error": "A valid password is required."},
            status=400,
        )

    if not consume_admin_login_attempt(request):
        return JsonResponse(
            {"error": "Too many login attempts. Please try again later."},
            status=429,
        )

    username = settings.ADMIN_MODE_USERNAME
    user = authenticate(request, username=username, password=password)

    if (
        user is None
        or not user.is_active
        or user.get_username() != username
    ):
        return JsonResponse({"error": "Invalid credentials."}, status=401)

    request.session.cycle_key()
    request.session.pop("assistant_is_admin", None)
    request.session[ADMIN_SESSION_KEY] = user.pk

    clear_admin_login_attempts(request)

    return JsonResponse({"ok": True})

@require_GET
def admin_mode_status(request):
    user = get_admin_mode_user(request)
    return JsonResponse({"authenticated": user is not None})


@ensure_csrf_cookie
def assistant_page(request):
    track_unique_visit(request)
    request.session.pop("assistant_is_admin", None)
    from apps.portfolio.content.repositories import site
    settings_content = site.settings()
    return render(request, "pages/assistant.html", {
        "seo": site.page_seo("assistant"),
        "starter_prompts": settings_content.get("assistant_starter_prompts", [
            "What does Krish build?", "Tell me about Udhyog Saathi.", "What does InsightLoop do?",
            "What services are available?", "How does a project work?", "How can I start a project?",
        ]),
    })


def navigation_links(message):
    text = message.casefold()
    links = []
    published = projects.for_work()
    for project in published:
        title = "Udhyog Saathi" if project.get("slug") == "udhyog-saathi-platform" else project.get("title", "")
        slug_words = project.get("slug", "").replace("-", " ")
        if title and (title.casefold() in text or (slug_words and slug_words in text)):
            links.append({"label": title, "href": f"/work/{project['slug']}/"})
    if not links and re.search(r"\b(project|work|case stud(?:y|ies))\b", text):
        links.append({"label": "Selected work", "href": "/work/"})
    route_terms = (
        (r"\b(service|services|offer|hire)\b", "Services", "/services/"),
        (r"\b(process|workflow|how (?:does|do) .* work)\b", "How I work", "/process/"),
        (r"\b(about me|about krishna|about krish|background|who is krishna|who is krish)\b", "About Krish", "/about/"),
        (r"\b(book|booking|contact|start (?:a )?project|work together)\b", "Start a project inquiry", "/book/"),
        (r"\b(resume|résumé|cv|skills)\b", "Resume", "/resume/"),
    )
    for pattern, label, href in route_terms:
        if re.search(pattern, text) and not any(link["href"] == href for link in links):
            links.append({"label": label, "href": href})
    return links[:3]


@require_POST
def chat_api(request):
    try:
        if len(request.body) > MAX_BODY_BYTES:
            return JsonResponse({"error": "Request is too large."}, status=413)
        body = json.loads(request.body.decode("utf-8"))
    except RequestDataTooBig:
        return JsonResponse({"error": "Request is too large."}, status=413)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    if not isinstance(body, dict):
        return JsonResponse({"error": "Request body must be an object."}, status=400)
    try:
        messages = assistant_service.clean_messages(body.get("messages", []))
    except InvalidAssistantRequest as exc:
        return JsonResponse({"error": str(exc)}, status=exc.status_code)
    if is_rate_limited(request):
        return JsonResponse({"error": "Too many messages. Please wait a moment and try again."}, status=429)
    admin_user = get_admin_mode_user(request)
    latest_message = messages[-1]["content"]

    # File-edit commands are handled exclusively by the authenticated server.
    if latest_message.startswith(("/append ", "/replace ", "/write ")):
        if admin_user is None:
            response = JsonResponse(
                {"error": "Admin Mode authentication required."},
                status=403,
            )
            response["Cache-Control"] = "no-store"
            return response

        try:
            lines = latest_message.splitlines()
            header = lines[0].split()

            if header[0] == "/write":
                valid = len(header) == 3 and header[2] == "CONFIRM"
            else:
                valid = len(header) == 2
            if not valid:
                raise ValueError(
                    "Use /append public, /append private, "
                    "/replace public, /replace private, or "
                    "/write public CONFIRM, /write private CONFIRM."
                )

            action = header[0][1:]
            target = header[1]

            if target not in {"public", "private"}:
                raise ValueError("Target must be public or private.")

            filename = (
                "krish_public.md" if target == "public"
                else "krish_private.md"
            )

            if action == "append":
                if len(lines) < 2 or not "\n".join(lines[1:]).strip():
                    raise ValueError(
                        "Put the content to append on the following lines."
                    )
                content = "\n".join(lines[1:])
                update_knowledge_file(filename, "append", content)

            elif action == "write":
                content = "\n".join(lines[1:])
                if not content.strip():
                    raise ValueError(
                        "Put the replacement file contents on the following lines."
                    )
                update_knowledge_file(filename, "write", content)

            else:
                payload = "\n".join(lines[1:])
                delimiter = "\n---REPLACE WITH---\n"

                if delimiter not in payload:
                    raise ValueError(
                        "Separate the old and new text with "
                        "---REPLACE WITH--- on its own line."
                    )

                old_text, new_text = payload.split(delimiter, 1)
                if not old_text or not new_text.strip():
                    raise ValueError(
                        "Both old text and replacement text are required."
                    )

                update_knowledge_file(
                    filename, "replace", new_text, old_text=old_text
                )

            response = JsonResponse({
                "reply": f"Successfully updated the {target} knowledge file.",
                "links": [],
            })
            response["Cache-Control"] = "no-store"
            return response

        except ValueError as exc:
            response = JsonResponse({"error": str(exc)}, status=400)
            response["Cache-Control"] = "no-store"
            return response
        except Exception as exc:
            logger.exception(
                "Admin knowledge update failed (%s).",
                type(exc).__name__,
            )
            response = JsonResponse(
                {"error": "The knowledge file could not be updated."},
                status=503,
            )
            response["Cache-Control"] = "no-store"
            return response

    try:
        reply = assistant_service.generate_reply(
            messages,
            admin_mode=admin_user is not None,
        )
    except Exception as exc:
        # Request bodies and knowledge-file contents are never logged.
        logger.exception(
            "Assistant request failed at stage '%s' (%s).",
            getattr(exc, "stage", "unknown"),
            type(exc).__name__,
        )
        return JsonResponse(
            {"error": "The assistant is temporarily unavailable."},
            status=503,
        )

    reply = _apply_admin_write_actions(
        reply,
        is_admin=admin_user is not None,
    )

    response = JsonResponse({
        "reply": reply,
        "links": navigation_links(
            " ".join(m["content"] for m in messages)
        ),
    })
    if admin_user is not None:
        response["Cache-Control"] = "no-store"
    return response


@require_GET
def admin_private_knowledge(request):
    """Return status metadata only; never send private Markdown to the browser."""
    user = get_admin_mode_user(request)

    if user is None:
        response = JsonResponse(
            {"error": "Admin Mode authentication required."},
            status=401,
        )
    else:
        from pathlib import Path

        private_file = Path(settings.BASE_DIR) / "content" / "krish_private.md"
        response = JsonResponse({
            "available": private_file.is_file(),
        })

    response["Cache-Control"] = "no-store"
    return response
