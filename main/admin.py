# main/admin.py
from django.contrib import admin
from .models import Project, ProjectVideo

class ProjectVideoInline(admin.TabularInline):
    model = ProjectVideo
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'category', 'live_url', 'github_url')
    list_filter = ('category',)
    search_fields = ('title', 'tagline')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProjectVideoInline]

@admin.register(ProjectVideo)
class ProjectVideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'type')
    list_filter = ('type', 'project')