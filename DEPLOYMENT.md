# Deployment Guide

## Pre-Deployment Checklist

- Copy `.env.example` to `.env`
- Set `DJANGO_ENV=production`
- Set `DJANGO_DEBUG=false`
- Set a real `DJANGO_SECRET_KEY`
- Set a real `GROQ_API_KEY`
- Set a private `KRISH_ADMIN_PASSPHRASE`
- Set `DJANGO_ALLOWED_HOSTS`
- Set `DJANGO_CSRF_TRUSTED_ORIGINS`
- Keep secure cookie and SSL settings enabled

## Production `.env` Example

```dotenv
DJANGO_ENV=production
DJANGO_DEBUG=false
DJANGO_LOG_LEVEL=INFO

DJANGO_SECRET_KEY=replace-with-a-long-random-secret
GROQ_API_KEY=replace-with-your-groq-api-key
KRISH_ADMIN_PASSPHRASE=replace-with-a-private-admin-passphrase

DJANGO_ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://your-domain.com,https://www.your-domain.com

DJANGO_SESSION_COOKIE_SECURE=true
DJANGO_CSRF_COOKIE_SECURE=true
DJANGO_SECURE_SSL_REDIRECT=true
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=true
DJANGO_SECURE_HSTS_PRELOAD=true
```

## Django App Deployment

This repo already includes:

- `Procfile`
- `gunicorn`
- WhiteNoise-compatible static settings

Typical steps:

```bash
pip install -r requirements.txt
python3 manage.py collectstatic --noinput
gunicorn portfolio_core.wsgi:application --log-file -
```

## Static Export Deployment

To build the static site:

```bash
bash build_static.sh
```

Deploy the generated `dist/` folder to a static host such as:

- Cloudflare Pages
- Render Static Site

## Validation Before Deploy

Run:

```bash
python3 manage.py check
python3 manage.py test
python3 manage.py buildstatic
```
