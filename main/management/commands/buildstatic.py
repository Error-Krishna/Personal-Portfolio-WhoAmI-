import shutil
from pathlib import Path

from django.conf import settings
from django.core.management import BaseCommand, CommandError, call_command
from django.test import Client, override_settings

from main.content import load_projects


class Command(BaseCommand):
    help = "Build a static export of the portfolio into the dist/ directory."

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        dist_dir = base_dir / "dist"
        static_dir = base_dir / "staticfiles"

        if dist_dir.exists():
            shutil.rmtree(dist_dir)

        call_command("collectstatic", interactive=False, verbosity=0)

        pages = [("/", dist_dir / "index.html")]
        for project in load_projects():
            pages.append(
                (
                    f"/project/{project['slug']}/",
                    dist_dir / "project" / project["slug"] / "index.html",
                )
            )

        with override_settings(
            DEBUG=True,
            SECURE_SSL_REDIRECT=False,
            ALLOWED_HOSTS=["testserver", "localhost", "127.0.0.1"],
            CSRF_TRUSTED_ORIGINS=[],
        ):
            client = Client()

            for route, output_path in pages:
                response = client.get(route)
                if response.status_code != 200:
                    raise CommandError(
                        f"Failed to build {route}. Received status code {response.status_code}."
                    )

                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_bytes(response.content)
                self.stdout.write(self.style.SUCCESS(f"Built {route} -> {output_path}"))

        shutil.copytree(static_dir, dist_dir / "static", dirs_exist_ok=True)
        self.stdout.write(self.style.SUCCESS(f"Copied static assets into {dist_dir / 'static'}"))
        self.stdout.write(self.style.SUCCESS(f"Static site export complete: {dist_dir}"))
