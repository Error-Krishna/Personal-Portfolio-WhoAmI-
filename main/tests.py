import json
from unittest.mock import patch

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

    def test_health_check_returns_ok(self):
        response = self.client.get(reverse("health_check"))

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"status": "ok"})


@override_settings(SECURE_SSL_REDIRECT=False)
class AssistantViewTests(TestCase):
    def test_assistant_page_loads(self):
        response = self.client.get(reverse("assistant"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Krish")
        self.assertIn("csrftoken", response.cookies)
        self.assertNotContains(response, "krish-admin-2026")

    def test_home_page_sets_csrf_cookie_for_widget_chat(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertIn("csrftoken", response.cookies)
        self.assertNotContains(response, "krish-admin-2026")

    def test_chat_api_rejects_get(self):
        response = self.client.get(reverse("chat_api"))
        self.assertEqual(response.status_code, 405)

    def test_chat_api_rejects_empty_messages(self):
        response = self.client.post(
            reverse("chat_api"),
            data=json.dumps({"messages": [], "is_admin": False}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

    def test_chat_api_unlocks_admin_mode_in_session(self):
        with patch("main.views.ADMIN_PASSPHRASE", "secret-passphrase"):
            response = self.client.post(
                reverse("chat_api"),
                data=json.dumps({"messages": [{"role": "user", "content": "secret-passphrase"}]}),
                content_type="application/json",
            )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {
                "reply": "Admin mode unlocked. Ask me anything when you're ready.",
                "is_admin": True,
            },
        )
        self.assertTrue(self.client.session["assistant_is_admin"])
