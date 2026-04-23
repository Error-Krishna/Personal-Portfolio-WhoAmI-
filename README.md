# Krishna Goyal Portfolio

An interactive personal portfolio built with Django templates, Tailwind CDN styling, custom JavaScript, and a content-first workflow powered by JSON.

The public site no longer depends on database entries for project content. Instead, portfolio data is maintained in a single file and can be exported into a static site for fast, free hosting.

## Highlights

- Responsive portfolio homepage with animated hero, floating navigation, project showcase, about section, tech stack, and timeline
- File-driven project content via `content/projects.json`
- Project detail pages generated from content data instead of database records
- Static-export workflow for fast hosting on platforms like Render Static Sites or Cloudflare Pages
- Django still available locally as the authoring and preview environment

## Tech Stack

- Django 5
- Tailwind via CDN
- Vanilla JavaScript
- Three.js
- WhiteNoise-compatible static handling

## Project Structure

```text
content/
  projects.json          # Main content source for project cards and detail pages
main/
  content.py             # Content loader and homepage enrichment helpers
  views.py               # Public routes
  management/commands/
    buildstatic.py       # Static export command
portfolio_core/
  settings.py            # Django settings
templates/
  home.html
  layout.html
  project_detail.html
  project_video_gallery.html
static/
  js/tech-stack-3d.js
```

## How Content Works Now

The public portfolio reads from:

- `content/projects.json`

Each project entry can control:

- `slug`
- `title`
- `tagline`
- `category`
- `tech_stack`
- `detailed_description`
- `live_url`
- `github_url`
- `featured_on_home`
- `show_detail_link`
- `home_badge`
- `home_summary`
- `home_cta_label`

### Editing a Project

To add or edit a project:

1. Open `content/projects.json`
2. Update an existing object or add a new one
3. If you want it on the homepage showcase, set:
   - `"featured_on_home": true`
4. If you want its detail page linked from the homepage, set:
   - `"show_detail_link": true`
5. Commit and redeploy

### Adding a New Homepage Project

The homepage showcase renders in the same order as the featured entries appear in `content/projects.json`.

If you add a new featured project, it will automatically:

- appear in the homepage showcase
- get a project detail page at `/project/<slug>/`

## Local Development

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the Django development server:

```bash
DJANGO_DEBUG=true python manage.py runserver 127.0.0.1:8000
```

Visit:

```text
http://127.0.0.1:8000/
```

## Checks and Tests

Run framework checks:

```bash
python manage.py check
```

Run tests:

```bash
python manage.py test
```

## Static Export Workflow

This project supports generating a static build for fast hosting.

Build the static site:

```bash
bash build_static.sh
```

Or directly:

```bash
python manage.py buildstatic
```

The generated output goes to:

- `dist/index.html`
- `dist/project/<slug>/index.html`
- `dist/static/...`

## Recommended Hosting

### Best free and fast option

- Cloudflare Pages

### Good alternative

- Render Static Site

For both, use:

- Build command: `bash build_static.sh`
- Output directory: `dist`

## Render Static Site Setup

If you deploy on Render as a static site:

1. Create a new Static Site
2. Connect the GitHub repository
3. Configure:
   - Build command: `bash build_static.sh`
   - Publish directory: `dist`
4. Deploy

## Environment Variables

For the static export workflow, environment variables are generally minimal.

If you still run the Django app directly in preview/development, you can use:

- `DJANGO_DEBUG=true` locally

Example values are in:

- `.env.example`

## Notes

- The public portfolio no longer relies on database entries for project content
- Existing Django models remain in the repo, but the public-facing project pages now use file content
- This makes updates simpler and hosting faster

## Future Improvements

- Move non-project homepage content into a dedicated JSON content file too
- Add a content schema validator for `projects.json`
- Add generated Open Graph metadata per project
- Add a lightweight AI/about-me assistant backed by a safe public knowledge file
