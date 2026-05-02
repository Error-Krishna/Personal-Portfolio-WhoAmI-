import json
from unittest.mock import patch

from django.test import TestCase, override_settings
from django.urls import reverse

from main import views
from main.models import DailyVisitorStat


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

    def test_home_page_tracks_one_unique_visitor_per_session_per_day(self):
        self.client.get(reverse("home"))
        self.client.get(reverse("home"))

        self.assertEqual(DailyVisitorStat.objects.count(), 1)
        self.assertEqual(DailyVisitorStat.objects.first().unique_visitors, 1)

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

    def test_admin_write_blocks_are_applied(self):
        with patch("main.views.write_knowledge_file") as mock_write:
            reply = views._apply_admin_write_actions(
                'Done.\n<krish_write file="public" mode="append">Saved note</krish_write>',
                True,
            )

        mock_write.assert_called_once_with("public", "Saved note", "append")
        self.assertIn("Saved to `public` knowledge using `append` mode.", reply)

    def test_public_mode_cannot_apply_write_blocks(self):
        with patch("main.views.write_knowledge_file") as mock_write:
            reply = views._apply_admin_write_actions(
                '<krish_write file="public" mode="append">Saved note</krish_write>',
                False,
            )

        mock_write.assert_not_called()
        self.assertIn("<krish_write", reply)

    def test_assistant_stats_api_requires_admin(self):
        response = self.client.get(reverse("assistant_stats_api"))
        self.assertEqual(response.status_code, 403)

    def test_assistant_stats_api_returns_unique_users_for_admin(self):
        session = self.client.session
        session["assistant_is_admin"] = True
        session.save()

        self.client.get(reverse("home"))
        response = self.client.get(reverse("assistant_stats_api"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["stats"]["unique_users_today"], 1)


@override_settings(SECURE_SSL_REDIRECT=False)
class ResumeViewTests(TestCase):
    def test_resume_page_loads(self):
        response = self.client.get(reverse("resume"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Download PDF")
        self.assertContains(response, "Krishna Goyal")
        self.assertContains(response, "Hackathons &amp; Competitions")

    def test_resume_file_serves_pdf_inline(self):
        response = self.client.get(reverse("resume_file"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertIn("filename=", response["Content-Disposition"])

    def test_resume_download_serves_attachment(self):
        response = self.client.get(reverse("resume_download"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertIn("attachment;", response["Content-Disposition"])
