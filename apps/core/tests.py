"""Regression tests for shared front-end infrastructure and navigation."""

import re

from django.conf import settings
from django.test import SimpleTestCase, TestCase, override_settings
from django.urls import reverse

from apps.portfolio.content.repositories import projects

# var(--name) with no fallback value; var(--name, fallback) is intentionally skipped.
VAR_WITHOUT_FALLBACK = re.compile(r"var\(\s*(--[\w-]+)\s*\)")
TOKEN_DEFINITION = re.compile(r"(--[\w-]+)\s*:")

TEST_STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}


class DesignTokenReferenceTests(SimpleTestCase):
    def test_every_css_variable_reference_is_defined(self):
        """An undefined custom property silently invalidates its whole declaration.

        For example an undefined spacing token inside ``gap`` or ``margin`` makes
        the browser fall back to ``0``, which collapses the intended layout.
        """
        css_dir = settings.BASE_DIR / "static" / "css"
        defined: set[str] = set()
        referenced: dict[str, set[str]] = {}
        for path in sorted(css_dir.glob("*.css")):
            text = path.read_text(encoding="utf-8")
            defined.update(TOKEN_DEFINITION.findall(text))
            for name in VAR_WITHOUT_FALLBACK.findall(text):
                referenced.setdefault(name, set()).add(path.name)
        undefined = {
            name: sorted(files)
            for name, files in referenced.items()
            if name not in defined
        }
        self.assertEqual(undefined, {}, f"CSS references undefined custom properties: {undefined}")


@override_settings(SECURE_SSL_REDIRECT=False, STORAGES=TEST_STORAGES)
class NavigationTests(TestCase):
    """Primary navigation: identical, section-based destinations on every page."""

    LINK = re.compile(r"<a\s([^>]*)>\s*([^<]*?)\s*</a>", re.S)
    SECTION_IDS = {"Work": "selected-work", "Services": "services", "Process": "process", "About": "about"}

    @property
    def expected_destinations(self):
        home = reverse("home")
        return {
            "Work": f"{home}#selected-work",
            "Services": f"{home}#services",
            "Process": f"{home}#process",
            "About": f"{home}#about",
            "Ask Krish": reverse("assistant"),
            "Book a Session": reverse("book"),
        }

    def nav_sections(self, response):
        html = response.content.decode()
        header = re.search(r'<header class="site-header">.*?</header>', html, re.S)
        self.assertIsNotNone(header, "site header is missing")
        header = header.group(0)
        desktop = re.search(r'<ul class="site-nav__links site-nav__links--desktop">.*?</ul>', header, re.S)
        mobile = re.search(r'<div class="site-nav__mobile-menu">.*?</div>', header, re.S)
        self.assertIsNotNone(desktop, "desktop navigation is missing")
        self.assertIsNotNone(mobile, "mobile navigation is missing")
        return desktop.group(0), mobile.group(0)

    def links(self, fragment):
        found = []
        for attrs, label in self.LINK.findall(fragment):
            href = re.search(r'href="([^"]*)"', attrs)
            found.append({
                "label": label,
                "href": href.group(1) if href else None,
                "current": 'aria-current="page"' in attrs,
            })
        return found

    def all_pages(self):
        pages = [(name, reverse(name)) for name in (
            "home", "work_index", "services", "about", "process", "book", "assistant", "resume",
        )]
        published = projects.for_work()
        self.assertTrue(published, "expected at least one published project")
        pages += [(f"work/{p['slug']}", reverse("work_project_detail", args=[p["slug"]])) for p in published]
        return pages

    def test_desktop_and_mobile_links_share_the_intended_destinations_on_every_page(self):
        for name, url in self.all_pages():
            with self.subTest(page=name):
                response = self.client.get(url)
                self.assertEqual(response.status_code, 200)
                desktop, mobile = self.nav_sections(response)
                for menu, fragment in (("desktop", desktop), ("mobile", mobile)):
                    self.assertEqual(
                        {link["label"]: link["href"] for link in self.links(fragment)},
                        self.expected_destinations,
                        f"{name}: {menu} navigation destinations differ",
                    )
                    self.assertEqual(
                        [link["label"] for link in self.links(fragment)],
                        list(self.expected_destinations),
                        f"{name}: {menu} navigation order differs",
                    )

    def test_error_page_uses_the_same_navigation(self):
        response = self.client.get("/missing-page/")
        self.assertEqual(response.status_code, 404)
        desktop, mobile = self.nav_sections(response)
        for fragment in (desktop, mobile):
            self.assertEqual({l["label"]: l["href"] for l in self.links(fragment)}, self.expected_destinations)

    def test_section_links_never_target_standalone_pages(self):
        standalone = {reverse("services"), reverse("about"), reverse("process"), reverse("work_index")}
        for name, url in self.all_pages():
            with self.subTest(page=name):
                desktop, mobile = self.nav_sections(self.client.get(url))
                for fragment in (desktop, mobile):
                    for link in self.links(fragment):
                        self.assertNotIn(link["href"], standalone, f"{link['label']} targets a standalone page")

    def test_only_dedicated_pages_are_marked_current(self):
        for name, url in self.all_pages():
            expected = {"assistant": "Ask Krish", "book": "Book a Session"}.get(name)
            with self.subTest(page=name):
                desktop, mobile = self.nav_sections(self.client.get(url))
                for menu, fragment in (("desktop", desktop), ("mobile", mobile)):
                    current = [link["label"] for link in self.links(fragment) if link["current"]]
                    self.assertEqual(current, [expected] if expected else [], f"{name}: {menu} current state")

    def test_every_section_anchor_exists_in_the_homepage_markup(self):
        html = self.client.get(reverse("home")).content.decode()
        for label, anchor in self.SECTION_IDS.items():
            with self.subTest(section=label):
                self.assertEqual(html.count(f'id="{anchor}"'), 1, f"#{anchor} must exist exactly once")

    def test_brand_link_goes_home(self):
        response = self.client.get(reverse("assistant"))
        self.assertContains(response, f'<a class="site-brand" href="{reverse("home")}"')

    def test_mobile_menu_summary_has_an_initial_accessible_name(self):
        response = self.client.get(reverse("work_index"))
        self.assertContains(response, '<summary aria-label="Open navigation menu">Menu</summary>', html=False)

    def test_resume_and_project_links_are_unchanged(self):
        self.assertContains(self.client.get(reverse("home")), f'href="{reverse("resume")}"')
        self.assertContains(self.client.get(reverse("about")), f'href="{reverse("resume")}"')
        work = self.client.get(reverse("work_index"))
        for project in projects.for_work():
            self.assertContains(work, f'href="{reverse("work_project_detail", args=[project["slug"]])}"')

    def test_canonical_and_legacy_project_routes_still_work(self):
        for project in projects.for_work():
            slug = project["slug"]
            canonical = reverse("work_project_detail", args=[slug])
            with self.subTest(slug=slug):
                self.assertEqual(self.client.get(canonical).status_code, 200)
                legacy = self.client.get(reverse("project_detail", args=[slug]))
                self.assertEqual(legacy.status_code, 301)
                self.assertEqual(legacy["Location"], canonical)
        self.assertEqual(self.client.get("/work/not-a-project/").status_code, 404)
        self.assertEqual(self.client.get(reverse("services")).status_code, 200)
        self.assertEqual(self.client.get(reverse("about")).status_code, 200)
        self.assertEqual(self.client.get(reverse("process")).status_code, 200)
