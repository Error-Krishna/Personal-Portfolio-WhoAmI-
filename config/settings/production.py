"""Production settings with secure defaults."""

from .base import *  # noqa: F403
from .base import ImproperlyConfigured


def _secret_is_strong(value):
    lowered = value.lower()
    return (
        len(value) >= 50
        and len(set(value)) >= 20
        and not any(marker in lowered for marker in ("replace-with", "changeme", "insecure", "secret-key"))
    )


if not _secret_is_strong(SECRET_KEY):  # noqa: F405
    raise ImproperlyConfigured(
        "DJANGO_SECRET_KEY must be a strong, unique environment-provided value in production."
    )

DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = max(SECURE_HSTS_SECONDS, 31_536_000)
if not ALLOWED_HOSTS:
    raise ImproperlyConfigured("DJANGO_ALLOWED_HOSTS must be configured in production.")

if not CSRF_TRUSTED_ORIGINS:
    raise ImproperlyConfigured(
        "DJANGO_CSRF_TRUSTED_ORIGINS must be configured in production."
    )
