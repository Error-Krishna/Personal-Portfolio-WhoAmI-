# Deployment Notes

## Recommended hosting model

This portfolio now supports a static-export workflow. That means you can generate HTML, CSS, JS, and static assets into `dist/` and deploy the result on fast free hosts.

## Build the static site

```bash
bash build_static.sh
```

This generates:

- `dist/index.html`
- `dist/project/<slug>/index.html`
- `dist/static/...`

## Render Static Site

- Build command: `bash build_static.sh`
- Publish directory: `dist`

## Cloudflare Pages

- Build command: `bash build_static.sh`
- Build output directory: `dist`

## Local validation

Before deploying, verify the build locally:

```bash
python manage.py check
python manage.py test
python manage.py buildstatic
```

## Editing content

Public portfolio content now lives in:

- `content/projects.json`

That file controls homepage project cards and project detail pages.
