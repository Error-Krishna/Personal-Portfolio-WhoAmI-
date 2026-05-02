import json
import os
import re

from django.conf import settings
from django.http import FileResponse, Http404, JsonResponse
from django.shortcuts import render
from django.utils.timezone import localdate
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.views.decorators.clickjacking import xframe_options_sameorigin

from .content import (
    get_home_projects,
    get_project,
    load_private_knowledge,
    load_public_knowledge,
    write_knowledge_file,
)
from .models import DailyVisitorStat

ADMIN_PASSPHRASE = os.environ.get("KRISH_ADMIN_PASSPHRASE", "").strip()
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
GROQ_MAX_TOKENS = int(os.environ.get("GROQ_MAX_TOKENS", "500"))
GROQ_TEMPERATURE = float(os.environ.get("GROQ_TEMPERATURE", "0.7"))
RESUME_FILE_NAME = "krishna-goyal-resume.pdf"
RESUME_FILE_PATH = settings.BASE_DIR / "static" / "resume" / RESUME_FILE_NAME

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
- You have read-only access to public knowledge and zero authority to write or modify any knowledge files

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
- You may update the public and private knowledge files only when Krishna explicitly asks you to save, add, update, or replace knowledge
- Help Krishna think through ideas, recall notes, plan next steps
- If asked about visitor stats, reference the session data provided
- You can speculate and brainstorm - not just recall facts

Admin writing protocol:
- When Krishna explicitly asks you to write or update persistent knowledge, include one or more blocks in this exact format:
  <krish_write file="public|private" mode="append|replace">
  content to write
  </krish_write>
- Use `append` to add notes and `replace` only when Krishna clearly wants to overwrite a file or section wholesale
- You can include a short normal response outside those tags if helpful
- Never use write blocks unless Krishna is clearly asking for persistent changes

Session info (for your greeting):
{session_info}

Full knowledge base:
--- PUBLIC ---
{public_knowledge}

