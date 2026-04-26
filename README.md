# Krishna Goyal Portfolio

A Django-based portfolio and AI assistant project with file-driven content, static export support, and a deployment-ready `.env` configuration model.

## What Changed

- Environment variables are loaded from the project `.env` file at startup.
- Secrets and credentials are no longer hardcoded in Python or frontend templates.
- Development and production modes are controlled from `.env`, not by editing source code.
- The assistant admin passphrase is now validated server-side and is no longer exposed in page source.
- The README and deployment flow now assume a safer, production-ready setup.

## Stack

- Django 5
- WhiteNoise
- Groq API
- Vanilla JavaScript
- File-driven content in `content/`

## Project Structure

```text
content/
  projects.json
  krish_public.md
  krish_private.md
main/
  content.py
  views.py
  tests.py
  management/commands/buildstatic.py
portfolio_core/
  settings.py
templates/
static/
.env.example
```

## Configuration Model

The app reads configuration from:

```text
.env
```

Do not commit `.env`. Copy the example file first:

```bash
cp .env.example .env
```

## Local Development

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy the example env and fill in real values:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
python3 manage.py runserver 127.0.0.1:8000
```

Open:

```text
http://127.0.0.1:8000/
```

## Switching Between Development And Production

Switching modes is done only through `.env`.

### Development

Use:

```dotenv
DJANGO_ENV=development
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
DJANGO_CSRF_TRUSTED_ORIGINS=http://127.0.0.1:8000,http://localhost:8000
DJANGO_SESSION_COOKIE_SECURE=false
DJANGO_CSRF_COOKIE_SECURE=false
DJANGO_SECURE_SSL_REDIRECT=false
DJANGO_SECURE_HSTS_SECONDS=0
```

### Production

Use:

```dotenv
DJANGO_ENV=production
DJANGO_DEBUG=false
DJANGO_ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://your-domain.com,https://www.your-domain.com
DJANGO_SESSION_COOKIE_SECURE=true
DJANGO_CSRF_COOKIE_SECURE=true
DJANGO_SECURE_SSL_REDIRECT=true
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=true
DJANGO_SECURE_HSTS_PRELOAD=true
```

No code changes are required when switching environments.

## Required Environment Variables

- `DJANGO_SECRET_KEY`
- `GROQ_API_KEY`
- `KRISH_ADMIN_PASSPHRASE`

## Optional Environment Variables

- `DJANGO_ENV`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
- `DJANGO_LOG_LEVEL`
- `DJANGO_SQLITE_NAME`
- `DJANGO_LANGUAGE_CODE`
- `DJANGO_TIME_ZONE`
- `GROQ_MODEL`
- `GROQ_MAX_TOKENS`
- `GROQ_TEMPERATURE`

## Assistant Security Notes

- Public mode uses only `content/krish_public.md`
- Admin mode can access `content/krish_private.md`
- The admin passphrase is checked on the server and is not exposed to the browser
- The passphrase unlock persists in the Django session for that browser session

## Content Editing

### Projects

Edit:

- `content/projects.json`

### Public assistant knowledge

Edit:

- `content/krish_public.md`

### Private assistant knowledge

Edit:

- `content/krish_private.md`

## Checks

Run:

```bash
python3 manage.py check
python3 manage.py test
```

## Static Export

Build the static version with:

```bash
bash build_static.sh
```

This generates:

- `dist/index.html`
- `dist/project/<slug>/index.html`
- `dist/static/...`

## Deployment Notes

This project can be deployed in two ways:

1. As a Django app with Gunicorn
2. As a static export using `buildstatic`

For Django deployment, make sure your production `.env` is present on the server and includes the correct hosts, trusted origins, and secure cookie settings.

## Security Checklist

- Keep `.env` out of git
- Never commit real API keys or admin passphrases
- Rotate any secret that was previously exposed in local files, screenshots, or commits
- Use production-only secure cookies and HTTPS settings in deployment
