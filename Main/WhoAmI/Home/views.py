from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, 'Home/Home_index.html') 

def designing(request):
    return render(request, 'Home/Home_designing.html')

def development(request):
    return render(request , 'Home/Home_development.html')

def video_editing(request):
    return render(request , 'Home/Home_video_editing.html')