--- PRIVATE (admin only) ---
{private_knowledge}
"""
WRITE_BLOCK_RE = re.compile(
    r"<krish_write\s+file=\"(?P<file>public|private)\"\s+mode=\"(?P<mode>append|replace)\">(?P<content>.*?)</krish_write>",
    re.IGNORECASE | re.DOTALL,
)


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


def _apply_admin_write_actions(reply: str, is_admin: bool):
    if not is_admin:
        return reply

    matches = list(WRITE_BLOCK_RE.finditer(reply or ""))
    if not matches:
        return reply

    write_summaries = []
    for match in matches:
        target = match.group("file").lower()
        mode = match.group("mode").lower()
        content = match.group("content").strip()

        try:
            write_knowledge_file(target, content, mode)
            write_summaries.append(f"Saved to `{target}` knowledge using `{mode}` mode.")
        except ValueError as exc:
            write_summaries.append(f"Could not write `{target}` knowledge: {exc}.")

    cleaned_reply = WRITE_BLOCK_RE.sub("", reply).strip()
    summary_text = " ".join(write_summaries).strip()
    if cleaned_reply and summary_text:
        return cleaned_reply + "\n\n" + summary_text
    if summary_text:
        return summary_text
    return cleaned_reply


def _track_unique_portfolio_visit(request):
    today = localdate()
    today_key = today.isoformat()

    if not request.session.session_key:
        request.session.create()

    if request.session.get("portfolio_unique_visit_date") == today_key:
        return

    stat, _ = DailyVisitorStat.objects.get_or_create(date=today, defaults={"unique_visitors": 0})
    stat.unique_visitors += 1
    stat.save(update_fields=["unique_visitors"])
    request.session["portfolio_unique_visit_date"] = today_key


def _get_admin_stats():
    today = localdate()
    stat, _ = DailyVisitorStat.objects.get_or_create(date=today, defaults={"unique_visitors": 0})
    return {
        "date": today.isoformat(),
        "unique_users_today": stat.unique_visitors,
    }


@ensure_csrf_cookie
def home(request):
    _track_unique_portfolio_visit(request)
    return render(
        request,
        "home.html",
        {"home_projects": get_home_projects()},
    )


@ensure_csrf_cookie
def project_detail(request, slug):
    _track_unique_portfolio_visit(request)
    project = get_project(slug)
    if not project:
        raise Http404("Project not found")

    if project["category"] == "video-editing":
        return render(request, "project_video_gallery.html", {"project": project})
    return render(request, "project_detail.html", {"project": project})


@ensure_csrf_cookie
def assistant_page(request):
    """Render the dedicated assistant experience."""
    _track_unique_portfolio_visit(request)
    return render(request, "assistant.html", {})


def resume_page(request):
    """Render the in-site resume viewer."""
    _track_unique_portfolio_visit(request)
    resume_context = {
        "resume": {
            "name": "Krishna Goyal",
            "contact_links": [
                {"label": "E-Mail Id", "url": "mailto:iamkrishnagoyal@gmail.com"},
                {"label": "Phone Number", "url": "tel:+919064700906"},
                {"label": "Portfolio", "url": "https://personal-portfolio-whoami-1.onrender.com"},
                {"label": "LinkedIn", "url": "https://linkedin.com/in/krishna2611"},
                {"label": "GitHub", "url": "https://github.com/Error-Krishna"},
            ],
            "education": [
                {
                    "title": "Vellore Institute of Technology",
                    "subtitle": "B.Tech in Computer Science -- Amaravati, India",
                    "meta": "Graduating in 2027",
                    "details": ["CGPA: 7.95/10.0"],
                    "highlights": [
                        {
                            "label": "Relevant Coursework",
                            "text": "Computer Networks, Operating Systems, DBMS, Object-Oriented Programming, NoSQL Databases.",
                        }
                    ],
                },
                {
                    "title": "Satynarayan Academy",
                    "subtitle": "PCM with Computer Science -- West Bengal, India",
                    "meta": "2023",
                    "details": ["Class 12th Percentage: 86.2/100"],
                    "highlights": [],
                },
            ],
            "skills": [
                {"label": "Languages", "value": "Java, Python, JavaScript, HTML/CSS, SQL"},
                {"label": "Frameworks & Libraries", "value": "React.js, Node.js, Express.js, Django, Flask"},
                {"label": "Databases", "value": "MongoDB, MySQL, Firebase, Redis"},
                {"label": "Tools & Platforms", "value": "Git, GitHub, AWS, Notion, Trello (familiar), MongoDB Compass"},
            ],
            "projects": [
                {
                    "title": "Udhyog Saathi",
                    "subtitle": "SaaS Product (Business Operating System)",
                    "links": [
                        {"label": "[GitHub]", "url": "https://github.com/Manish-bhargava/udhyog-saathi-frontend"},
                        {"label": "[GitHub]", "url": "https://github.com/Manish-bhargava/udhyog-saath-backend/"},
                        {"label": "[Live]", "url": "https://udhyogsaathi.in/"},
                    ],
                    "highlights": [
                        "Designed a SaaS-based Business Operating System for MSMEs to centralize billing, inventory, and workforce management into a single platform.",
                        "Defined and structured end-to-end business workflows (billing, stock tracking, worker management), improving process clarity and reducing manual dependency.",
                        "Developed system architecture and dashboards to provide real-time visibility into operations, enabling data-driven decision making.",
                        "Identified operational bottlenecks and proposed automation workflows (event-based triggers, WhatsApp integration) to improve efficiency and scalability.",
                    ],
                },
                {
                    "title": "HotReload",
                    "subtitle": "Developer Tool (CLI)",
                    "links": [
                        {"label": "[GitHub]", "url": "https://github.com/Error-Krishna/hotreload"},
                        {"label": "[Demo]", "url": "https://www.loom.com/share/773d4d8fdd1840128b92929643a08965"},
                    ],
                    "highlights": [
                        "Created a CLI tool in Go that automates server rebuilds and restarts on file changes, eliminating manual stop/rebuild steps and accelerating development feedback loops.",
                        "Implemented recursive file watching with fsnotify, debouncing to handle rapid events, and process management for graceful server restarts; supports multiple project types with auto-detection.",
                        "Designed modular architecture with separate packages for watching, building, running, and project detection, ensuring maintainability and extensibility.",
                        {"label": "Technologies Used", "text": "Go, fsnotify, CLI design, process lifecycle management."},
                    ],
                },
                {
                    "title": "InsightLoop",
                    "subtitle": "Web Application",
                    "links": [
                        {"label": "[GitHub]", "url": "https://github.com/Error-Krishna/InsightLoop"},
                        {"label": "[Live Link]", "url": "https://insightloop.onrender.com/"},
                    ],
                    "highlights": [
                        "Developed a full-stack business management platform to track sales, payments, workers, and profit-loss via a real-time auto-updating dashboard.",
                        "Integrated WebSockets for live data synchronization and an AI assistant to streamline operations and improve decision-making.",
                        {"label": "Technologies Used", "text": "MongoDB, Express.js, React.js, Node.js"},
                    ],
                },
            ],
            "hackathons": [
                {
                    "label": "EY Techathon 5.0",
                    "text": "Successfully cleared Round 1 of the national competition.",
                },
                {
                    "label": "Smart India Hackathon 2023",
                    "text": "Participated in the national-level hackathon.",
                },
            ],
            "certifications": [
                {
                    "issuer": "BlackBucks",
                    "title": "Full Stack Development (MERN)",
                    "url": "https://drive.google.com/file/d/1XicthKv4BbeKMkCCEPDSseEfGlylK0Ce/view?usp=sharing",
                },
                {
                    "issuer": "Corizo",
                    "title": "Cloud Computing (AWS)",
                    "url": "https://drive.google.com/file/d/1Vpar3ulUsRu0NGGT59QtBD-WaD4u_RAQ/view?usp=drive_link",
                },
            ],
            "leadership": [
                {
                    "meta": "VIT-AP",
                    "title": "President",
                    "subtitle": "Hindi Association",
                    "highlights": [
                        "Led the university's Hindi association, organizing various cultural events and activities for the student community."
                    ],
                },
                {
                    "meta": "",
                    "title": "State-Coordinator",
                    "subtitle": "UP State Rally, University Fest",
                    "highlights": [
                        "Coordinated a state-level rally, managing logistics and participation as part of the university's annual festival."
                    ],
                },
            ],
        },
    }
    return render(request, "resume.html", resume_context)


def _get_resume_path():
    if not RESUME_FILE_PATH.exists():
        raise Http404("Resume not found")
    return RESUME_FILE_PATH


@xframe_options_sameorigin
def resume_file(request):
    """Serve the resume PDF inline for in-browser viewing."""
    resume_path = _get_resume_path()
    return FileResponse(
        resume_path.open("rb"),
        content_type="application/pdf",
        filename=RESUME_FILE_NAME,
    )


def resume_download(request):
    """Serve the resume PDF as a download."""
    resume_path = _get_resume_path()
    return FileResponse(
        resume_path.open("rb"),
        as_attachment=True,
        content_type="application/pdf",
        filename=RESUME_FILE_NAME,
    )


def health_check(request):
    return JsonResponse({"status": "ok"})


def assistant_stats_api(request):
    if not bool(request.session.get("assistant_is_admin", False)):
        return JsonResponse({"error": "Admin mode required"}, status=403)

    return JsonResponse({"stats": _get_admin_stats()})


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
                "admin_stats": _get_admin_stats() if is_admin else None,
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
        reply = _apply_admin_write_actions(response.choices[0].message.content, is_admin)
        return JsonResponse(
            {
                "reply": reply,
                "is_admin": is_admin,
                "admin_stats": _get_admin_stats() if is_admin else None,
            }
        )
    except ImportError:
        return JsonResponse({"error": "groq package is not installed"}, status=500)
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)
