"""First-party visitor counters. Failures never block the public site."""

import re

from django.db import DatabaseError, IntegrityError
from django.db.models import F
from django.utils.timezone import localdate

from main.models import DailyVisitorStat

_AUTOMATED_USER_AGENT = re.compile(
    r"bot\b|crawler|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|whatsapp",
    re.IGNORECASE,
)


def track_unique_visit(request) -> None:
    today = localdate()
    today_key = today.isoformat()
    try:
        if _AUTOMATED_USER_AGENT.search(request.META.get("HTTP_USER_AGENT", "")):
            return
        if not request.session.session_key:
            request.session.create()
        if request.session.get("portfolio_unique_visit_date") == today_key:
            return
        stat, _ = DailyVisitorStat.objects.get_or_create(
            date=today, defaults={"unique_visitors": 0}
        )
        DailyVisitorStat.objects.filter(pk=stat.pk).update(
            unique_visitors=F("unique_visitors") + 1
        )
        request.session["portfolio_unique_visit_date"] = today_key
    except (DatabaseError, IntegrityError):
        return


def get_daily_stats() -> dict[str, str | int]:
    today = localdate()
    try:
        stat, _ = DailyVisitorStat.objects.get_or_create(
            date=today, defaults={"unique_visitors": 0}
        )
        unique_visitors = stat.unique_visitors
    except (DatabaseError, IntegrityError):
        unique_visitors = 0
    return {"date": today.isoformat(), "unique_users_today": unique_visitors}
