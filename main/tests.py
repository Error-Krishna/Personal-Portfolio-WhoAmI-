from django.test import TestCase, override_settings
from django.urls import reverse

from .models import Project


@override_settings(SECURE_SSL_REDIRECT=False)
class PortfolioViewsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.project = Project.objects.create(
            title="Portfolio Website",
            slug="portfolio-website",
            tagline="A modern portfolio",
            detailed_description="<p>Test project</p>",
            category="development",
            tech_stack=["Django", "Tailwind CSS"],
            live_url="https://example.com",
            github_url="https://github.com/example/repo",
        )

    def test_home_page_loads(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "My Projects")
        self.assertContains(response, "Resume on Request")

    def test_project_detail_page_loads(self):
        response = self.client.get(reverse("project_detail", args=[self.project.slug]))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.project.title)

    def test_missing_project_returns_404(self):
        response = self.client.get(reverse("project_detail", args=["missing-project"]))

        self.assertEqual(response.status_code, 404)
