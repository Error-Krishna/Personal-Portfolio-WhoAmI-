import json
from unittest.mock import patch

from django.core import mail
from django.test import Client, TestCase, override_settings
from django.urls import reverse

from .services import InquiryNotConfigured

TEST_STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}


@override_settings(
    SECURE_SSL_REDIRECT=False,
    STORAGES=TEST_STORAGES,
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="no-reply@example.test",
    CONTACT_RECEIVER_EMAIL="owner@example.test",
)
class BookingBoundaryTests(TestCase):
    def test_book_page_renders_inquiry_form(self):
        response = self.client.get(reverse("book"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Let’s talk about what you’re building.")
        self.assertContains(response, "Project details")
        self.assertContains(response, "What happens next")
        self.assertContains(response, 'name="company"')
        self.assertContains(response, 'name="project_type"')
        self.assertContains(response, 'name="budget"')
        self.assertContains(response, 'name="timeline"')
        self.assertContains(response, 'rel="canonical"')
        self.assertContains(response, 'property="og:title"')
        self.assertContains(response, 'name="twitter:card"')
        self.assertContains(response, 'href="/work/"')
        self.assertContains(response, 'href="/"')
        self.assertNotContains(response, "Choose a session time")
        for service in response.context["services"]:
            self.assertContains(response, service["name"].replace("&", "&amp;"))

    def test_valid_browser_inquiry_redirects_to_non_sensitive_success_state(self):
        submitted = {
            "name": "Visitor Name",
            "email": "visitor@example.test",
            "company": "Example Studio",
            "project_type": "Web Applications",
            "budget": "Not sure yet",
            "timeline": "Discuss after scope",
            "message": "I would like to discuss a dashboard for my team.",
        }
        with patch("apps.booking.views.send_inquiry") as send_inquiry:
            response = self.client.post(reverse("book"), submitted, follow=True)

        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, f"{reverse('book')}?submitted=1")
        self.assertContains(response, "Your inquiry has been received.")
        self.assertContains(response, 'href="/work/"')
        self.assertContains(response, 'href="/"')
        self.assertNotContains(response, "visitor@example.test")
        self.assertNotContains(response, "dashboard for my team")
        send_inquiry.assert_called_once()
        self.assertEqual(send_inquiry.call_args.args[0]["project_type"], "Web Applications")
        self.assertEqual(send_inquiry.call_args.args[0]["budget"], "Not sure yet")

    def test_booking_form_validation_rejects_missing_invalid_and_oversized_fields(self):
        base = {"name": "Visitor", "email": "visitor@example.test", "message": "A meaningful project description."}
        cases = [
            ({**base, "name": ""}, "Please enter your name."),
            ({**base, "email": "not-an-email"}, "Enter a valid email address."),
            ({**base, "message": ""}, "Please share a few details about your project."),
            ({**base, "message": "Too short"}, "at least 20 characters"),
            ({**base, "company": "x" * 121}, "Ensure this value has at most 120 characters"),
            ({**base, "budget": "x" * 161}, "Ensure this value has at most 160 characters"),
            ({**base, "timeline": "x" * 201}, "Ensure this value has at most 200 characters"),
            ({**base, "message": "x" * 5001}, "Ensure this value has at most 5000 characters"),
        ]
        for data, error in cases:
            with self.subTest(field=error):
                response = self.client.post(reverse("book"), data)
                self.assertEqual(response.status_code, 400)
                self.assertContains(response, error, status_code=400)

    def test_optional_fields_can_be_omitted(self):
        with patch("apps.booking.views.send_inquiry") as send_inquiry:
            response = self.client.post(reverse("book"), {
                "name": "Visitor",
                "email": "visitor@example.test",
                "message": "I would like to discuss a small website project.",
            }, follow=True)
        self.assertEqual(response.status_code, 200)
        send_inquiry.assert_called_once()
        sent_data = send_inquiry.call_args.args[0]
        self.assertEqual(sent_data["company"], "")
        self.assertEqual(sent_data["project_type"], "")
        self.assertEqual(sent_data["budget"], "")
        self.assertEqual(sent_data["timeline"], "")

    def test_inquiry_email_includes_optional_context_without_untrusted_subject(self):
        response = self.client.post(
            reverse("inquiry_api"),
            data=json.dumps({
                "name": "Visitor",
                "email": "visitor@example.test",
                "company": "Example Studio",
                "project_type": "Web Applications",
                "budget": "Not sure yet",
                "timeline": "Discuss after scope",
                "message": "Project details with enough context for the inquiry.",
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "New portfolio project inquiry")
        for detail in ("Example Studio", "Web Applications", "Not sure yet", "Discuss after scope"):
            self.assertIn(detail, mail.outbox[0].body)

    def test_unsafe_html_is_escaped_when_invalid_submission_is_rerendered(self):
        response = self.client.post(reverse("book"), {
            "name": "",
            "email": "visitor@example.test",
            "message": "<script>alert('x')</script>",
        })
        self.assertEqual(response.status_code, 400)
        self.assertContains(response, "&lt;script&gt;", status_code=400)
        self.assertNotContains(response, "<script>alert('x')</script>", status_code=400)

    def test_form_submission_failure_is_generic_and_preserves_details(self):
        with patch("apps.booking.views.send_inquiry", side_effect=RuntimeError("private backend failure")):
            response = self.client.post(reverse("book"), {
                "name": "Visitor",
                "email": "visitor@example.test",
                "message": "I would like to discuss a useful web application.",
            })
        self.assertEqual(response.status_code, 500)
        self.assertContains(response, "We could not process your inquiry right now", status_code=500)
        self.assertContains(response, "useful web application", status_code=500)
        self.assertNotContains(response, "private backend failure", status_code=500)
        self.assertNotContains(response, ".env", status_code=500)

    def test_missing_email_configuration_does_not_show_a_false_success(self):
        with patch("apps.booking.views.send_inquiry", side_effect=InquiryNotConfigured):
            response = self.client.post(reverse("book"), {
                "name": "Visitor",
                "email": "visitor@example.test",
                "message": "I would like to discuss a useful web application.",
            })
        self.assertEqual(response.status_code, 503)
        self.assertContains(response, "The inquiry form is not available right now", status_code=503)
        self.assertNotContains(response, "Your inquiry has been received", status_code=503)

    def test_inquiry_api_sends_existing_contact_email(self):
        response = self.client.post(
            reverse("inquiry_api"),
            data=json.dumps({"name": "Visitor", "email": "visitor@example.test", "message": "Project details with enough context."}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"ok": True})
        self.assertEqual(len(mail.outbox), 1)

    def test_inquiry_api_validates_server_side(self):
        response = self.client.post(
            reverse("inquiry_api"),
            data=json.dumps({"name": "Visitor", "email": "bad-address", "message": "x"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

    def test_inquiry_api_requires_csrf(self):
        client = Client(enforce_csrf_checks=True)
        response = client.post(
            reverse("inquiry_api"),
            data=json.dumps({"name": "Visitor", "email": "visitor@example.test", "message": "Project details with enough context."}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)

    def test_browser_inquiry_form_requires_csrf(self):
        client = Client(enforce_csrf_checks=True)
        client.get(reverse("book"))
        response = client.post(reverse("book"), {
            "name": "Visitor",
            "email": "visitor@example.test",
            "message": "I would like to discuss a useful web application.",
        })
        self.assertEqual(response.status_code, 403)

    def test_browser_inquiry_form_accepts_csrf_token(self):
        client = Client(enforce_csrf_checks=True)
        client.get(reverse("book"))
        token = client.cookies["csrftoken"].value
        with patch("apps.booking.views.send_inquiry") as send_inquiry:
            response = client.post(
                reverse("book"),
                {
                    "name": "Visitor",
                    "email": "visitor@example.test",
                    "message": "I would like to discuss a useful web application.",
                    "csrfmiddlewaretoken": token,
                },
            )
        self.assertEqual(response.status_code, 302)
        send_inquiry.assert_called_once()

    def test_honeypot_submission_is_accepted_without_sending_email(self):
        with patch("apps.booking.views.send_inquiry") as send_inquiry:
            response = self.client.post(
                reverse("inquiry_api"),
                data=json.dumps({"name": "Bot", "email": "bot@example.test", "message": "This is an automated project submission.", "website": "filled"}),
                content_type="application/json",
            )
        self.assertEqual(response.status_code, 200)
        send_inquiry.assert_not_called()

    def test_api_rejects_oversized_json_body_without_exposing_internals(self):
        response = self.client.post(
            reverse("inquiry_api"),
            data=b"{" + b" " * 16_000 + b"}",
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 413)
        self.assertJSONEqual(response.content, {"error": "Request body is too large."})

    def test_duplicate_browser_submission_is_rate_limited(self):
        data = {
            "name": "Visitor",
            "email": "visitor@example.test",
            "message": "I would like to discuss a useful web application.",
        }
        with patch("apps.booking.views.send_inquiry") as send_inquiry:
            first = self.client.post(reverse("book"), data)
            second = self.client.post(reverse("book"), data)
        self.assertEqual(first.status_code, 302)
        self.assertEqual(second.status_code, 429)
        send_inquiry.assert_called_once()
