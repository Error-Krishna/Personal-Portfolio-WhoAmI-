from django.urls import path

from . import views

urlpatterns = [
    path("assistant/", views.assistant_page, name="assistant"),
    path("api/chat/", views.chat_api, name="chat_api"),
    path("api/admin-logout/", views.admin_logout, name="admin_logout"),
    path("api/admin-login/", views.admin_login, name="admin_login"),
    path("api/admin-status/", views.admin_mode_status, name="admin_mode_status"),
    path("api/admin-private-knowledge/", views.admin_private_knowledge, name="admin-private-knowledge"),
]
