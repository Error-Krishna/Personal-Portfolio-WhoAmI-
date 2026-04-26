# main/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('project/<slug:slug>/', views.project_detail, name='project_detail'),
    path('assistant/', views.assistant_page, name='assistant'),
    path('api/chat/', views.chat_api, name='chat_api'),
]
