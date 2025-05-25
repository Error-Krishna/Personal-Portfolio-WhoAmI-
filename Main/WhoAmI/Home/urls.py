
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = 'index'),
    path('designing.html/', views.designing, name = 'designing'),
    path('development.html/', views.development, name = 'development'),
    path('video-editing.html/', views.video_editing, name = 'video_editing'),
] 