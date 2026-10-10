from pathlib import Path
import json
import re
import tempfile
import xml.etree.ElementTree as ET
from unittest.mock import patch

from django.conf import settings
from django.test import SimpleTestCase, TestCase, override_settings
from django.urls import reverse

from .content.repositories import ProjectRepository, ServiceRepository, SiteRepository, TestimonialRepository, profile
from .content.validation import ContentValidationError, validate_content

TEST_STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}


class DesignTokenContrastTests(SimpleTestCase):
    @staticmethod
    def contrast_ratio(foreground, background):
        def luminance(color):
            channels = [int(color[index:index + 2], 16) / 255 for index in (1, 3, 5)]
            channels = [value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4 for value in channels]
            return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
        light, dark = sorted((luminance(foreground), luminance(background)), reverse=True)
        return (light + 0.05) / (dark + 0.05)

    def test_muted_status_and_focus_text_tokens_meet_contrast_targets(self):
        tokens = (settings.BASE_DIR / "static/css/tokens.css").read_text()
        values = dict(re.findall(r"--(color-[\w-]+):\s*(#[0-9a-fA-F]{6})", tokens))
        for background in ("color-bg", "color-surface", "color-surface-soft", "color-sage-soft"):
            self.assertGreaterEqual(self.contrast_ratio(values["color-text-muted"], values[background]), 4.5)
        self.assertGreaterEqual(self.contrast_ratio(values["color-success"], values["color-bg"]), 4.5)
        self.assertGreaterEqual(self.contrast_ratio(values["color-danger"], values["color-clay-soft"]), 4.5)


