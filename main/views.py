# views.py
from django.shortcuts import render, get_object_or_404
from .models import Project

def home(request):
    return render(request, 'home.html')

def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    
    # Check if it's a video-editing project and use appropriate template
    if project.category == 'video-editing':
        return render(request, 'project_video_gallery.html', {'project': project})
    else:
        return render(request, 'project_detail.html', {'project': project})