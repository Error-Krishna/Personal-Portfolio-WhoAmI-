from .content.repositories import site


def site_settings(request):
    return {"site_settings": site.settings()}