class ContentRepositoryTests(TestCase):
    def test_project_repository_preserves_legacy_content_and_exposes_case_study_aliases(self):
        repository = ProjectRepository()
        all_projects = repository.all()
        project = repository.get("portfolio-website")

        self.assertEqual(len(all_projects), 5)
        self.assertEqual(project["title"], "My Portfolio Website")
        self.assertEqual(project["summary"], project["home_summary"])
        self.assertEqual(project["stack"], project["tech_stack"])
        self.assertTrue(project["featured"])
        self.assertNotIn("outcomes", project)
        self.assertEqual(len(repository.featured()), 5)

    def test_work_repository_filters_publication_state_and_uses_editorial_order(self):
        repository = ProjectRepository()
        work = repository.for_work()
        self.assertEqual([item["slug"] for item in work], [
            "udhyog-saathi-platform", "insightloop-business", "hotreload",
            "personal-finance-tracker", "portfolio-website",
        ])
        self.assertIsNone(repository.get("video-showcase"))
        self.assertIsNotNone(repository.get("video-showcase", published_only=False))

    def test_service_and_site_content_are_available_from_repositories(self):
        self.assertEqual(len(ServiceRepository().all()), 5)
        self.assertEqual(TestimonialRepository().all(), [])
        settings_content = SiteRepository().settings()
        self.assertEqual(settings_content["title"], "Krishna Goyal Portfolio")
        self.assertEqual([item["name"] for item in settings_content["process"]], [
            "Understand", "Plan", "Build", "Launch", "Improve"
        ])
        self.assertEqual([item["name"] for item in settings_content["engagement_models"]], [
            "Launch", "Build", "Scale"
        ])
        self.assertEqual([item["name"] for item in SiteRepository().audiences()], [
            "Founders & startups", "Small businesses", "Agencies & technical partners",
            "Individuals & professionals",
        ])
        self.assertEqual([item["name"] for item in SiteRepository().pricing()], ["Launch", "Build", "Scale"])

    def test_resume_profile_is_loaded_from_content(self):
        self.assertEqual(profile.resume()["resume"]["name"], "Krishna Goyal")

    def test_project_repository_supports_individual_future_project_files(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            projects_dir = root / "projects"
            projects_dir.mkdir()
            (projects_dir / "future-project.json").write_text(
                json.dumps(
                    {"slug": "future-project", "title": "Future", "category": "Web App", "summary": "Known", "stack": []}
                ),
                encoding="utf-8",
            )
            repository = ProjectRepository()
            with patch.object(repository, "path", root / "projects.json"), patch.object(
                repository, "files_path", projects_dir
            ):
                project_list = repository.all()
        self.assertEqual(project_list[0]["summary"], "Known")
        self.assertNotIn("status", project_list[0])

    def test_structured_project_can_omit_unknown_status(self):
        import json
        import tempfile

        with tempfile.TemporaryDirectory() as temp_dir:
            content_dir = Path(temp_dir) / "content"
            (content_dir / "projects").mkdir(parents=True)
            (content_dir / "services").mkdir()
            (content_dir / "testimonials").mkdir()
            (content_dir / "site").mkdir()
            legacy = [{
                "slug": "legacy-project", "title": "Legacy", "tagline": "Existing",
                "category": "development", "tech_stack": [], "detailed_description": "Existing",
            }]
            structured = {
                "slug": "future-project", "title": "Future", "category": "Web App",
                "summary": "Existing summary", "stack": [],
            }
            (content_dir / "projects.json").write_text(json.dumps(legacy), encoding="utf-8")
            (content_dir / "projects" / "future-project.json").write_text(
                json.dumps(structured), encoding="utf-8"
            )
            (content_dir / "services" / "services.json").write_text("[]", encoding="utf-8")
            (content_dir / "testimonials" / "testimonials.json").write_text("[]", encoding="utf-8")
            (content_dir / "site" / "settings.json").write_text("{}", encoding="utf-8")

            counts = validate_content(Path(temp_dir))
            self.assertEqual(counts["projects"], 2)

    def test_malformed_testimonial_is_rejected(self):
        import json
        import tempfile

        with tempfile.TemporaryDirectory() as temp_dir:
            content_dir = Path(temp_dir) / "content"
            (content_dir / "services").mkdir(parents=True)
            (content_dir / "testimonials").mkdir()
            (content_dir / "site").mkdir()
            project = {
                "slug": "legacy-project", "title": "Legacy", "tagline": "Existing",
                "category": "development", "tech_stack": [], "detailed_description": "Existing",
            }
            (content_dir / "projects.json").write_text(json.dumps([project]), encoding="utf-8")
            (content_dir / "services" / "services.json").write_text("[]", encoding="utf-8")
            (content_dir / "testimonials" / "testimonials.json").write_text(
                json.dumps([{"id": "missing-fields"}]), encoding="utf-8"
            )
            (content_dir / "site" / "settings.json").write_text("{}", encoding="utf-8")

            with self.assertRaises(ContentValidationError):
                validate_content(Path(temp_dir))

    def test_content_validation_passes_for_repository(self):
        counts = validate_content(Path(settings.BASE_DIR))
        self.assertEqual(
            counts,
            {"projects": 6, "services": 5, "testimonials": 0, "pricing": 3, "faq": 0},
        )

    def test_project_content_states_hide_drafts_and_tbd_from_public_queries(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            records = [
                {"slug": "public-one", "title": "Public", "content_state": "published"},
                {"slug": "draft-one", "title": "Draft", "content_state": "draft"},
                {"slug": "tbd-one", "title": "TBD", "content_state": "tbd"},
            ]
            projects_path = root / "projects.json"
            projects_path.write_text(json.dumps(records), encoding="utf-8")
            repository = ProjectRepository()
            with patch.object(repository, "path", projects_path):
                self.assertEqual([item["slug"] for item in repository.all()], ["public-one"])
                self.assertIsNone(repository.get("draft-one"))
                self.assertEqual(len(repository.all(published_only=False)), 3)

    def test_services_require_published_content_state(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            services_path = root / "services.json"
            services_path.write_text(json.dumps([
                {"slug": "hidden", "name": "Hidden", "category": "Websites"},
                {"slug": "visible", "name": "Visible", "category": "Websites", "content_state": "published"},
            ]), encoding="utf-8")
            repository = ServiceRepository()
            with patch.object(repository, "path", services_path):
                self.assertEqual([item["slug"] for item in repository.all()], ["visible"])

    def test_service_repository_keeps_optional_fields_optional(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            services_path = Path(temp_dir) / "services.json"
            services_path.write_text(json.dumps([{
                "slug": "websites", "name": "Websites", "category": "Websites",
                "content_state": "published",
            }]), encoding="utf-8")
            repository = ServiceRepository()
            with patch.object(repository, "path", services_path):
                service = repository.all()[0]
                self.assertEqual(repository.homepage(), [])
        self.assertNotIn("starting_price", service)
        self.assertNotIn("deliverables", service)

    def test_malformed_service_record_fails_content_validation(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            content_dir = Path(temp_dir) / "content"
            (content_dir / "services").mkdir(parents=True)
            (content_dir / "testimonials").mkdir()
            (content_dir / "site").mkdir()
            project = {
                "slug": "known-project", "title": "Known", "tagline": "Known",
                "category": "development", "tech_stack": [], "detailed_description": "Known",
            }
            (content_dir / "projects.json").write_text(json.dumps([project]), encoding="utf-8")
            (content_dir / "services" / "services.json").write_text(json.dumps([{
                "slug": "Not Valid", "name": "Broken", "category": "Unknown",
                "related_projects": ["missing-project"],
            }]), encoding="utf-8")
            (content_dir / "testimonials" / "testimonials.json").write_text("[]", encoding="utf-8")
            (content_dir / "site" / "settings.json").write_text("{}", encoding="utf-8")
            with self.assertRaises(ContentValidationError):
                validate_content(Path(temp_dir))

    def test_empty_pricing_and_services_with_optional_fields_validate(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            content_dir = Path(temp_dir) / "content"
            (content_dir / "services").mkdir(parents=True)
            (content_dir / "testimonials").mkdir()
            (content_dir / "site").mkdir()
            project = {
                "slug": "known-project", "title": "Known", "tagline": "Known",
                "category": "development", "tech_stack": [], "detailed_description": "Known",
            }
            (content_dir / "projects.json").write_text(json.dumps([project]), encoding="utf-8")
            (content_dir / "services" / "services.json").write_text(json.dumps([{
                "slug": "websites", "name": "Websites", "category": "Websites",
            }]), encoding="utf-8")
            (content_dir / "testimonials" / "testimonials.json").write_text("[]", encoding="utf-8")
            (content_dir / "site" / "settings.json").write_text("{}", encoding="utf-8")
            (content_dir / "site" / "pricing.json").write_text("[]", encoding="utf-8")
            counts = validate_content(Path(temp_dir))
        self.assertEqual(counts["services"], 1)
        self.assertEqual(counts["pricing"], 0)

    def test_malformed_pricing_record_fails_validation(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            content_dir = Path(temp_dir) / "content"
            (content_dir / "services").mkdir(parents=True)
            (content_dir / "testimonials").mkdir()
            (content_dir / "site").mkdir()
            project = {
                "slug": "known-project", "title": "Known", "tagline": "Known",
                "category": "development", "tech_stack": [], "detailed_description": "Known",
            }
            (content_dir / "projects.json").write_text(json.dumps([project]), encoding="utf-8")
            (content_dir / "services" / "services.json").write_text("[]", encoding="utf-8")
            (content_dir / "testimonials" / "testimonials.json").write_text("[]", encoding="utf-8")
            (content_dir / "site" / "settings.json").write_text("{}", encoding="utf-8")
            (content_dir / "site" / "pricing.json").write_text(json.dumps([{
                "slug": "launch", "name": "Launch", "description": "A focused scope.",
                "starting_price": "TBD",
            }]), encoding="utf-8")
            with self.assertRaises(ContentValidationError):
                validate_content(Path(temp_dir))

    def test_testimonials_require_approval_and_published_content_state(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "testimonials.json"
            path.write_text(json.dumps([
                {"id": "draft", "approved": True, "content_state": "draft"},
                {"id": "published", "approved": True, "content_state": "published"},
                {"id": "unapproved", "approved": False, "content_state": "published"},
            ]), encoding="utf-8")
            repository = TestimonialRepository()
            with patch.object(repository, "path", path):
                self.assertEqual([item["id"] for item in repository.all()], ["published"])

    def test_pricing_and_faq_repositories_hide_nonpublished_content(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            pricing_path, faq_path = root / "pricing.json", root / "faq.json"
            pricing_path.write_text(json.dumps([
                {"slug": "launch", "name": "Launch", "content_state": "tbd"},
                {"slug": "build", "name": "Build", "content_state": "published"},
            ]), encoding="utf-8")
            faq_path.write_text(json.dumps([
                {"id": "draft", "content_state": "draft"},
                {"id": "published", "content_state": "published"},
            ]), encoding="utf-8")
            repository = SiteRepository()
            with patch.object(repository, "pricing_path", pricing_path), patch.object(repository, "faq_path", faq_path):
                self.assertEqual([item["slug"] for item in repository.pricing()], ["build"])
                self.assertEqual([item["id"] for item in repository.faq()], ["published"])


@override_settings(SECURE_SSL_REDIRECT=False, STORAGES=TEST_STORAGES)
class PortfolioArchitectureRouteTests(TestCase):
    def test_site_settings_are_available_as_shared_template_context(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.context["site_settings"]["title"], "Krishna Goyal Portfolio")

    def test_new_project_route_and_legacy_redirect(self):
        new_response = self.client.get(reverse("work_project_detail", args=["portfolio-website"]))
        old_response = self.client.get(reverse("project_detail", args=["portfolio-website"]))

        self.assertEqual(new_response.status_code, 200)
        self.assertEqual(old_response.status_code, 301)
        self.assertEqual(old_response["Location"], reverse("work_project_detail", args=["portfolio-website"]))

    def test_work_route_uses_project_repository(self):
        response = self.client.get(reverse("work_index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Udhyog Saathi")
        self.assertContains(response, "InsightLoop")
        self.assertContains(response, "Personal Finance Tracker")
        self.assertNotContains(response, "Video Editing Showcase")

    def test_homepage_prioritizes_approved_work_and_hides_unpublished_sections(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["lead_project"]["slug"], "udhyog-saathi-platform")
        self.assertEqual(response.context["secondary_project"]["slug"], "insightloop-business")
        self.assertEqual(
            [project["slug"] for project in response.context["supporting_projects"]],
            ["personal-finance-tracker", "portfolio-website"],
        )
        self.assertContains(response, "I build digital products that move ideas forward.")
        self.assertContains(response, 'rel="canonical"')
        self.assertContains(response, 'type="application/ld+json"')
        self.assertNotContains(response, "HotReload")
        self.assertNotContains(response, "Video Editing Showcase")
        self.assertNotContains(response, "What people say")
        self.assertNotContains(response, "A few useful details")
        self.assertNotContains(response, "Starting at TBD")

    def test_unpublished_video_showcase_is_hidden(self):
        response = self.client.get(reverse("work_project_detail", args=["video-showcase"]))
        self.assertEqual(response.status_code, 404)

    def test_services_page_renders_content_links_engagements_seo_and_booking(self):
        response = self.client.get(reverse("services"))
        self.assertEqual(response.status_code, 200)
        for category in ("Websites", "Web Applications", "Product Development", "Automation", "Data &amp; Analytics"):
            self.assertContains(response, category)
        for engagement in ("Launch", "Build", "Scale"):
            self.assertContains(response, engagement)
        self.assertContains(response, 'href="/work/portfolio-website/"')
        self.assertContains(response, 'href="/work/insightloop-business/"')
        self.assertContains(response, 'href="/work/udhyog-saathi-platform/"')
        self.assertContains(response, 'href="/book/"')
        self.assertContains(response, 'rel="canonical"')
        self.assertContains(response, 'property="og:title"')
        self.assertContains(response, 'name="twitter:card"')
        self.assertContains(response, "Scope and pricing are discussed after discovery.")
        self.assertNotContains(response, "pricing-card__price")
        self.assertNotContains(response, "₹")
        self.assertContains(response, "Founders &amp; startups")
        self.assertContains(response, "From first conversation to delivery")

    def test_services_page_hides_optional_sections_when_content_is_empty(self):
        with patch("apps.portfolio.views.services.all", return_value=[]), \
             patch("apps.portfolio.views.site.pricing", return_value=[]), \
             patch("apps.portfolio.views.site.process", return_value=[]), \
             patch("apps.portfolio.views.site.audiences", return_value=[]):
            response = self.client.get(reverse("services"))
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, "What I can help you build")
        self.assertNotContains(response, "Choose a starting shape")
        self.assertNotContains(response, "From first conversation to delivery")

    def test_services_content_does_not_replace_homepage_capability_cards(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["published_services"], [])
        self.assertEqual(len(response.context["capabilities"]), 5)
        self.assertContains(response, "What I do")

    def test_case_study_only_renders_supported_sections_and_has_project_metadata(self):
        response = self.client.get(reverse("work_project_detail", args=["udhyog-saathi-platform"]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Co-founder; frontend and product-focused developer")
        self.assertContains(response, 'rel="canonical"')
        self.assertContains(response, 'property="og:title"')
        self.assertContains(response, 'name="twitter:card"')
        self.assertContains(response, 'type="application/ld+json"')
        self.assertContains(response, "Next project")
        self.assertNotContains(response, "Measured results")

    def test_legacy_route_redirects_unpublished_work_to_work_index(self):
        response = self.client.get(reverse("project_detail", args=["video-showcase"]))
        self.assertEqual(response.status_code, 301)
        self.assertEqual(response["Location"], reverse("work_index"))

    def test_about_page_uses_approved_profile_resume_and_canonical_work_routes(self):
        response = self.client.get(reverse("about"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "I’m Krishna Goyal, a product-minded frontend and full-stack engineer")
        self.assertContains(response, "real-world problems into practical software")
        self.assertContains(response, "React.js")
        self.assertContains(response, 'href="/resume/"')
        self.assertContains(response, 'href="/resume/download/"')
        self.assertEqual(self.client.get(reverse("resume")).status_code, 200)
        download = self.client.get(reverse("resume_download"))
        self.assertEqual(download.status_code, 200)
        self.assertEqual(download["Content-Type"], "application/pdf")
        self.assertContains(response, 'href="/work/udhyog-saathi-platform/"')
        self.assertContains(response, 'href="/work/insightloop-business/"')
        self.assertContains(response, 'href="/book/"')
        self.assertContains(response, 'rel="canonical"')
        self.assertContains(response, 'property="og:title"')
        self.assertContains(response, 'name="twitter:card"')
        for disputed in ("CGPA", "Graduating in 2027", "Vellore Institute of Technology", "student"):
            self.assertNotContains(response, disputed)

    def test_process_page_expands_the_approved_five_stages_from_content(self):
        response = self.client.get(reverse("process"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual([step["name"] for step in response.context["process_steps"]], [
            "Understand", "Plan", "Build", "Launch", "Improve",
        ])
        for stage in ("Understand", "Plan", "Build", "Launch", "Improve"):
            self.assertContains(response, stage)
        for detail in ("What happens", "What you can expect", "Purpose"):
            self.assertContains(response, detail)
        self.assertContains(response, "Inquiry")
        self.assertContains(response, "Scope")
        self.assertContains(response, 'href="/book/"')
        self.assertContains(response, 'rel="canonical"')
        self.assertContains(response, 'property="og:title"')
        self.assertContains(response, 'name="twitter:card"')

    def test_services_remains_available_after_about_and_process_completion(self):
        self.assertContains(self.client.get(reverse("services")), "What I can help you build")

    def test_sitemap_contains_canonical_pages_and_published_projects_only(self):
        response = self.client.get(reverse("sitemap"))
        self.assertEqual(response.status_code, 200)
        root = ET.fromstring(response.content)
        locations = [node.text for node in root.findall(".//{*}loc")]
        for path in ("/", "/work/", "/services/", "/about/", "/process/", "/book/", "/assistant/", "/resume/"):
            self.assertIn(f"http://testserver{path}", locations)
        for slug in ("udhyog-saathi-platform", "insightloop-business", "hotreload", "personal-finance-tracker", "portfolio-website"):
            self.assertIn(f"http://testserver/work/{slug}/", locations)
        for excluded in ("video-showcase", "/project/", "/api/", "/admin/", "/health/", "/resume/download/"):
            self.assertFalse(any(excluded in location for location in locations), excluded)

    @override_settings(ALLOWED_HOSTS=["portfolio.example.test"], SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https"))
    def test_robots_txt_points_to_request_host_and_keeps_public_pages_allowed(self):
        response = self.client.get(reverse("robots_txt"), HTTP_HOST="portfolio.example.test", HTTP_X_FORWARDED_PROTO="https")
        self.assertEqual(response.status_code, 200)
        text = response.content.decode()
        self.assertIn("Disallow: /admin/", text)
        self.assertIn("Disallow: /api/", text)
        self.assertNotIn("Disallow: /project/", text)
        self.assertIn("Sitemap: https://portfolio.example.test/sitemap.xml", text)
        directives = text.splitlines()
        for allowed in ("/work/", "/services/", "/about/", "/process/", "/resume/"):
            self.assertNotIn(f"Disallow: {allowed}", directives)

    @override_settings(ALLOWED_HOSTS=["portfolio.example.test"], SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https"))
    def test_public_page_canonicals_metadata_and_share_image_are_request_derived(self):
        required_meta = (
            'name="description"', 'property="og:title"', 'property="og:description"',
            'property="og:url"', 'name="twitter:title"', 'name="twitter:description"',
            'property="og:image"', 'name="twitter:image"',
        )
        for name in ("home", "work_index", "services", "about", "process", "book", "assistant", "resume"):
            response = self.client.get(
                reverse(name) + "?utm_source=campaign",
                HTTP_HOST="portfolio.example.test",
                HTTP_X_FORWARDED_PROTO="https",
            )
            self.assertEqual(response.status_code, 200, name)
            html = response.content.decode()
            canonical = re.search(r'<link rel="canonical" href="([^"]+)"', html)
            self.assertIsNotNone(canonical, name)
            self.assertEqual(canonical.group(1), f"https://portfolio.example.test{reverse(name)}", name)
            for marker in required_meta:
                self.assertIn(marker, html, (name, marker))
            self.assertIn('<html lang="en">', html)
            self.assertEqual(html.count('property="og:image"'), 1, name)
        image = self.client.get("/static/images/image-removebg-preview.png")
        self.assertEqual(image.status_code, 200)

    @override_settings(ALLOWED_HOSTS=["portfolio.example.test"], SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO", "https"))
    def test_json_ld_is_valid_and_contains_only_supported_canonical_entities(self):
        for path, expected_types, canonical in (
            (reverse("home"), {"Person", "WebSite"}, "https://portfolio.example.test/"),
            (reverse("work_project_detail", args=["portfolio-website"]), {"CreativeWork"}, "https://portfolio.example.test/work/portfolio-website/"),
        ):
            response = self.client.get(path, HTTP_HOST="portfolio.example.test", HTTP_X_FORWARDED_PROTO="https")
            html = response.content.decode()
            payloads = re.findall(r'<script id="[^"]+" type="application/ld\+json">(.*?)</script>', html)
            objects = [json.loads(payload) for payload in payloads]
            self.assertEqual({obj["@type"] for obj in objects}, expected_types)
            self.assertTrue(all(obj["url"] == canonical for obj in objects))
            self.assertNotIn("Education", html)
            self.assertFalse(any(obj["@type"] in {"Organization", "Review", "AggregateRating"} for obj in objects))

        sitemap = self.client.get(reverse("sitemap"), HTTP_HOST="portfolio.example.test", HTTP_X_FORWARDED_PROTO="https")
        self.assertIn(b"https://portfolio.example.test/work/portfolio-website/", sitemap.content)
