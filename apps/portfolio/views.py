from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponsePermanentRedirect
from django.shortcuts import redirect, render
from django.urls import reverse
from django.utils.html import json_script
from django.utils.safestring import mark_safe
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.clickjacking import xframe_options_sameorigin

from apps.analytics.services import track_unique_visit
from .content.repositories import profile, projects, services, site, testimonials


RESUME_FILE_NAME = "krishna-goyal-resume.pdf"
RESUME_FILE_PATH = Path(settings.BASE_DIR) / "static" / "resume" / RESUME_FILE_NAME


@ensure_csrf_cookie
def home(request):
    track_unique_visit(request)
    settings_content = site.settings()
    published_services = services.homepage()
    published_capabilities = [
        item for item in settings_content.get("capabilities", [])
        if item.get("content_state") == "published"
    ]
    visible_projects = {item["slug"]: item for item in projects.all()}
    project_priority = (
        "udhyog-saathi-platform",
        "insightloop-business",
        "personal-finance-tracker",
        "portfolio-website",
    )
    ordered_projects = []
    for slug in project_priority:
        project = visible_projects.get(slug)
        if not project or not project.get("featured_on_home"):
            continue
        project = dict(project)
        # These records have conflicting or outdated technology details across
        # the public source files. Keep the project stories, omit disputed stacks.
        if slug in {"udhyog-saathi-platform", "insightloop-business", "portfolio-website"}:
            project["stack"] = []
        if slug == "udhyog-saathi-platform":
            project["title"] = "Udhyog Saathi"
            project["status"] = "building"
        ordered_projects.append(project)

    process_steps = [
        step for step in settings_content.get("process", [])
        if step.get("content_state") == "published"
    ]
    current_build = site.currently_building()
    if current_build:
        current_project = visible_projects.get(current_build.get("project"))
        if not current_project:
            current_build = None
        else:
            current_build = {
                **current_build,
                "title": (
                    "Udhyog Saathi"
                    if current_project["slug"] == "udhyog-saathi-platform"
                    else current_project["title"]
                ),
                "summary": current_build.get("summary") or current_project.get("home_summary") or current_project.get("summary"),
                "url": current_project.get("live_url"),
            }
            if not current_build.get("summary"):
                current_build = None

    request_url = request.build_absolute_uri("/")
    seo = settings_content.get("seo", {})
    person_schema = {"@context": "https://schema.org", "@type": "Person", "name": "Krishna Goyal", "url": request_url}
    website_schema = {"@context": "https://schema.org", "@type": "WebSite", "name": settings_content.get("name", "Krishna Goyal"), "url": request_url}
    # json_script escapes content for HTML script nodes; preserve that escaping
    # while using the JSON-LD media type required by search engines.
    person_jsonld = mark_safe(
        str(json_script(person_schema, "person-structured-data")).replace(
            'type="application/json"', 'type="application/ld+json"'
        )
    )
    website_jsonld = mark_safe(
        str(json_script(website_schema, "website-structured-data")).replace(
            'type="application/json"', 'type="application/ld+json"'
        )
    )
    return render(
        request,
        "pages/home.html",
        {
            "lead_project": ordered_projects[0] if ordered_projects else None,
            "secondary_project": ordered_projects[1] if len(ordered_projects) > 1 else None,
            "supporting_projects": ordered_projects[2:],
            "capabilities": published_capabilities,
            "published_services": published_services,
            "process_steps": process_steps,
            "current_build": current_build,
            "engagement_models": [
                model for model in settings_content.get("engagement_models", [])
                if model.get("content_state") == "published"
            ],
            "published_testimonials": testimonials.all(),
            "published_faq": site.faq(),
            "assistant_prompts": [
                "What can Krishna build?",
                "Show me relevant projects.",
                "How does working with Krishna work?",
                "I’m looking for a web application.",
            ],
            "home_seo": seo,
            "home_canonical": request_url,
            "person_jsonld": person_jsonld,
            "website_jsonld": website_jsonld,
            "home_has_projects": bool(ordered_projects),
            "home_has_capabilities": bool(published_services or published_capabilities),
            "home_has_process": bool(process_steps),
        },
    )


