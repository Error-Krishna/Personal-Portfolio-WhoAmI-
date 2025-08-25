"""
URL configuration for portfolio project.
"""
from django.contrib import admin
from django.urls import path
from . import views

# --- Add these imports ---
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('project/<slug:project_slug>/', views.project_detail, name='project_detail'),
]

# --- This block tells Django to serve static files during development ---
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])