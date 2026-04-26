# Deployment Guide

## Recommended Production Mode

Use Render Web Service for the live site if you want these routes to work in production:

- `/assistant/`
- `/api/chat/`

A static deployment cannot serve the Django chat API.

## Render Web Service Setup

This repo now includes:

- [render.yaml](/Users/krishnagoyal/Desktop/krishna_portfolio/render.yaml)
- [Procfile](/Users/krishnagoyal/Desktop/krishna_portfolio/Procfile)
- [build.sh](/Users/krishnagoyal/Desktop/krishna_portfolio/build.sh)
- WhiteNoise static file support
- `/health/` for health checks

### Render settings

- Service type: `Web Service`
- Runtime: `Python`
- Build command: `bash build.sh`
- Start command: `gunicorn portfolio_core.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --log-file -`
- Health check path: `/health/`

## Environment Variables On Render

Set these in the Render dashboard or let `render.yaml` define the non-secret defaults:

### Required secrets

- `DJANGO_SECRET_KEY`
- `GROQ_API_KEY`
- `KRISH_ADMIN_PASSPHRASE`

### Required production config

- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`

### Recommended production values

```dotenv
DJANGO_ENV=production
DJANGO_DEBUG=false
DJANGO_LOG_LEVEL=INFO

DJANGO_ALLOWED_HOSTS=krishna-portfolio-v7ow.onrender.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://krishna-portfolio-v7ow.onrender.com

DJANGO_SESSION_COOKIE_SECURE=true
DJANGO_CSRF_COOKIE_SECURE=true
DJANGO_SECURE_SSL_REDIRECT=true
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=true
DJANGO_SECURE_HSTS_PRELOAD=true
```

## Local `.env` vs Render Environment Variables

- Local development uses your local `.env`
- Render production uses environment variables configured in Render

The app supports both:

- it loads `.env` locally
- it also respects environment variables already provided by the hosting platform

## What `build.sh` Does

`build.sh` now runs:

```bash
python3 manage.py migrate --noinput
python3 manage.py collectstatic --noinput
```

This prepares the deployed app before startup.

## Validation Before Deploy

Run locally:

```bash
python3 manage.py check
python3 manage.py test
```

## Optional Static Export

You can still build a static version with:

```bash
bash build_static.sh
```

But that mode is only for a portfolio-only deployment and will not support the live assistant API.