@ensure_csrf_cookie
def work_index(request):
    track_unique_visit(request)
    work_projects = projects.for_work()
    featured_projects = [item for item in work_projects if item["case_study"].get("featured")]
    supporting_projects = [item for item in work_projects if not item["case_study"].get("featured")]
    canonical = request.build_absolute_uri(reverse("work_index"))
    return render(request, "pages/work.html", {
        "featured_projects": featured_projects,
        "supporting_projects": supporting_projects,
        "work_canonical": canonical,
        "work_description": "Selected product and software work by Krishna Goyal, spanning manufacturing software, business tools, and developer tooling.",
    })


@ensure_csrf_cookie
def project_detail(request, slug):
    track_unique_visit(request)
    project = projects.get(slug)
    if not project or not isinstance(project.get("case_study"), dict) or project["case_study"].get("publication_state") != "published":
        raise Http404("Project not found")
    ordered = projects.for_work()
    index = next(i for i, item in enumerate(ordered) if item["slug"] == slug)
    case = project["case_study"]
    canonical = request.build_absolute_uri(reverse("work_project_detail", args=[slug]))
    structured_data = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": case["title"],
        "description": case["summary"],
        "url": canonical,
    }
    case_jsonld = mark_safe(str(json_script(structured_data, "case-study-structured-data")).replace(
        'type="application/json"', 'type="application/ld+json"'
    ))
    return render(request, "pages/project_detail.html", {
        "project": project,
        "case": case,
        "previous_project": ordered[index - 1] if index > 0 else None,
        "next_project": ordered[index + 1] if index + 1 < len(ordered) else None,
        "case_canonical": canonical,
        "case_jsonld": case_jsonld,
    })


def legacy_project_redirect(request, slug):
    project = projects.get(slug)
    if not project:
        project = projects.get(slug, published_only=False)
    if not project:
        raise Http404("Project not found")
    if not isinstance(project.get("case_study"), dict) or project["case_study"].get("publication_state") != "published":
        return HttpResponsePermanentRedirect(reverse("work_index"))
    return HttpResponsePermanentRedirect(reverse("work_project_detail", args=[slug]))


def services_page(request):
    track_unique_visit(request)
    published_services = services.all()
    work_by_slug = {item["slug"]: item for item in projects.for_work()}
    for service in published_services:
        service["related_work"] = [
            work_by_slug[slug]
            for slug in service.get("related_projects", [])
            if slug in work_by_slug
        ]
    page_seo = site.page_seo("services")
    canonical = request.build_absolute_uri(reverse("services"))
    return render(request, "pages/services.html", {
        "services": published_services,
        "engagement_models": site.pricing(),
        "process_steps": site.process(),
        "audiences": site.audiences(),
        "services_seo": page_seo,
        "services_canonical": canonical,
    })


def about_page(request):
    track_unique_visit(request)
    page_seo = site.page_seo("about")
    canonical = request.build_absolute_uri(reverse("about"))
    selected_work = [
        item for item in projects.for_work()
        if item["slug"] in {"udhyog-saathi-platform", "insightloop-business"}
    ]
    return render(request, "pages/about.html", {
        "about_profile": profile.about(),
        "about_work": selected_work,
        "about_seo": page_seo,
        "about_canonical": canonical,
    })


def process_page(request):
    track_unique_visit(request)
    page_seo = site.page_seo("process")
    canonical = request.build_absolute_uri(reverse("process"))
    return render(request, "pages/process.html", {
        "process_steps": site.process(),
        "process_journey": site.process_journey(),
        "process_seo": page_seo,
        "process_canonical": canonical,
    })


def resume_page(request):
    track_unique_visit(request)
    return render(request, "pages/resume.html", {
        **profile.resume(),
        "resume_seo": site.page_seo("resume"),
        "resume_canonical": request.build_absolute_uri(reverse("resume")),
    })


def _get_resume_path():
    if not RESUME_FILE_PATH.exists():
        raise Http404("Resume not found")
    return RESUME_FILE_PATH


@xframe_options_sameorigin
def resume_file(request):
    return FileResponse(
        _get_resume_path().open("rb"),
        content_type="application/pdf",
        filename=RESUME_FILE_NAME,
    )


def resume_download(request):
    return FileResponse(
        _get_resume_path().open("rb"),
        as_attachment=True,
        content_type="application/pdf",
        filename=RESUME_FILE_NAME,
    )
