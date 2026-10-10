"""Repositories that adapt file-backed content into view-ready data."""

from __future__ import annotations

from copy import deepcopy
from .loader import CONTENT_DIR, load_json

class ProjectRepository:
    """Read legacy project records and expose a forward-compatible shape."""

    path = CONTENT_DIR / "projects.json"
    files_path = CONTENT_DIR / "projects"

    def all(self, *, published_only: bool = True) -> list[dict]:
        if self.path.exists():
            projects = deepcopy(load_json(self.path))
        else:
            projects = [
                deepcopy(load_json(path)) for path in sorted(self.files_path.glob("*.json"))
            ]
        normalized = []
        for item in projects:
            project = dict(item)
            project.setdefault("summary", project.get("home_summary") or project.get("tagline"))
            project.setdefault("stack", list(project.get("tech_stack", [])))
            project.setdefault("featured", bool(project.get("featured_on_home", False)))
            if "links" not in project:
                project["links"] = {
                    "live": project.get("live_url"),
                    "github": project.get("github_url"),
                }
            project.setdefault("images", [])
            project.setdefault("publication_state", "published")
            case_study = project.get("case_study")
            if isinstance(case_study, dict):
                case_study = dict(case_study)
                case_study.setdefault("public_links", [])
                case_study.setdefault("images", [])
                project["case_study"] = case_study
            # Unmarked legacy records were already public before content_state existed.
            if not published_only or (
                project.get("content_state", "published") == "published"
                and project.get("publication_state", "published") == "published"
            ):
                normalized.append(project)
        return normalized

    def featured(self) -> list[dict]:
        return [project for project in self.all() if project.get("featured_on_home")]

    def for_work(self) -> list[dict]:
        """Return explicitly published case studies in editorial order."""
        items = [
            project for project in self.all()
            if isinstance(project.get("case_study"), dict)
            and project["case_study"].get("publication_state") == "published"
        ]
        return sorted(items, key=lambda item: item["case_study"].get("priority", 999))

    def get(self, slug: str, *, published_only: bool = True) -> dict | None:
        return next(
            (project for project in self.all(published_only=published_only) if project.get("slug") == slug),
            None,
        )

    def slugs(self) -> set[str]:
        return {project["slug"] for project in self.all()}


class ServiceRepository:
    path = CONTENT_DIR / "services" / "services.json"

    def all(self) -> list[dict]:
        return [
            item for item in deepcopy(load_json(self.path))
            if item.get("content_state") == "published"
        ]

    def homepage(self) -> list[dict]:
        """Return only service cards explicitly approved for the homepage."""
        return [item for item in self.all() if item.get("show_on_home") is True]

    def all_records(self) -> list[dict]:
        """Return every service record for editorial tooling."""
        return deepcopy(load_json(self.path))


class TestimonialRepository:
    path = CONTENT_DIR / "testimonials" / "testimonials.json"

    def all(self, *, approved_only: bool = True) -> list[dict]:
        testimonials = deepcopy(load_json(self.path))
        if approved_only:
            return [
                item for item in testimonials
                if item.get("approved") is True and item.get("content_state") == "published"
            ]
        return testimonials


class SiteRepository:
    path = CONTENT_DIR / "site" / "settings.json"
    pricing_path = CONTENT_DIR / "site" / "pricing.json"
    faq_path = CONTENT_DIR / "site" / "faq.json"

    def settings(self) -> dict:
        return deepcopy(load_json(self.path))

    def process(self) -> list[dict]:
        return [item for item in self.settings().get("process", []) if item.get("content_state") == "published"]

    def audiences(self) -> list[dict]:
        return [item for item in self.settings().get("audiences", []) if item.get("content_state") == "published"]

    def process_journey(self) -> dict:
        return deepcopy(self.settings().get("process_journey", {}))

    def booking_journey(self) -> dict:
        return deepcopy(self.settings().get("booking_journey", {}))

    def page_seo(self, page: str) -> dict:
        return deepcopy(self.settings().get("seo", {}).get(page, {}))

    def pricing(self, *, published_only: bool = True) -> list[dict]:
        records = deepcopy(load_json(self.pricing_path))
        return [item for item in records if item.get("content_state") == "published"] if published_only else records

    def faq(self, *, published_only: bool = True) -> list[dict]:
        records = deepcopy(load_json(self.faq_path))
        return [item for item in records if item.get("content_state") == "published"] if published_only else records

    def currently_building(self) -> dict | None:
        entry = self.settings().get("currently_building")
        return entry if isinstance(entry, dict) and entry.get("content_state") == "published" else None


class ProfileRepository:
    resume_path = CONTENT_DIR / "profile" / "resume.json"

    def resume(self) -> dict:
        return deepcopy(load_json(self.resume_path))

    def about(self) -> dict:
        """Expose concise approved profile copy and a selected view of resume skills."""
        content = self.resume()
        resume = content.get("resume", {})
        skill_groups = {
            item.get("label"): [part.strip() for part in item.get("value", "").split(",")]
            for item in resume.get("skills", [])
        }
        selections = (
            ("Frontend", "Languages", ("JavaScript", "HTML/CSS")),
            ("Frontend", "Frameworks & Libraries", ("React.js",)),
            ("Applications & APIs", "Languages", ("Python",)),
            ("Applications & APIs", "Frameworks & Libraries", ("Node.js", "Express.js", "Django", "Flask")),
            ("Data", "Databases", ("MongoDB", "MySQL")),
        )
        groups: dict[str, list[str]] = {}
        for group, source, chosen in selections:
            available = skill_groups.get(source, [])
            groups.setdefault(group, []).extend(item for item in chosen if item in available)
        return {
            **deepcopy(content.get("public_profile", {})),
            "name": resume.get("name", ""),
            "capability_groups": [
                {"name": name, "items": items} for name, items in groups.items() if items
            ],
        }


projects = ProjectRepository()
services = ServiceRepository()
testimonials = TestimonialRepository()
site = SiteRepository()
profile = ProfileRepository()
