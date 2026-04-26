# Krishna Goyal Portfolio

A Django-based portfolio and AI assistant project with file-driven content, live chat support, and deployment-ready configuration for both local development and Render Web Service hosting.

## Highlights

- Portfolio pages driven by `content/projects.json`
- Public and private assistant knowledge files
- Live assistant routes at `/assistant/` and `/api/chat/`
- Render Web Service support for full Django deployment
- Optional static export for portfolio-only hosting

## Stack

- Django 5
- Gunicorn
- WhiteNoise
- Groq API
- Vanilla JavaScript

## Project Structure

```text
content/
  projects.json
  krish_public.md
  krish_private.md
main/
  content.py
  views.py
  urls.py
  tests.py
  management/commands/buildstatic.py
portfolio_core/
  settings.py
templates/
static/
.env.example
render.yaml
```

## Configuration

Local development reads settings from:

```text
.env
```

Create it from the example:

```bash
cp .env.example .env
```

For local work, uncomment the development section in `.env.example` and paste it into `.env`.

## Local Development

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the server:

```bash
python3 manage.py runserver 127.0.0.1:8000
```

Open:

```text
http://127.0.0.1:8000/
```

## Assistant Modes

- Public mode reads from `content/krish_public.md`
- Admin mode can access `content/krish_private.md`
- Admin unlock happens server-side and persists in the Django session

## Production Deployment

For a live assistant in production, deploy this as a Render Web Service, not a static site.

This repo includes:

- [render.yaml](/Users/krishnagoyal/Desktop/krishna_portfolio/render.yaml)
- [Procfile](/Users/krishnagoyal/Desktop/krishna_portfolio/Procfile)
- [build.sh](/Users/krishnagoyal/Desktop/krishna_portfolio/build.sh)
- `/health/` health check endpoint

### Required production environment variables

- `DJANGO_SECRET_KEY`
- `GROQ_API_KEY`
- `KRISH_ADMIN_PASSPHRASE`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`

Render can provide these through its dashboard or via `render.yaml` for non-secret defaults.

## Static Export

This project still supports a portfolio-only static export:

```bash
bash build_static.sh
```

Use that only when you do not need the live chat API in production.

## Checks

Run before pushing:

```bash
python3 manage.py check
python3 manage.py test
```

## Security Notes

- `.env` is gitignored and should never be committed
- Do not commit real API keys or admin passphrases
- Rotate any credential that has been exposed in screenshots, commits, or chats
- Production should keep HTTPS, secure cookies, and HSTS enabled

## More Deployment Details

See [DEPLOYMENT.md](/Users/krishnagoyal/Desktop/krishna_portfolio/DEPLOYMENT.md) for the full Render setup.
