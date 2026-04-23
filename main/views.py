from django.http import Http404
from django.shortcuts import render

from .content import get_home_projects, get_project

def home(request):
    return render(
        request,
        'home.html',
        {'home_projects': get_home_projects()},
    )

def project_detail(request, slug):
    project = get_project(slug)
    if not project:
        raise Http404("Project not found")

    if project["category"] == 'video-editing':
        return render(request, 'project_video_gallery.html', {'project': project})
    else:
        return render(request, 'project_detail.html', {'project': project})
