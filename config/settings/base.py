import importlib.util
import os
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from django.core.exceptions import ImproperlyConfigured
from config.environment import load_local_env

WHITENOISE_INSTALLED = importlib.util.find_spec("whitenoise") is not None

BASE_DIR = Path(__file__).resolve().parents[2]

_UNSET = object()


def _get_env(name: str, default=_UNSET, *, required: bool = False) -> str:
    value = os.environ.get(name)
    if value is not None and value != "":
        return value

    if required:
        raise ImproperlyConfigured(
            f"Missing required environment variable '{name}' (set it in the process environment or {BASE_DIR / '.env'})."
        )

    if default is not _UNSET:
        return default

    raise ImproperlyConfigured(
        f"Environment variable '{name}' is not configured in the process environment or {BASE_DIR / '.env'}."
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


load_local_env(BASE_DIR)

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
    "django.contrib.sitemaps",
    "apps.core.apps.CoreConfig",
    "apps.portfolio.apps.PortfolioConfig",
    "apps.assistant.apps.AssistantConfig",
    "apps.booking.apps.BookingConfig",
    "apps.analytics.apps.AnalyticsConfig",
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

ROOT_URLCONF = "config.urls"

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
                "apps.portfolio.context_processors.site_settings",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

def _database_config():
    database_url = os.environ.get("DATABASE_URL", "").strip()
    if database_url:
        parsed = urlparse(database_url)
        if parsed.scheme not in {"postgres", "postgresql"} or not parsed.hostname or not parsed.path:
            raise ImproperlyConfigured("DATABASE_URL must be a PostgreSQL connection URL.")
        query = parse_qs(parsed.query)
        options = {}
        for key in ("sslmode", "sslrootcert", "sslcert", "sslkey"):
            if key in query:
                options[key] = query[key][-1]
        return {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": unquote(parsed.path.lstrip("/")),
            "USER": unquote(parsed.username or ""),
            "PASSWORD": unquote(parsed.password or ""),
            "HOST": parsed.hostname,
            "PORT": str(parsed.port or ""),
            "OPTIONS": options,
            "CONN_MAX_AGE": 60,
        }
    if DJANGO_ENV == "production":
        raise ImproperlyConfigured("DATABASE_URL must be configured for production PostgreSQL.")
    return {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / _get_env("DJANGO_SQLITE_NAME", default="db.sqlite3"),
    }


DATABASES = {"default": _database_config()}
ADMIN_MODE_USERNAME = _get_env(
    "ADMIN_MODE_USERNAME",
    default="Krishna",
).strip()


# Optional absolute path for the private knowledge file (e.g. a persistent disk in
# production). Empty means content/krish_private.md inside the project.
KRISH_PRIVATE_KNOWLEDGE_PATH = _get_env("KRISH_PRIVATE_KNOWLEDGE_PATH", default="").strip()

# Shared cache for production rate limits across Gunicorn workers.
# Local development remains usable without a Redis server.
REDIS_URL = os.environ.get("REDIS_URL", "").strip()

if DJANGO_ENV == "production" and not REDIS_URL:
    raise ImproperlyConfigured(
        "REDIS_URL must be configured in production for shared rate limiting."
    )

if REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": REDIS_URL,
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
                "SOCKET_CONNECT_TIMEOUT": 2,
                "SOCKET_TIMEOUT": 2,
            },
        },
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "portfolio-local-cache",
        },
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
DATA_UPLOAD_MAX_MEMORY_SIZE = 32 * 1024

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
    "DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", default=False
)
SECURE_HSTS_PRELOAD = _get_bool_env(
    "DJANGO_SECURE_HSTS_PRELOAD", default=False
)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "same-origin"

# --- Contact form email ---
# Without SMTP, keep inquiry messages in memory during local development rather
# than writing their contents to server logs. Production uses SMTP when configured.
EMAIL_HOST = _get_env("EMAIL_HOST", default="")
EMAIL_PORT = int(_get_env("EMAIL_PORT", default="587"))
EMAIL_HOST_USER = _get_env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = _get_env("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = _get_bool_env("EMAIL_USE_TLS", default=True)
EMAIL_BACKEND = (
    "django.core.mail.backends.smtp.EmailBackend"
    if EMAIL_HOST
    else "django.core.mail.backends.locmem.EmailBackend"
)
DEFAULT_FROM_EMAIL = _get_env("DEFAULT_FROM_EMAIL", default=EMAIL_HOST_USER or "no-reply@localhost")
# The inbox that should actually receive messages sent through the site's contact form.
CONTACT_RECEIVER_EMAIL = _get_env(
    "CONTACT_EMAIL",
    default=_get_env("CONTACT_RECEIVER_EMAIL", default=EMAIL_HOST_USER or ""),
)
BOOKING_URL = _get_env("BOOKING_URL", default="").strip()
GROQ_MODEL = _get_env("GROQ_MODEL", default="openai/gpt-oss-120b").strip()
GROQ_MAX_TOKENS = int(_get_env("GROQ_MAX_TOKENS", default="1024"))
GROQ_TEMPERATURE = float(_get_env("GROQ_TEMPERATURE", default="0.7"))

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
