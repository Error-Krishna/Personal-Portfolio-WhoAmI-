from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse


def health_check(request):
    return JsonResponse({"status": "ok"})


def robots_txt(request):
    sitemap_url = request.build_absolute_uri(reverse("sitemap"))
    return HttpResponse(
        "User-agent: *\n"
        "Disallow: /admin/\n"
        "Disallow: /api/\n"
        "Disallow: /health/\n"
        "Disallow: /resume/file/\n"
        "Disallow: /resume/download/\n"
        f"Sitemap: {sitemap_url}\n",
        content_type="text/plain; charset=utf-8",
    )


def page_not_found(request, exception):
    """Render a navigation-focused 404 without exposing the exception."""
    return render(request, "pages/404.html", status=404)


def server_error(request):
    """Render a generic 500 page without exposing internal error details."""
    return render(request, "pages/500.html", status=500)
