from datetime import date
from unittest.mock import patch

from django.db import DatabaseError
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils.timezone import localdate

from main.models import DailyVisitorStat


@override_settings(
    SECURE_SSL_REDIRECT=False,
    STORAGES={
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    },
)
class VisitorAnalyticsTests(TestCase):
    def test_repeat_page_views_count_one_session_per_local_date(self):
        self.client.get(reverse("home"))
        self.client.get(reverse("services"))
        stat = DailyVisitorStat.objects.get(date=localdate())
        self.assertEqual(stat.unique_visitors, 1)

    def test_new_local_date_counts_the_session_again(self):
        with patch("apps.analytics.services.localdate", side_effect=[date(2026, 10, 8), date(2026, 10, 9)]):
            self.client.get(reverse("home"))
            self.client.get(reverse("home"))
        self.assertEqual(DailyVisitorStat.objects.get(date=date(2026, 10, 8)).unique_visitors, 1)
        self.assertEqual(DailyVisitorStat.objects.get(date=date(2026, 10, 9)).unique_visitors, 1)

    def test_obvious_crawler_user_agents_are_not_counted(self):
        response = self.client.get(reverse("home"), HTTP_USER_AGENT="Googlebot/2.1")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(DailyVisitorStat.objects.exists())

    def test_database_failure_does_not_block_a_public_page(self):
        with patch("apps.analytics.services.DailyVisitorStat.objects.get_or_create", side_effect=DatabaseError):
            response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)

    def test_stats_api_is_staff_only_get_only_and_aggregate_only(self):
        denied = self.client.get(reverse("assistant_stats_api"))
        self.assertEqual(denied.status_code, 403)
        self.assertEqual(set(denied.json()), {"error"})
        self.assertEqual(self.client.post(reverse("assistant_stats_api")).status_code, 405)
