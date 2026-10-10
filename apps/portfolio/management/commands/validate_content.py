from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.portfolio.content.validation import ContentValidationError, validate_content


class Command(BaseCommand):
    help = "Validate portfolio project, service, pricing, testimonial, FAQ, and site content."

    def handle(self, *args, **options):
        try:
            counts = validate_content(Path(settings.BASE_DIR))
        except ContentValidationError as exc:
            raise CommandError(str(exc)) from exc

        self.stdout.write(
            self.style.SUCCESS(
                "Content validation passed. "
                f"Validated {counts['projects']} projects, {counts['services']} services, "
                f"{counts['pricing']} pricing packages, {counts['testimonials']} testimonials, "
                f"{counts['faq']} FAQ entries, and site configuration."
            )
        )
