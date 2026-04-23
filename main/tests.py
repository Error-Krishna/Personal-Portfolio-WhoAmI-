from django.test import TestCase, override_settings
from django.urls import reverse


@override_settings(SECURE_SSL_REDIRECT=False)
class PortfolioViewsTests(TestCase):
    def test_home_page_loads(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "My Projects")
        self.assertContains(response, "Resume")

    def test_project_detail_page_loads(self):
        response = self.client.get(reverse("project_detail", args=["portfolio-website"]))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "My Portfolio Website")

    def test_missing_project_returns_404(self):
        response = self.client.get(reverse("project_detail", args=["missing-project"]))

        self.assertEqual(response.status_code, 404)
