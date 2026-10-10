from django.urls import path

from .views import assistant_stats_api

urlpatterns = [path("api/assistant-stats/", assistant_stats_api, name="assistant_stats_api")]
