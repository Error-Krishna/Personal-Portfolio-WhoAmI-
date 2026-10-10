"""Sitemaps containing only canonical, published portfolio pages."""

from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from .content.repositories import projects


class PortfolioPagesSitemap(Sitemap):
    def items(self):
        return (
            "home",
            "work_index",
            "services",
            "about",
            "process",
            "book",
            "assistant",
            "resume",
        )

    def location(self, item):
        return reverse(item)


class PublishedCaseStudiesSitemap(Sitemap):
    def items(self):
        return [item["slug"] for item in projects.for_work()]

    def location(self, item):
        return reverse("work_project_detail", args=[item])
