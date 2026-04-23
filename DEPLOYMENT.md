# Deployment Notes

## Required environment variables

- `DJANGO_DEBUG=false`
- `DJANGO_SECRET_KEY=<long-random-secret>`
- `DJANGO_ALLOWED_HOSTS=<comma-separated-hosts>`
- `DJANGO_CSRF_TRUSTED_ORIGINS=<comma-separated-https-origins>`

## Install command

```bash
pip install -r requirements.txt
```

## Build command

```bash
bash build.sh
```

## Start command

```bash
gunicorn portfolio_core.wsgi:application --log-file -
```

## Important note about the current database

This project currently uses the committed `db.sqlite3` file. That works for a read-mostly portfolio, but on platforms with ephemeral filesystems, admin edits made after deployment may not persist across restarts or redeploys.

If you want persistent runtime edits, the next step is moving the project to PostgreSQL.
