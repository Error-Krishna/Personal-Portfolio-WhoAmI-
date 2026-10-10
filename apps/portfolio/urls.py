from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("work/", views.work_index, name="work_index"),
    path("work/<slug:slug>/", views.project_detail, name="work_project_detail"),
    # Keep the old route while templates and external links transition.
    path("project/<slug:slug>/", views.legacy_project_redirect, name="project_detail"),
    path("services/", views.services_page, name="services"),
    path("about/", views.about_page, name="about"),
    path("process/", views.process_page, name="process"),
    path("resume/", views.resume_page, name="resume"),
    path("resume/file/", views.resume_file, name="resume_file"),
    path("resume/download/", views.resume_download, name="resume_download"),
]
