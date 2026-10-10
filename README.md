# Krishna Goyal Portfolio

This is a server-rendered Django portfolio. Django remains the application framework, and [blueprint.md](blueprint.md) remains the architecture source of truth.

## Current foundation

- Django templates with incremental boundaries under `apps/`
- Local SQLite database; production PostgreSQL provider is still TBD
- File-driven portfolio content with repository and validation services
- Optional Groq-powered assistant, with public and private knowledge files
- Existing `main` models and migrations retained for database compatibility
- Gunicorn and WhiteNoise deployment on Render
- Optional static export using `build_static.sh`

The settings entry points are `config/settings/development.py` and `config/settings/production.py`. Shared configuration lives in `config/settings/base.py`.

## Application boundaries

- `apps.core`: shared health endpoint and site infrastructure
- `apps.portfolio`: project, service, testimonial, site configuration, profile, and resume content; portfolio routes
- `apps.assistant`: request policy, knowledge loading, Groq provider adapter, and assistant API
- `apps.booking`: project inquiry form, email service, and `/book/` boundary; scheduling provider remains TBD
- `apps.analytics`: visitor tracking and assistant statistics API

`main` remains installed to preserve the current admin models and migration history. In particular, `DailyVisitorStat` remains registered under its existing app label so this refactor does not create a table move or migration.

## Content flow

JSON/Markdown files under `content/` are read by domain repositories, checked by `validate_content`, normalized into view-ready dictionaries, and passed from views to templates. Assistant knowledge files remain in the assistant boundary and are not part of portfolio content loading. The existing six project records remain the source of truth; repository adapters expose aliases such as `summary`, `stack`, and `featured` without changing stored content.

## Local setup

Use a Python version supported by the pinned requirements, create a virtual environment, and install the project requirements:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

Replace `DJANGO_SECRET_KEY` in `.env` with a locally generated random value. Add `GROQ_API_KEY` only if you want to use the assistant. Set `KRISH_ADMIN_PASSPHRASE` only if you use assistant admin mode. These credentials were previously exposed and must be rotated before production use. `.env` is local and must never be committed.

Start Django:

```bash
python manage.py runserver 127.0.0.1:8000
```

## Validation

```bash
python manage.py check
python manage.py validate_content
python manage.py test
```

For production configuration:

```bash
DJANGO_ENV=production python manage.py check --deploy
```

## Routes and deployment

Routes include `/`, `/work/`, `/work/<slug>/`, the compatible `/project/<slug>/`, `/services/`, `/about/`, `/process/`, `/book/`, `/assistant/`, `/resume/`, and `/health/`. Render starts `config.wsgi:application` and checks `/health/`. The assistant requires server-side Groq configuration; static export does not include live APIs. Services and process pages remain truthful empty states until their content is supplied; `/about/` points to the existing About section.

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment details and remaining production decisions. Do not treat the README as overriding the blueprint.
