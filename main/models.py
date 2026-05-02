# models.py
from django.db import models


class DailyVisitorStat(models.Model):
    date = models.DateField(unique=True)
    unique_visitors = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.date}: {self.unique_visitors} unique visitors"


class Project(models.Model):
    CATEGORY_CHOICES = [
        ('development', 'Development'),
        ('video-editing', 'Video Editing'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    tagline = models.CharField(max_length=300)
    
    detailed_description = models.TextField(help_text="Full HTML allowed content")
    
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    tech_stack = models.JSONField(default=list, help_text='Enter as JSON array: ["Django", "Tailwind CSS"]')
    thumbnail = models.ImageField(upload_to='projects/', blank=True, null=True)
    
    video_file = models.FileField(upload_to='videos/', blank=True, null=True, help_text='Preview video for project detail page')
    live_url = models.URLField(blank=True, null=True, help_text='URL to live website')
    github_url = models.URLField(blank=True, null=True, help_text='URL to GitHub repository')

    def __str__(self):
        return self.title

class ProjectVideo(models.Model):
    VIDEO_TYPES = [
        ('local', 'Local Video'),
        ('instagram', 'Instagram Reel'),
    ]

    project = models.ForeignKey(Project, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    video_file = models.FileField(upload_to='videos/', blank=True, null=True) # For local
    instagram_url = models.URLField(blank=True, null=True) # For reels
    type = models.CharField(max_length=20, choices=VIDEO_TYPES, default='local')

    def __str__(self):
        return f"{self.project.title} - {self.title}"
