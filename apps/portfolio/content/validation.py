"""Validation for the current and incrementally migrated portfolio content."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
PROJECT_STATUSES = {"active", "completed", "archived", "building"}
CONTENT_STATES = {"draft", "published", "tbd"}
PUBLICATION_STATES = {"published", "unpublished"}
LEGACY_PROJECT_FIELDS = {
    "slug",
    "title",
    "tagline",
    "category",
    "tech_stack",
    "detailed_description",
}
STRUCTURED_PROJECT_FIELDS = {"slug", "title", "category", "summary"}
SERVICE_CATEGORIES = {
    "Websites",
    "Web Applications",
    "Product Development",
    "Automation",
    "Data & Analytics",
}
SERVICE_FIELDS = {"slug", "name", "category"}
TESTIMONIAL_FIELDS = {"id", "name", "role", "company", "quote", "project", "approved"}
PRICING_FIELDS = {"slug", "name", "description"}
PRICING_TIERS = {"Launch", "Build", "Scale"}
FAQ_FIELDS = {"id", "question", "answer"}


class ContentValidationError(ValueError):
    """Raised when one or more content files do not match their schema."""


def _read_json(path: Path, errors: list[str]) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"{path}: cannot read valid JSON ({exc}).")
        return None


def _check_required_fields(
    value: dict[str, Any], required: set[str], path: Path, errors: list[str]
) -> None:
    missing = sorted(field for field in required if field not in value)
    if missing:
        errors.append(f"{path}: missing required fields: {', '.join(missing)}.")


def _check_content_state(value: dict[str, Any], path: Path, errors: list[str]) -> None:
    if "content_state" in value and (
        not isinstance(value["content_state"], str) or value["content_state"] not in CONTENT_STATES
    ):
        errors.append(f"{path}: content_state must be one of {', '.join(sorted(CONTENT_STATES))}.")


def validate_content(base_dir: Path) -> dict[str, int]:
    """Validate current JSON content and any structured content migrated later."""
    content_dir = base_dir / "content"
    errors: list[str] = []
    project_slugs: set[str] = set()
    project_count = 0

    legacy_projects_path = content_dir / "projects.json"
    legacy_projects = _read_json(legacy_projects_path, errors) if legacy_projects_path.exists() else []
    if isinstance(legacy_projects, list):
        for index, project in enumerate(legacy_projects):
            location = f"{legacy_projects_path}[{index}]"
            if not isinstance(project, dict):
                errors.append(f"{location}: each project must be an object.")
                continue
            _check_required_fields(project, LEGACY_PROJECT_FIELDS, Path(location), errors)
            slug = project.get("slug")
            if not isinstance(slug, str) or not SLUG_RE.fullmatch(slug):
                errors.append(f"{location}: slug must be lowercase words separated by hyphens.")
            elif slug in project_slugs:
                errors.append(f"{location}: duplicate project slug '{slug}'.")
            else:
                project_slugs.add(slug)
            if not isinstance(project.get("title"), str) or not project.get("title", "").strip():
                errors.append(f"{location}: title must be a non-empty string.")
            if not isinstance(project.get("tech_stack"), list) or not all(
                isinstance(item, str) for item in project.get("tech_stack", [])
            ):
                errors.append(f"{location}: tech_stack must be a list of strings.")
            if "featured_on_home" in project and not isinstance(project["featured_on_home"], bool):
                errors.append(f"{location}: featured_on_home must be a boolean.")
            _check_content_state(project, Path(location), errors)
            if "publication_state" in project and project["publication_state"] not in PUBLICATION_STATES:
                errors.append(f"{location}: publication_state must be published or unpublished.")
            case = project.get("case_study")
            if case is not None:
                if not isinstance(case, dict):
                    errors.append(f"{location}: case_study must be an object when provided.")
                else:
                    for required in ("publication_state", "priority", "title", "category", "summary"):
                        if required not in case:
                            errors.append(f"{location}.case_study: missing required field {required}.")
                    if case.get("publication_state") not in PUBLICATION_STATES:
                        errors.append(f"{location}.case_study: publication_state must be published or unpublished.")
                    if "priority" in case and (not isinstance(case["priority"], int) or isinstance(case["priority"], bool)):
                        errors.append(f"{location}.case_study: priority must be an integer.")
                    for field in ("title", "category", "summary", "role", "status", "context", "problem", "approach", "solution", "outcome", "learnings"):
                        if field in case and case[field] is not None and not isinstance(case[field], str):
                            errors.append(f"{location}.case_study: {field} must be text or null.")
                    for field in ("features", "technologies", "links", "images", "metrics"):
                        if field in case and not isinstance(case[field], list):
                            errors.append(f"{location}.case_study: {field} must be an array.")
                    for link in case.get("links", []) if isinstance(case.get("links", []), list) else []:
                        if not isinstance(link, dict) or not isinstance(link.get("label"), str) or not isinstance(link.get("url"), str):
                            errors.append(f"{location}.case_study: each link needs a label and URL.")
                    for image in case.get("images", []) if isinstance(case.get("images", []), list) else []:
                        if not isinstance(image, dict) or not isinstance(image.get("url"), str) or not isinstance(image.get("alt"), str):
                            errors.append(f"{location}.case_study: each image needs a URL and alt text.")
            project_count += 1
    elif legacy_projects_path.exists():
        errors.append(f"{legacy_projects_path}: the top-level value must be an array.")

    structured_projects_dir = content_dir / "projects"
    if structured_projects_dir.exists():
        for path in sorted(structured_projects_dir.glob("*.json")):
            project = _read_json(path, errors)
            if not isinstance(project, dict):
                errors.append(f"{path}: a project file must contain an object.")
                continue
            _check_required_fields(project, STRUCTURED_PROJECT_FIELDS, path, errors)
            slug = project.get("slug")
            if not isinstance(slug, str) or not SLUG_RE.fullmatch(slug):
                errors.append(f"{path}: slug must be lowercase words separated by hyphens.")
            elif slug in project_slugs:
                errors.append(f"{path}: duplicate project slug '{slug}'.")
            else:
                project_slugs.add(slug)
            if "status" in project and project["status"] not in PROJECT_STATUSES:
                errors.append(f"{path}: status must be one of {', '.join(sorted(PROJECT_STATUSES))}.")
            for optional_list in (
                "outcomes", "features", "stack", "architecture", "screenshots", "images"
            ):
                if optional_list in project and not isinstance(project[optional_list], list):
                    errors.append(f"{path}: {optional_list} must be an array when provided.")
            for optional_text in (
                "short_title", "client_type", "role", "problem", "approach", "solution", "video"
            ):
                if optional_text in project and project[optional_text] is not None and not isinstance(
                    project[optional_text], str
                ):
                    errors.append(f"{path}: {optional_text} must be a string or null when provided.")
            if "featured" in project and not isinstance(project["featured"], bool):
                errors.append(f"{path}: featured must be a boolean when provided.")
            _check_content_state(project, path, errors)
            if "priority" in project and not isinstance(project["priority"], (int, float)):
                errors.append(f"{path}: priority must be numeric when provided.")
            if "metrics" in project and not isinstance(project["metrics"], (dict, list)):
                errors.append(f"{path}: metrics must be an object or array when provided.")
            if "links" in project and not isinstance(project["links"], dict):
                errors.append(f"{path}: links must be an object when provided.")
            project_count += 1
    if project_count == 0:
        errors.append(f"{content_dir}: at least one project record is required.")

    services_path = content_dir / "services" / "services.json"
    services = _read_json(services_path, errors)
    if isinstance(services, list):
        service_slugs: set[str] = set()
        for index, service in enumerate(services):
            location = Path(f"{services_path}[{index}]")
            if not isinstance(service, dict):
                errors.append(f"{location}: each service must be an object.")
                continue
            _check_required_fields(service, SERVICE_FIELDS, location, errors)
            _check_content_state(service, location, errors)
            if "category" in service and service["category"] not in SERVICE_CATEGORIES:
                errors.append(
                    f"{location}: category must be one of {', '.join(sorted(SERVICE_CATEGORIES))}."
                )
            for optional_list in ("deliverables", "ideal_client", "ideal_for", "features", "includes", "excludes", "scope", "technologies", "related_projects"):
                if optional_list in service and (
                    not isinstance(service[optional_list], list)
                    or not all(isinstance(item, str) for item in service[optional_list])
                ):
                    errors.append(f"{location}: {optional_list} must be an array of text when provided.")
            for optional_text in ("description", "short_description", "full_description", "timeline", "currency", "cta", "pricing_note"):
                if optional_text in service and not isinstance(service[optional_text], str):
                    errors.append(f"{location}: {optional_text} must be text when provided.")
            if "show_on_home" in service and not isinstance(service["show_on_home"], bool):
                errors.append(f"{location}: show_on_home must be a boolean when provided.")
            if "starting_price" in service and service["starting_price"] is not None and not isinstance(
                service["starting_price"], (str, int, float)
            ):
                errors.append(f"{location}: starting_price must be text, a number, or null.")
            slug = service.get("slug")
            if not isinstance(slug, str) or not SLUG_RE.fullmatch(slug):
                errors.append(f"{location}: slug must be lowercase words separated by hyphens.")
            elif slug in service_slugs:
                errors.append(f"{location}: duplicate service slug '{slug}'.")
            else:
                service_slugs.add(slug)
            for related_slug in service.get("related_projects", []):
                if related_slug not in project_slugs:
                    errors.append(f"{location}: related_projects references unknown project '{related_slug}'.")
    else:
        errors.append(f"{services_path}: the top-level value must be an array.")

    testimonials_path = content_dir / "testimonials" / "testimonials.json"
    testimonials = _read_json(testimonials_path, errors)
    if isinstance(testimonials, list):
        testimonial_ids: set[str] = set()
        for index, testimonial in enumerate(testimonials):
            location = Path(f"{testimonials_path}[{index}]")
            if not isinstance(testimonial, dict):
                errors.append(f"{location}: each testimonial must be an object.")
                continue
            _check_required_fields(testimonial, TESTIMONIAL_FIELDS, location, errors)
            testimonial_id = testimonial.get("id")
            if not isinstance(testimonial_id, str) or not testimonial_id.strip():
                errors.append(f"{location}: id must be a non-empty string.")
            elif testimonial_id in testimonial_ids:
                errors.append(f"{location}: duplicate testimonial id '{testimonial_id}'.")
            else:
                testimonial_ids.add(testimonial_id)
            if testimonial.get("project") not in project_slugs:
                errors.append(f"{location}: project must reference a known project slug.")
            if not isinstance(testimonial.get("approved"), bool):
                errors.append(f"{location}: approved must be a boolean.")
            _check_content_state(testimonial, location, errors)
    else:
        errors.append(f"{testimonials_path}: the top-level value must be an array.")

    site_path = content_dir / "site" / "settings.json"
    site_settings = _read_json(site_path, errors)
    if not isinstance(site_settings, dict):
        errors.append(f"{site_path}: the top-level value must be an object.")
    else:
        for field in ("name", "title", "description", "positioning"):
            if field in site_settings and not isinstance(site_settings[field], str):
                errors.append(f"{site_path}: {field} must be a string when provided.")
        for field in ("navigation", "social_links"):
            if field in site_settings and not isinstance(site_settings[field], list):
                errors.append(f"{site_path}: {field} must be an array when provided.")
        for field in ("contact", "cta_labels", "seo"):
            if field in site_settings and not isinstance(site_settings[field], dict):
                errors.append(f"{site_path}: {field} must be an object when provided.")
        if "process" in site_settings:
            if not isinstance(site_settings["process"], list):
                errors.append(f"{site_path}: process must be an array when provided.")
            else:
                for index, step in enumerate(site_settings["process"]):
                    location = Path(f"{site_path}.process[{index}]")
                    if not isinstance(step, dict):
                        errors.append(f"{location}: each process step must be an object.")
                        continue
                    _check_required_fields(
                        step,
                        {"name", "description", "what_happens", "client_can_expect", "purpose"},
                        location,
                        errors,
                    )
                    _check_content_state(step, location, errors)
                    for field in ("what_happens", "client_can_expect", "purpose"):
                        if field in step and (not isinstance(step[field], str) or not step[field].strip()):
                            errors.append(f"{location}: {field} must be non-empty text when provided.")
                    if "deliverables" in step and not isinstance(step["deliverables"], list):
                        errors.append(f"{location}: deliverables must be an array when provided.")
        for journey_name in ("process_journey", "booking_journey"):
            if journey_name not in site_settings:
                continue
            journey = site_settings[journey_name]
            if not isinstance(journey, dict):
                errors.append(f"{site_path}: {journey_name} must be an object when provided.")
            else:
                if not isinstance(journey.get("summary"), str) or not journey["summary"].strip():
                    errors.append(f"{site_path}: {journey_name}.summary must be non-empty text.")
                if (
                    not isinstance(journey.get("labels"), list)
                    or not all(isinstance(label, str) and label.strip() for label in journey["labels"])
                ):
                    errors.append(f"{site_path}: {journey_name}.labels must be an array of non-empty text.")
        for field, required in (("capabilities", {"name", "description"}), ("engagement_models", {"name"})):
            if field not in site_settings:
                continue
            records = site_settings[field]
            if not isinstance(records, list):
                errors.append(f"{site_path}: {field} must be an array when provided.")
                continue
            for index, record in enumerate(records):
                location = Path(f"{site_path}.{field}[{index}]")
                if not isinstance(record, dict):
                    errors.append(f"{location}: each record must be an object.")
                    continue
                _check_required_fields(record, required, location, errors)
                _check_content_state(record, location, errors)
                if "description" in record and not isinstance(record["description"], str):
                    errors.append(f"{location}: description must be text.")
                if "ideal_for" in record and (
                    not isinstance(record["ideal_for"], list)
                    or not all(isinstance(item, str) for item in record["ideal_for"])
                ):
                    errors.append(f"{location}: ideal_for must be an array of text.")
        if "audiences" in site_settings:
            audiences = site_settings["audiences"]
            if not isinstance(audiences, list):
                errors.append(f"{site_path}: audiences must be an array when provided.")
            else:
                for index, audience in enumerate(audiences):
                    location = Path(f"{site_path}.audiences[{index}]")
                    if not isinstance(audience, dict):
                        errors.append(f"{location}: each audience must be an object.")
                        continue
                    _check_required_fields(audience, {"name", "description"}, location, errors)
                    _check_content_state(audience, location, errors)
                    for field in ("name", "description"):
                        if field in audience and not isinstance(audience[field], str):
                            errors.append(f"{location}: {field} must be text.")
        if "currently_building" in site_settings:
            current = site_settings["currently_building"]
            if not isinstance(current, dict):
                errors.append(f"{site_path}: currently_building must be an object when provided.")
            else:
                if not isinstance(current.get("content_state"), str) or current.get("content_state") not in CONTENT_STATES:
                    errors.append(f"{site_path}: currently_building.content_state must be draft, published, or tbd.")
                if current.get("status") not in PROJECT_STATUSES:
                    errors.append(f"{site_path}: currently_building.status must be active, completed, archived, or building.")
                if current.get("project") not in project_slugs:
                    errors.append(f"{site_path}: currently_building.project must reference a known project slug.")
        if isinstance(site_settings.get("seo"), dict):
            for field in ("title", "description", "canonical", "og_title", "og_description", "og_image", "twitter_card"):
                if field in site_settings["seo"] and not isinstance(site_settings["seo"][field], str):
                    errors.append(f"{site_path}: seo.{field} must be a string when provided.")
            for page in ("services", "about", "process", "booking"):
                page_seo = site_settings["seo"].get(page)
                if page_seo is not None:
                    if not isinstance(page_seo, dict):
                        errors.append(f"{site_path}: seo.{page} must be an object when provided.")
                    else:
                        for field in ("title", "description"):
                            if field in page_seo and not isinstance(page_seo[field], str):
                                errors.append(f"{site_path}: seo.{page}.{field} must be text.")

    pricing_path = content_dir / "site" / "pricing.json"
    pricing = _read_json(pricing_path, errors) if pricing_path.exists() else []
    if isinstance(pricing, list):
        package_slugs: set[str] = set()
        for index, package in enumerate(pricing):
            location = Path(f"{pricing_path}[{index}]")
            if not isinstance(package, dict):
                errors.append(f"{location}: each package must be an object.")
                continue
            _check_required_fields(package, PRICING_FIELDS, location, errors)
            for field in ("slug", "name", "description"):
                if field in package and not isinstance(package[field], str):
                    errors.append(f"{location}: {field} must be text.")
            if package.get("name") not in PRICING_TIERS:
                errors.append(f"{location}: name must be Launch, Build, or Scale.")
            slug = package.get("slug")
            if not isinstance(slug, str) or not SLUG_RE.fullmatch(slug):
                errors.append(f"{location}: slug must be lowercase words separated by hyphens.")
            elif slug in package_slugs:
                errors.append(f"{location}: duplicate pricing package slug '{slug}'.")
            else:
                package_slugs.add(slug)
            _check_content_state(package, location, errors)
            for field in ("features", "ideal_for", "includes", "excludes"):
                if field in package and (
                    not isinstance(package[field], list)
                    or not all(isinstance(item, str) for item in package[field])
                ):
                    errors.append(f"{location}: {field} must be an array of text when provided.")
            for field in ("currency", "timeline", "cta", "pricing_note"):
                if field in package and not isinstance(package[field], str):
                    errors.append(f"{location}: {field} must be text when provided.")
            if "custom_quote" in package and not isinstance(package["custom_quote"], bool):
                errors.append(f"{location}: custom_quote must be a boolean when provided.")
            if "featured" in package and not isinstance(package["featured"], bool):
                errors.append(f"{location}: featured must be a boolean when provided.")
            if "starting_price" in package and package["starting_price"] is not None and (
                not isinstance(package["starting_price"], (int, float)) or isinstance(package["starting_price"], bool)
            ):
                errors.append(f"{location}: starting_price must be a number or null.")
    else:
        errors.append(f"{pricing_path}: the top-level value must be an array.")

    faq_path = content_dir / "site" / "faq.json"
    faq = _read_json(faq_path, errors) if faq_path.exists() else []
    if isinstance(faq, list):
        faq_ids: set[str] = set()
        for index, entry in enumerate(faq):
            location = Path(f"{faq_path}[{index}]")
            if not isinstance(entry, dict):
                errors.append(f"{location}: each FAQ entry must be an object.")
                continue
            _check_required_fields(entry, FAQ_FIELDS, location, errors)
            faq_id = entry.get("id")
            if not isinstance(faq_id, str) or not faq_id.strip():
                errors.append(f"{location}: id must be a non-empty string.")
            elif faq_id in faq_ids:
                errors.append(f"{location}: duplicate FAQ id '{faq_id}'.")
            else:
                faq_ids.add(faq_id)
            _check_content_state(entry, location, errors)
    else:
        errors.append(f"{faq_path}: the top-level value must be an array.")

    resume_path = content_dir / "profile" / "resume.json"
    if resume_path.exists():
        resume = _read_json(resume_path, errors)
        if not isinstance(resume, dict) or not isinstance(resume.get("resume"), dict):
            errors.append(f"{resume_path}: expected an object containing a resume object.")
        elif "public_profile" in resume:
            public_profile = resume["public_profile"]
            if not isinstance(public_profile, dict):
                errors.append(f"{resume_path}: public_profile must be an object when provided.")
            else:
                for field in ("introduction", "approach", "focus"):
                    if not isinstance(public_profile.get(field), str) or not public_profile[field].strip():
                        errors.append(f"{resume_path}: public_profile.{field} must be non-empty text.")

    if errors:
        raise ContentValidationError("\n".join(errors))

    return {
        "projects": project_count,
        "services": len(services),
        "testimonials": len(testimonials),
        "pricing": len(pricing),
        "faq": len(faq),
    }
