from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.urls import include, path
from django.contrib.sitemaps.views import sitemap

from apps.portfolio.sitemaps import PortfolioPagesSitemap, PublishedCaseStudiesSitemap
from apps.core.views import robots_txt

sitemaps = {
    "pages": PortfolioPagesSitemap,
    "case-studies": PublishedCaseStudiesSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sitemap.xml', sitemap, {"sitemaps": sitemaps}, name="sitemap"),
    path('robots.txt', robots_txt, name="robots_txt"),
    path('', include('apps.core.urls')),
    path('', include('apps.portfolio.urls')),
    path('', include('apps.assistant.urls')),
    path('', include('apps.booking.urls')),
    path('', include('apps.analytics.urls')),
]

handler404 = "apps.core.views.page_not_found"
handler500 = "apps.core.views.server_error"

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
