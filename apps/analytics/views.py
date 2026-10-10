from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .services import get_daily_stats


@require_GET
def assistant_stats_api(request):
    if not (request.user.is_authenticated and request.user.is_staff):
        return JsonResponse({"error": "Staff access required"}, status=403)
    return JsonResponse({"stats": get_daily_stats()})
