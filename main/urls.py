# main/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('health/', views.health_check, name='health_check'),
    path('project/<slug:slug>/', views.project_detail, name='project_detail'),
    path('resume/', views.resume_page, name='resume'),
    path('resume/file/', views.resume_file, name='resume_file'),
    path('resume/download/', views.resume_download, name='resume_download'),
    path('assistant/', views.assistant_page, name='assistant'),
    path('api/assistant-stats/', views.assistant_stats_api, name='assistant_stats_api'),
    path('api/chat/', views.chat_api, name='chat_api'),
]
