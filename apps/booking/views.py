import json
import time

from django.core.exceptions import RequestDataTooBig
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.utils.timezone import localdate
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from apps.analytics.services import track_unique_visit
from apps.portfolio.content.repositories import services, site
from .forms import ProjectInquiryForm
from .services import InquiryNotConfigured, send_inquiry

RATE_LIMIT_SECONDS = 45
MAX_INQUIRY_BODY_BYTES = 16_000


def _rate_limited(request) -> bool:
    previous = request.session.get("last_contact_submit_ts")
    return bool(previous and time.time() - previous < RATE_LIMIT_SECONDS)


def _mark_submitted(request) -> None:
    request.session["last_contact_submit_ts"] = time.time()


@ensure_csrf_cookie
def book_page(request):
    track_unique_visit(request)
    service_types = services.all()
    try:
        form = ProjectInquiryForm(
            request.POST if request.method == "POST" else None,
            service_types=service_types,
        )
    except RequestDataTooBig:
        form = ProjectInquiryForm(service_types=service_types)
        error = "Your submission was too large. Please shorten the details and try again."
        return _render_book(request, form, service_types, error=error, status=413)

    error = ""
    status = 200
    if request.method == "POST":
        if form.is_valid():
            if form.cleaned_data.get("website"):
                return _render_book(request, form, service_types, sent=True)
            elif _rate_limited(request):
                error = "Please wait before sending another inquiry."
                status = 429
            else:
                try:
                    send_inquiry(form.cleaned_data)
                    _mark_submitted(request)
                    request.session["inquiry_received"] = True
                    return redirect(f"{reverse('book')}?submitted=1")
                except InquiryNotConfigured:
                    error = "The inquiry form is not available right now. Please try again later."
                    status = 503
                except Exception:
                    error = "We could not process your inquiry right now. Your details are still here so you can try again."
                    status = 500
        else:
            status = 400
    sent = (
        request.GET.get("submitted") == "1"
        and request.session.pop("inquiry_received", False)
    )
    return _render_book(request, form, service_types, error=error, sent=sent, status=status)


def _render_book(request, form, service_types, *, error="", sent=False, status=200):
    page_seo = site.page_seo("booking")
    canonical = request.build_absolute_uri(reverse("book"))
    return render(request, "pages/book.html", {
        "form": form,
        "error": error,
        "sent": sent,
        "booking_journey": site.booking_journey(),
        "services": service_types,
        "book_seo": page_seo,
        "book_canonical": canonical,
        "site_positioning": site.settings().get("seo", {}).get("description", ""),
    }, status=status)


@require_POST
def inquiry_api(request):
    try:
        if len(request.body) > MAX_INQUIRY_BODY_BYTES:
            return JsonResponse({"error": "Request body is too large."}, status=413)
    except RequestDataTooBig:
        return JsonResponse({"error": "Request body is too large."}, status=413)
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid request."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "Request body must be an object."}, status=400)
    form = ProjectInquiryForm(payload, service_types=services.all())
    if not form.is_valid():
        return JsonResponse({"errors": form.errors.get_json_data()}, status=400)
    if form.cleaned_data.get("website"):
        return JsonResponse({"ok": True})
    if _rate_limited(request):
        return JsonResponse({"error": "Please wait before sending another inquiry."}, status=429)
    try:
        send_inquiry(form.cleaned_data)
    except InquiryNotConfigured:
        return JsonResponse({"error": "The inquiry form is not configured yet."}, status=503)
    except Exception:
        return JsonResponse(
            {"error": "Something went wrong sending your inquiry."}, status=500
        )
    _mark_submitted(request)
    return JsonResponse({"ok": True})
