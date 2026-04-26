import importlib.util
import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured

WHITENOISE_INSTALLED = importlib.util.find_spec("whitenoise") is not None

BASE_DIR = Path(__file__).resolve().parent.parent

_UNSET = object()


def _load_dotenv(path: Path) -> None:
    """Load simple KEY=VALUE pairs from the project .env file."""
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def _get_env(name: str, default=_UNSET, *, required: bool = False) -> str:
    value = os.environ.get(name)
    if value is not None and value != "":
        return value

    if required:
        raise ImproperlyConfigured(
            f"Missing required environment variable '{name}' in {BASE_DIR / '.env'}."
        )

    if default is not _UNSET:
        return default

    raise ImproperlyConfigured(
        f"Environment variable '{name}' is not configured in {BASE_DIR / '.env'}."
    )


def _get_bool_env(name: str, default: bool) -> bool:
    value = os.environ.get(name)
    if value is None or value == "":
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _get_list_env(name: str, default: list[str] | None = None) -> list[str]:
    value = os.environ.get(name)
    if value is None or value == "":
        return list(default or [])
    return [item.strip() for item in value.split(",") if item.strip()]


_load_dotenv(BASE_DIR / ".env")

DJANGO_ENV = _get_env("DJANGO_ENV", default="development").strip().lower()
DEBUG = _get_bool_env("DJANGO_DEBUG", default=DJANGO_ENV != "production")

SECRET_KEY = _get_env("DJANGO_SECRET_KEY", required=True)

ALLOWED_HOSTS = _get_list_env(
    "DJANGO_ALLOWED_HOSTS",
    default=["127.0.0.1", "localhost"] if DJANGO_ENV == "development" else [],
)

CSRF_TRUSTED_ORIGINS = _get_list_env(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    default=["http://127.0.0.1:8000", "http://localhost:8000"]
    if DJANGO_ENV == "development"
    else [],
)

render_hostname = os.environ.get("RENDER_EXTERNAL_HOSTNAME", "").strip()
if render_hostname and render_hostname not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(render_hostname)

render_origin = f"https://{render_hostname}" if render_hostname else ""
if render_origin and render_origin not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append(render_origin)

if DJANGO_ENV == "production" and not ALLOWED_HOSTS:
    raise ImproperlyConfigured(
        "DJANGO_ALLOWED_HOSTS must be configured in .env for production."
    )

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "main",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if WHITENOISE_INSTALLED:
    MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")

ROOT_URLCONF = "portfolio_core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "portfolio_core.wsgi.application"
ASGI_APPLICATION = "portfolio_core.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / _get_env("DJANGO_SQLITE_NAME", default="db.sqlite3"),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = _get_env("DJANGO_LANGUAGE_CODE", default="en-us")
TIME_ZONE = _get_env("DJANGO_TIME_ZONE", default="Asia/Kolkata")
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": (
            "whitenoise.storage.CompressedManifestStaticFilesStorage"
            if WHITENOISE_INSTALLED
            else "django.contrib.staticfiles.storage.StaticFilesStorage"
        ),
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SECURE_SSL_REDIRECT = _get_bool_env(
    "DJANGO_SECURE_SSL_REDIRECT", default=DJANGO_ENV == "production"
)
SESSION_COOKIE_SECURE = _get_bool_env(
    "DJANGO_SESSION_COOKIE_SECURE", default=DJANGO_ENV == "production"
)
CSRF_COOKIE_SECURE = _get_bool_env(
    "DJANGO_CSRF_COOKIE_SECURE", default=DJANGO_ENV == "production"
)
SECURE_HSTS_SECONDS = int(
    _get_env(
        "DJANGO_SECURE_HSTS_SECONDS",
        default="31536000" if DJANGO_ENV == "production" else "0",
    )
)
SECURE_HSTS_INCLUDE_SUBDOMAINS = _get_bool_env(
    "DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", default=DJANGO_ENV == "production"
)
SECURE_HSTS_PRELOAD = _get_bool_env(
    "DJANGO_SECURE_HSTS_PRELOAD", default=DJANGO_ENV == "production"
)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "same-origin"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": _get_env("DJANGO_LOG_LEVEL", default="INFO"),
    },
}
