# Deployment notes

The intended hosting target is a Render Web Service running Django through Gunicorn and WhiteNoise. Static export is optional and does not support the assistant API.

## Render service

The repository's `render.yaml` configures:

- build command: `bash build.sh`
- start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --log-file -`
- health check: `/health/`

The build validates content, collects static files, applies migrations, and runs Django deployment checks. Failures stop the build. PostgreSQL must be provisioned and `DATABASE_URL` available during the build because migrations run there.

## Required environment

Set these in the Render dashboard; never put their values in `render.yaml`:

- `DJANGO_SECRET_KEY`
- `DATABASE_URL` from the PostgreSQL provider selected for production
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
- `GROQ_API_KEY` if the assistant is enabled

The contact form route is active. Configure `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`, `DEFAULT_FROM_EMAIL`, and the recipient `CONTACT_EMAIL` in the Render environment if it should deliver messages. Recipient fallback is `CONTACT_RECEIVER_EMAIL`, then `EMAIL_HOST_USER`; without any recipient, submissions return an unconfigured response. Delivery failures return a generic error and do not log inquiry contents. Local development uses Django's in-memory email backend when `EMAIL_HOST` is blank. No real email is sent by the automated tests.

`BOOKING_URL` is optional and no scheduling provider has been selected. The current inquiry form remains the contact path.

`DJANGO_DEBUG` is forced off by the production settings. `DJANGO_SECRET_KEY`, `DATABASE_URL`, `DJANGO_ALLOWED_HOSTS`, and `DJANGO_CSRF_TRUSTED_ORIGINS` are required for production startup. `GROQ_API_KEY` is required only for live assistant responses; without it the assistant fails closed with a generic unavailable response. The provider adapter uses a 20-second timeout and does not retry provider requests.

## Assistant request limits

The public assistant accepts up to 20 requests per 60-second window, keyed by the visitor IP and Django session. The current Django cache is process-local, so this limit does not coordinate across multiple Gunicorn workers or instances and can reset on restart. Configure a shared production cache before treating this as a distributed abuse-control limit.

## Discoverability and production headers

Canonical and sitemap URLs derive their scheme and host from the request. Production must set the correct allowed host and preserve a trustworthy `X-Forwarded-Proto` value at the HTTPS proxy. The production settings enable HTTPS redirects, secure session/CSRF cookies, HSTS, content-type sniffing protection, clickjacking protection, and a same-origin referrer policy. HSTS subdomain/preload behavior remains opt-in. No Content Security Policy is configured; validate a policy against the deployed asset and JSON-LD setup before enabling one. Static assets currently use the application’s `/static/` path and WhiteNoise where installed; CDN behavior remains deployment-specific.

The production database provider and domain are still deployment decisions. SMTP/contact delivery also requires production configuration; the inquiry page remains unavailable when no provider is configured.

## Rotate compromised credentials

The previously exposed values must be replaced externally before deployment:

- Generate a new Django signing key and set `DJANGO_SECRET_KEY` in the Render service environment (and local `.env` if used there).
- Revoke the exposed Groq key, create a replacement, and set `GROQ_API_KEY` in the Render service environment (and local `.env` if the assistant is used locally).

Never put replacement values in `render.yaml`, `.env.example`, source, or documentation. Also rotate any email/database credentials if those values were exposed elsewhere.

HSTS is enabled for one year in production. `includeSubDomains` and `preload` remain disabled until every subdomain is confirmed HTTPS-only and the domain owner intentionally opts into browser preload behavior.

## Known production gap

The application now accepts a PostgreSQL `DATABASE_URL` in production and retains SQLite for development. The provider decision and Render database attachment are still TBD, so production checks and migrations will fail until a provider is selected and configured. Do not rely on the current Render service for durable database records until that decision and configuration are completed.

Before deployment, provision automated PostgreSQL backups with the selected provider and confirm a restore path. For a rollback, redeploy the previous application build; if its code is incompatible with the current schema, restore a pre-deploy database backup before switching traffic. `/health/` is a liveness response and does not confirm database connectivity.
