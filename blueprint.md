# Krishna Goyal — Production Freelance Portfolio
## Master Blueprint / Single Source of Truth

**Document status:** AUTHORITATIVE  
**Version:** 1.0  
**Date:** 2026-10-08  
**Project:** Krishna Goyal Freelance Portfolio  
**Primary purpose:** Convert the current portfolio into a mature, minimalist, conversion-focused freelance portfolio and a maintainable production-grade Django application.

---

# 0. How This Document Is Used

This file is the **single source of truth (SSOT)** for the project.

From this point forward:

1. Architecture decisions must be recorded here before implementation when they materially affect the system.
2. UI implementation must follow the design system defined here.
3. New features must have a defined purpose, route, data contract, security model, and acceptance criteria.
4. Existing code is considered **legacy implementation**, not the authority for the new architecture.
5. Existing content may be reused only after it is reviewed and mapped into the new content model.
6. No secret belongs in this file.
7. No private personal information belongs in public portfolio content.
8. If this document conflicts with an older README, old template, old JavaScript file, or previous implementation, **this document wins** unless a later decision is explicitly recorded in the Decision Log.
9. If a requirement is undecided, mark it `TBD` rather than silently inventing a value.
10. Every implementation phase must end with validation before the next phase starts.

---

# 1. Project Vision

## 1.1 Product statement

This is not merely a personal portfolio.

It is a **freelance client-conversion website** for Krishna Goyal.

The site must answer, quickly and convincingly:

- Who is Krishna?
- What does he build?
- What business problems can he solve?
- What kind of projects does he take?
- What does working with him look like?
- What evidence exists that he can deliver?
- What does a typical engagement cost?
- How can a prospect start a conversation?
- Can a visitor get answers without contacting Krishna immediately?

The desired visitor journey is:

```text
Discover
  ↓
Understand
  ↓
Trust
  ↓
Explore
  ↓
Evaluate
  ↓
Ask
  ↓
Book
  ↓
Start project
```

---

# 2. Primary Business Goal

The website should generate qualified freelance conversations.

## Primary conversion

**Book a Session / Start a Project**

## Secondary conversions

- View selected work
- Open a project case study
- Ask the AI assistant
- View services
- View pricing
- Download/view resume
- Contact Krishna

## Non-goals

The website should NOT optimize for:

- maximum visual effects
- maximum animation
- demonstrating every technology ever used
- looking like a gaming website
- being a resume pasted onto a webpage
- hiding important information behind unnecessary interactions
- collecting unnecessary visitor data

---

# 3. Target Audience

## 3.1 Primary audience

### Founder / startup owner

Needs:

- MVP
- SaaS product
- dashboard
- internal tool
- automation
- website
- product prototype

Main question:

> Can Krishna understand my problem and build the product reliably?

### Small business owner

Needs:

- website
- internal business software
- automation
- dashboards
- operational tools
- analytics

Main question:

> Can Krishna turn a business process into software without making everything complicated?

### Agency / technical partner

Needs:

- frontend implementation
- full-stack implementation
- backend/API work
- feature development
- technical support

Main question:

> Can Krishna work independently and integrate into an existing workflow?

### Individual / professional

Needs:

- personal website
- portfolio
- landing page
- automation
- small application

Main question:

> Is Krishna the right person for this project and budget?

---

# 4. Brand Positioning

## 4.1 Core positioning

Preferred direction:

> **I build digital products that move ideas forward.**

Supporting idea:

> Product-minded frontend and full-stack engineering for founders, businesses, and teams.

The exact copy can evolve, but the positioning must remain:

- professional
- mature
- technically credible
- outcome-oriented
- independent
- approachable
- not overly corporate
- not student-like

## 4.2 Avoid

Avoid positioning such as:

- “coding enthusiast”
- “tech geek”
- “future software engineer”
- “I know 20 technologies”
- “welcome to my digital universe”
- excessive AI hype
- exaggerated claims
- fake agency language
- invented client numbers
- invented testimonials
- invented revenue or impact

---

# 5. Design Direction

## 5.1 Visual personality

The visual language should feel like:

- independent product studio
- modern consulting
- editorial portfolio
- premium SaaS
- calm engineering
- precise craftsmanship

Reference qualities, not copied designs:

- Apple-level restraint
- Linear-like precision
- modern consulting clarity
- editorial typography
- product-studio confidence

## 5.2 Design principles

1. Whitespace over decoration.
2. Typography over gradients.
3. Hierarchy over effects.
4. Real project evidence over technology lists.
5. Motion should communicate state or hierarchy.
6. Every animation must have a purpose.
7. Mobile is a first-class experience.
8. Accessibility is part of the design.
9. Content must remain readable without JavaScript.
10. Performance beats spectacle.

---

# 6. Color System

Use a warm, soft, semi-formal palette.

## Core tokens

```text
--color-bg:            #F7F5F0
--color-surface:       #FEFDF9
--color-surface-soft:  #F1EFE9
--color-text:          #191A18
--color-text-muted:    #77736B
--color-border:        #DEDAD1
--color-border-strong: #C9C4B9
--color-sage:          #7D9184
--color-sage-soft:     #E4EBE6
--color-clay:          #B88972
--color-clay-soft:     #F0E3DC
--color-success:       #54735F
--color-danger:        #A85A55
```

## Dark sections

Dark sections are allowed but should be used intentionally:

```text
--color-dark:          #191A18
--color-dark-surface:  #242622
--color-dark-muted:    #A9A69E
--color-dark-border:   #3A3B37
```

## Rules

- No neon cyan.
- No neon purple.
- No glowing text.
- No rainbow gradients.
- No excessive glassmorphism.
- No default dark futuristic aesthetic.
- Accent colors should remain muted.
- Buttons must have clear contrast.
- Text contrast must meet WCAG AA where applicable.

---

# 7. Typography

Preferred hierarchy:

## Display

Use a refined serif or high-quality editorial font if performance permits.

Purpose:

- hero statement
- major section headings
- case-study titles

## UI/body

Use a clean sans-serif.

Purpose:

- navigation
- body
- buttons
- metadata
- forms
- cards

Recommended implementation approach:

```text
Display: system/editorial serif
Body: Inter/system sans
```

Do not add a large font dependency unless the visual benefit justifies it.

## Typography rules

- Avoid huge text that pushes useful content below the fold.
- Use generous line height.
- Keep body line lengths readable.
- Use consistent heading scale.
- Avoid excessive uppercase text.
- Use weight to establish hierarchy rather than color effects.

---

# 8. Motion System

Motion should be subtle.

Allowed:

- fade-in
- small vertical reveal
- hover elevation
- button state transitions
- navigation transitions
- case-study image reveal
- subtle page transition
- accordion expansion
- assistant panel opening
- booking flow transitions

Avoid:

- plasma cursor
- cursor replacement
- bouncing elements
- excessive parallax
- large 3D backgrounds
- constant particle movement
- spinning technology logos
- animations that continue forever without purpose

## Motion accessibility

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When enabled:

- disable decorative motion
- reduce transition durations
- disable auto-playing visual effects
- preserve functional feedback

---

# 9. Technology Direction

## Existing baseline

The current project uses:

- Django 5.2
- Python
- Gunicorn
- WhiteNoise
- Groq
- Vanilla JavaScript
- Tailwind via CDN
- JSON/Markdown content
- SQLite
- Render

This is the existing implementation baseline.

## New production architecture

Keep Django as the application foundation.

Preferred architecture:

```text
Python
Django
Django Templates
PostgreSQL
Vanilla JavaScript / lightweight progressive enhancement
CSS architecture or controlled Tailwind build
Groq API
Gunicorn
WhiteNoise
Render
```

Do not introduce React/Next.js solely for the portfolio unless a concrete requirement proves it necessary.

Reason:

- portfolio is primarily content-driven
- server-rendered pages are fast
- Django already exists
- lower operational complexity
- easier SEO
- easier deployment
- easier maintenance

---

# 10. Phase 0 — Project Foundation

## Objective

Before redesigning the UI, make the repository clean, predictable, secure, testable, and deployable.

**No major visual redesign starts before Phase 0 is complete.**

---

## Phase 0.1 — Repository audit

Inventory:

- all tracked files
- all untracked files
- templates
- static assets
- JavaScript
- CSS
- Python modules
- content files
- database files
- environment files
- deployment files
- generated files
- media
- PDFs
- obsolete experiments

Commands:

```bash
git status
git ls-files
find . -maxdepth 3 -type f | sort
```

Also inspect:

```bash
git log --oneline --decorate -20
git remote -v
```

Acceptance:

- repository contents understood
- secrets identified
- obsolete files identified
- current deployment understood

---

# 11. Phase 0.2 — Secret cleanup

The current uploaded project contains secret-looking credentials in `.env`.

Treat these credentials as compromised because they have been exposed during development.

Actions:

1. Rotate the Groq API key.
2. Replace the admin passphrase.
3. Confirm `.env` is ignored.
4. Ensure `.env` is not tracked.
5. Create `.env.example` with placeholders only.
6. Search repository history for exposed secrets.
7. If a secret exists in Git history, rotate it regardless of whether it is currently active.
8. Never put credentials into this blueprint.

Search:

```bash
git grep -n "gsk_"
git grep -n "API_KEY"
git grep -n "PASSPHRASE"
git grep -n "SECRET_KEY"
```

Check:

```bash
git ls-files .env
```

Expected:

```text
(no output)
```

If `.env` is tracked:

```bash
git rm --cached .env
```

Then commit the removal.

---

# 12. Phase 0.3 — Git baseline

Create a clean baseline branch.

Recommended:

```text
main
develop
```

Optional feature branches:

```text
feature/phase-0-foundation
feature/design-system
feature/homepage
feature/case-studies
feature/services
feature/booking
feature/assistant
feature/seo
feature/deployment
```

Rules:

- `main` must always be deployable.
- Do not commit broken intermediate states to `main`.
- Use meaningful commits.

Examples:

```text
chore: establish project structure
chore: secure environment configuration
feat: add portfolio design tokens
feat: rebuild homepage hero
feat: add project case studies
feat: add booking flow
feat: add AI assistant
fix: improve mobile navigation
perf: optimize project media
```

---

# 13. Phase 0.4 — Python environment

Create an isolated environment.

Recommended:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Upgrade tooling:

```bash
python -m pip install --upgrade pip setuptools wheel
```

Install requirements:

```bash
pip install -r requirements.txt
```

Record Python version:

```bash
python --version
```

Production and local Python versions must be compatible.

Pin important production dependencies.

---

# 14. Phase 0.5 — Dependency cleanup

Audit:

```bash
pip list
pip freeze
```

Remove unused dependencies.

Current known requirements include:

```text
Django
gunicorn
whitenoise
Pillow
groq
```

Do not retain a dependency merely because it was used by the old UI.

Every dependency should answer:

> Why does production need this?

---

# 15. Phase 0.6 — Django project structure

Target structure:

```text
portfolio/
├── manage.py
├── pyproject.toml
├── requirements.txt
├── requirements-dev.txt
├── .env.example
├── .gitignore
├── README.md
├── BLUEPRINT.md
├── render.yaml
├── build.sh
│
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/
│   ├── core/
│   ├── portfolio/
│   ├── assistant/
│   ├── booking/
│   └── analytics/
│
├── content/
│   ├── profile/
│   ├── projects/
│   ├── services/
│   ├── testimonials/
│   └── site/
│
├── templates/
│   ├── base/
│   ├── components/
│   ├── pages/
│   └── emails/
│
├── static/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── icons/
│   └── resume/
│
├── media/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── scripts/
```

The exact folder naming may change during implementation, but the separation of responsibilities must remain.

---

# 16. Application boundaries

## `core`

Responsibilities:

- base templates
- common utilities
- health check
- error pages
- SEO helpers
- shared configuration

Must NOT contain project-specific business logic.

## `portfolio`

Responsibilities:

- homepage
- project listing
- project details
- services
- about
- testimonials
- pricing
- content loading

## `assistant`

Responsibilities:

- public AI assistant
- conversation endpoint
- knowledge retrieval
- prompt construction
- rate limiting
- admin-only knowledge operations if retained

## `booking`

Responsibilities:

- booking page
- booking CTA
- booking form
- booking provider integration
- inquiry capture if enabled

## `analytics`

Responsibilities:

- minimal first-party analytics
- daily visitor statistics
- privacy-safe counters

Do not allow analytics logic to break the public website.

---

# 17. Settings architecture

Split settings into:

```text
config/settings/base.py
config/settings/development.py
config/settings/production.py
```

Base:

- installed apps
- middleware
- templates
- static configuration
- internationalization
- default settings

Development:

- DEBUG
- local hosts
- local email backend
- development logging

Production:

- DEBUG=False
- secure cookies
- HTTPS redirect
- HSTS
- allowed hosts
- CSRF trusted origins
- production logging
- secure proxy settings

Secrets must come from environment variables.

---

# 18. Environment configuration

`.env.example` must contain placeholders:

```dotenv
DJANGO_ENV=development
DJANGO_DEBUG=true

DJANGO_SECRET_KEY=

DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
DJANGO_CSRF_TRUSTED_ORIGINS=http://127.0.0.1:8000

GROQ_API_KEY=
GROQ_MODEL=

BOOKING_URL=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_USE_TLS=
DEFAULT_FROM_EMAIL=
CONTACT_EMAIL=

DJANGO_LOG_LEVEL=INFO
```

Never commit `.env`.

Never place production secrets in `render.yaml`.

---

# 19. Database decision

## Development

SQLite is acceptable for local development.

## Production

Use PostgreSQL.

Reason:

- reliable persistence
- better concurrency
- production-grade database
- compatible with future booking/inquiry/analytics features

Do not use SQLite as the long-term production database.

---

# 20. Content architecture

The portfolio should remain content-driven.

The website should not require editing HTML to change:

- project title
- project summary
- project category
- project status
- service description
- pricing
- testimonial
- about content

Preferred content sources:

```text
content/
├── profile/
│   ├── bio.md
│   ├── availability.md
│   └── skills.json
│
├── projects/
│   ├── udhyog-saathi.json
│   ├── insightloop.json
│   ├── hotreload.json
│   └── personal-finance-tracker.json
│
├── services/
│   └── services.json
│
├── testimonials/
│   └── testimonials.json
│
└── site/
    ├── navigation.json
    ├── faq.json
    └── settings.json
```

---

# 21. Project content schema

Each project should support:

```json
{
  "slug": "example-project",
  "title": "Project title",
  "short_title": "Short title",
  "status": "active|completed|archived|building",
  "featured": true,
  "category": "SaaS|Web App|Developer Tool|Automation|Analytics|Website",
  "client_type": "Startup|Business|Personal|Internal",
  "summary": "One sentence outcome.",
  "problem": "What problem existed.",
  "solution": "What was built.",
  "role": "What Krishna owned.",
  "outcomes": [
    "Outcome 1",
    "Outcome 2"
  ],
  "features": [],
  "stack": [],
  "architecture": [],
  "screenshots": [],
  "video": null,
  "live_url": null,
  "github_url": null,
  "featured_order": 1,
  "testimonial_id": null
}
```

Only include measurable outcomes when they are real and verifiable.

---

# 22. Project case-study structure

Every major case study follows:

```text
Hero
↓
Project overview
↓
Context
↓
Problem
↓
Approach
↓
Solution
↓
Key features
↓
Technical architecture
↓
Challenges / decisions
↓
Result
↓
Screens / media
↓
What I learned
↓
Next project
↓
CTA
```

Case studies must explain thinking, not merely display screenshots.

---

# 23. Initial project priority

Priority 1:

### Udhyog Saathi

Position as:

- SaaS
- manufacturing operations
- product thinking
- real business problem

Priority 2:

### InsightLoop

Position as:

- analytics
- dashboards
- business operations
- full-stack engineering

Priority 3:

### HotReload

Position as:

- developer tooling
- Go
- systems thinking
- CLI engineering

Priority 4:

### Personal Finance Tracker

Position as:

- full-stack application
- data visualization
- product UX

Other projects can remain in the archive.

---

# 24. Homepage information architecture

Final homepage order:

```text
1. Navigation
2. Hero
3. Trust / credibility strip
4. What I do
5. Selected work
6. How I work
7. Currently building
8. Services + pricing
9. Testimonials
10. About
11. FAQ
12. AI assistant
13. Booking CTA
14. Footer
```

---

# 25. Navigation

Desktop:

```text
KRISHNA

Work
Services
Process
About
Ask Krish

[Book a Session]
```

Mobile:

```text
Logo
Menu
```

Do not overcrowd navigation.

Resume can live under About or in the footer rather than being a primary nav item.

---

# 26. Hero specification

Hero must answer:

- who Krishna is
- what he does
- who he helps
- what action to take

Example structure:

```text
Product-minded engineer
building useful digital products.

I help founders and businesses turn ideas,
workflows, and problems into polished software.

[Start a Project] [View My Work]

Available for selected freelance projects
```

This is directional copy. Final wording can be refined during content phase.

---

# 27. Trust strip

Use truthful credibility signals only.

Possible items:

```text
Frontend
Full-stack
SaaS
Automation
Dashboards
Developer Tools
```

Or actual verified experience/projects.

Do not create fake “trusted by 50+ companies” claims.

---

# 28. Services

Initial service categories:

## 1. Websites

For:

- portfolios
- company websites
- landing pages
- product websites

## 2. Web Applications

For:

- dashboards
- internal tools
- customer portals
- business applications

## 3. Product Development

For:

- MVPs
- SaaS
- prototypes
- new product features

## 4. Automation

For:

- repetitive workflows
- internal automation
- integrations
- data workflows

## 5. Data & Analytics

For:

- dashboards
- reporting
- business insights
- visualization

Services must describe outcomes first and technologies second.

---

# 29. Pricing model

Use three packages.

Names:

```text
Launch
Build
Scale
```

## Launch

For:

- landing page
- portfolio
- simple business site
- focused MVP surface

## Build

For:

- web application
- dashboard
- internal tool
- multi-page product

## Scale

For:

- larger application
- SaaS
- ongoing development
- integrations
- automation

Actual prices are **TBD** until the pricing strategy is finalized.

Do not publish placeholder prices as if they are final.

Each package should show:

- ideal for
- scope
- estimated timeline
- starting price
- what's included
- what's not included
- CTA

Avoid unlimited-scope promises.

---

# 30. Pricing architecture

The website should support:

```text
starting_price
currency
timeline
features[]
ideal_for
cta
```

Example schema:

```json
{
  "slug": "launch",
  "name": "Launch",
  "description": "For focused web launches.",
  "starting_price": null,
  "currency": "USD",
  "timeline": "TBD",
  "features": [],
  "ideal_for": [],
  "cta": "Discuss your project"
}
```

---

# 31. How I Work

Five-step process:

```text
01 Understand
02 Plan
03 Build
04 Launch
05 Improve
```

## Understand

Clarify:

- business goal
- users
- requirements
- constraints
- success criteria

## Plan

Define:

- scope
- architecture
- milestones
- deliverables

## Build

Develop:

- UI
- backend
- integrations
- testing

## Launch

Handle:

- deployment
- production configuration
- QA
- handoff

## Improve

Optional:

- maintenance
- analytics
- iteration
- new features

---

# 32. Booking system

The booking CTA should be available throughout the site.

Primary CTA:

```text
Book a Session
```

Initial architecture should prefer a reliable external scheduling provider rather than building a full calendar system from scratch.

Configuration:

```text
BOOKING_URL
```

The `/book/` route should be the stable website entry point.

It may:

- embed a booking provider
- redirect to a booking provider
- show a simple project inquiry form

The exact provider is **TBD**.

---

# 33. Booking flow

Recommended:

```text
Visitor clicks Book a Session
        ↓
/book/
        ↓
Short context
        ↓
What are you building?
        ↓
Optional project details
        ↓
Choose session / schedule
        ↓
Confirmation
```

Do not request unnecessary information.

Potential fields:

```text
name
email
company
project_type
budget_range
timeline
project_description
```

Budget and timeline can be optional.

---

# 34. Inquiry data model

If inquiries are stored locally:

```text
ProjectInquiry
----------------
id
created_at
name
email
company
project_type
budget_range
timeline
message
status
source
```

Status:

```text
new
reviewed
contacted
qualified
closed
```

Do not store sensitive data unnecessarily.

---

# 35. Testimonials

Only real testimonials.

Schema:

```json
{
  "id": "testimonial-001",
  "name": "Person name",
  "role": "Role",
  "company": "Company",
  "quote": "Actual quote",
  "project": "project-slug",
  "approved": true
}
```

If no real testimonials exist:

Do not fabricate them.

Instead show:

```text
Selected project outcomes
```

or:

```text
What I've built
```

until authentic testimonials are available.

---

# 36. About section

The About page should communicate:

- engineering mindset
- product thinking
- what kinds of problems Krishna enjoys
- selected experience
- current focus
- working style

It should not read like a university application.

Education can be available in the resume.

---

# 37. Resume

Keep `/resume/`.

Responsibilities:

- display current resume
- provide PDF
- use a stable PDF path
- avoid duplicating the entire resume into homepage content

The resume is a supporting artifact, not the primary sales page.

---

# 38. AI assistant

Keep the agent.

Reposition it from:

> AI bot that knows everything about me

to:

> A portfolio guide that helps visitors understand Krishna's work and decide what to explore next.

Possible identity:

```text
Krish
Portfolio Assistant
```

---

# 39. AI assistant responsibilities

Public assistant can answer:

- Who is Krishna?
- What does he build?
- What services does he offer?
- Which project is relevant to my problem?
- What technologies does he use?
- How does he work?
- What are his current projects?
- How can I book a session?
- Where is the resume?
- What is the difference between services?

It can recommend:

```text
"Based on that, you may want to look at Udhyog Saathi."
```

---

# 40. AI assistant must NOT reveal

Never reveal:

- private profile information
- health information
- private contact data unless intentionally public
- admin credentials
- API keys
- private files
- internal company strategy
- private business ownership details
- authentication information
- private job-search details
- server configuration
- environment variables

Public knowledge and private knowledge must remain strictly separated.

---

# 41. AI architecture

```text
Browser
  ↓
POST /api/chat/
  ↓
Request validation
  ↓
Rate limit
  ↓
Conversation normalization
  ↓
Public knowledge retrieval
  ↓
Prompt construction
  ↓
Groq API
  ↓
Output validation
  ↓
JSON response
```

Admin functionality must never be reachable merely by prompting the model.

Authorization must happen server-side.

---

# 42. AI request schema

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What does Krishna build?"
    }
  ],
  "context": {
    "page": "/work/udhyog-saathi/"
  }
}
```

Server validates:

- message count
- message length
- role
- content type
- total payload size

---

# 43. AI response schema

```json
{
  "reply": "Krishna builds...",
  "suggested_actions": [
    {
      "label": "View Udhyog Saathi",
      "url": "/work/udhyog-saathi/"
    },
    {
      "label": "Book a session",
      "url": "/book/"
    }
  ]
}
```

Do not return internal prompt details.

---

# 44. AI security

Required:

- rate limiting
- input length limits
- output length limits
- timeout
- exception handling
- API key server-side only
- no raw provider errors to users
- logging without sensitive prompt content
- abuse protection

Potential rate limit:

```text
TBD after production traffic expectations are known
```

Start conservatively.

---

# 45. AI failure behavior

If Groq is unavailable:

Show:

```text
I'm having trouble connecting right now.
You can explore the work directly or book a session.
```

The portfolio must remain fully usable without AI.

AI is an enhancement, not a dependency for basic navigation.

---

# 46. Analytics

Current visitor tracking uses a daily visitor counter.

Keep analytics minimal.

Initial metrics:

```text
unique visitors/day
```

Potential future metrics:

```text
project views
booking CTA clicks
assistant opens
booking conversions
```

Do not implement invasive tracking by default.

---

# 47. Analytics failure rule

Analytics must never break the public site.

Pattern:

```text
try analytics
if analytics fails:
    continue request
```

No public route should return an error because analytics storage is unavailable.

---

# 48. SEO

Every public page needs:

```text
<title>
<meta name="description">
canonical
Open Graph title
Open Graph description
Open Graph image
Twitter/X card metadata
```

Pages:

```text
/
 /work/
/work/<slug>/
/services/
/process/
/about/
/book/
/assistant/
/resume/
```

---

# 49. Structured data

Use JSON-LD where appropriate.

Potential types:

```text
Person
WebSite
ProfessionalService
CreativeWork
```

Only publish accurate information.

Do not add fake ratings or review structured data.

---

# 50. Sitemap and robots

Provide:

```text
/sitemap.xml
/robots.txt
```

Sitemap should include only canonical public pages.

Do not expose private/admin URLs through sitemap.

---

# 51. Accessibility

Minimum:

- semantic HTML
- keyboard navigation
- visible focus state
- sufficient contrast
- accessible labels
- proper heading hierarchy
- alt text
- no keyboard traps
- reduced motion support
- mobile touch targets
- form validation accessible to screen readers

Test:

```text
keyboard only
screen reader basics
Lighthouse accessibility
```

---

# 52. Responsive design

Breakpoints should be based on layout needs rather than device names.

Minimum validation:

```text
small mobile
large mobile
tablet
laptop
desktop
large desktop
```

Important:

- no horizontal overflow
- no fixed-width content that breaks
- navigation works without hover
- booking form works on mobile
- assistant works on mobile
- case studies remain readable

---

# 53. Component architecture

Templates should be componentized.

Target:

```text
templates/
├── base/
│   ├── base.html
│   └── head.html
│
├── components/
│   ├── navigation.html
│   ├── footer.html
│   ├── button.html
│   ├── project-card.html
│   ├── service-card.html
│   ├── pricing-card.html
│   ├── testimonial-card.html
│   ├── section-heading.html
│   ├── badge.html
│   ├── booking-cta.html
│   └── assistant-widget.html
│
└── pages/
    ├── home.html
    ├── work.html
    ├── project-detail.html
    ├── services.html
    ├── about.html
    ├── process.html
    ├── book.html
    ├── assistant.html
    └── resume.html
```

Avoid giant templates containing the entire application.

---

# 54. CSS architecture

Do not scatter large inline `<style>` blocks across templates.

Preferred:

```text
static/css/
├── tokens.css
├── base.css
├── layout.css
├── components.css
├── pages.css
└── utilities.css
```

If a build system is adopted later, keep the same logical separation.

---

# 55. JavaScript architecture

Target:

```text
static/js/
├── main.js
├── navigation.js
├── animations.js
├── assistant.js
├── booking.js
└── analytics.js
```

Rules:

- no global spaghetti
- use modules where practical
- no duplicated event handlers
- no unnecessary polling
- no JavaScript required for basic navigation
- graceful failure

---

# 56. Remove legacy visual systems

The old implementation contains:

- Spline/3D hero elements
- plasma cursor
- neon cyan/purple palette
- floating technology bubbles
- Three.js background
- strong glow effects
- heavy glassmorphism

These should be considered **deprecated**.

Do not carry them into the redesign by default.

---

# 57. Media strategy

Images should be:

- compressed
- responsive
- appropriately sized
- lazy-loaded when below the fold
- supplied with dimensions
- provided with useful alt text

Prefer:

```text
WebP
AVIF
```

where practical.

Avoid shipping giant source images.

---

# 58. Project screenshots

For each featured project prepare:

```text
hero image
overview image
feature images
optional architecture diagram
optional video
```

Use consistent aspect ratios.

Do not show five screenshots that communicate the same thing.

---

# 59. Performance targets

Initial targets:

```text
LCP: < 2.5s
CLS: < 0.1
INP: < 200ms
```

These are goals, not guarantees.

Performance work:

- remove unnecessary 3D
- optimize images
- reduce JavaScript
- reduce render-blocking assets
- use browser caching
- use compressed static files
- avoid layout shifts
- lazy-load below-fold media

---

# 60. URL architecture

Final route plan:

```text
/
 /work/
 /work/<slug>/
 /services/
 /process/
 /about/
 /book/
 /assistant/
 /resume/
 /resume/file/
 /resume/download/
 /health/
 /sitemap.xml
 /robots.txt

/api/chat/
/api/assistant-stats/
/api/inquiry/
```

Admin-only APIs should be explicitly protected.

---

# 61. Error pages

Implement:

```text
400.html
403.html
404.html
500.html
```

Style them consistently with the new visual system.

404 should provide:

```text
Page not found.
[Back home]
[View work]
```

---

# 62. Health endpoint

Keep:

```text
/health/
```

Expected:

```json
{
  "status": "ok"
}
```

Health endpoint must not depend on Groq.

Database dependency should be considered separately if required by the deployment environment.

---

# 63. Security baseline

Production:

```text
DEBUG=False
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS configured
X_FRAME_OPTIONS configured
SECURE_CONTENT_TYPE_NOSNIFF=True
```

Also configure:

- allowed hosts
- trusted origins
- secure proxy headers
- referrer policy
- content security policy where practical

Do not break legitimate embeds without testing.

---

# 64. CSRF

All state-changing Django requests require CSRF protection.

For assistant POST:

- obtain CSRF token
- send token
- reject unsafe requests without valid token

Do not disable CSRF globally.

---

# 65. Admin authentication

If the private assistant/admin mode remains:

- password/passphrase stored only in environment
- server-side session flag
- no admin state in localStorage
- no admin credential in JavaScript
- logout is POST
- session expiry should be considered
- rate-limit authentication attempts

Never allow the model to decide whether someone is an admin.

---

# 66. Content privacy boundary

Maintain:

```text
PUBLIC KNOWLEDGE
PRIVATE KNOWLEDGE
```

The public knowledge file can contain:

- professional bio
- public skills
- public projects
- public services
- public work history
- public links

Private knowledge can contain internal information but must only be accessible through authenticated server-side admin operations.

---

# 67. Forms

All forms require:

- server-side validation
- client-side enhancement
- CSRF
- length limits
- email validation
- error states
- success state
- spam protection

Never trust client-side validation.

---

# 68. Spam protection

For public inquiry/contact forms:

Initial:

- honeypot field
- server-side rate limiting
- minimum submission interval if appropriate

Future:

- CAPTCHA/Turnstile if abuse appears

Do not add CAPTCHA by default if it unnecessarily harms conversion.

---

# 69. Email architecture

If inquiry submission sends email:

```text
Browser
 ↓
Django
 ↓
validate
 ↓
store inquiry if enabled
 ↓
send notification
 ↓
return success
```

Email failure must be handled explicitly.

If email is critical, persist the inquiry before attempting email delivery.

---

# 70. Testing strategy

Testing levels:

## Unit tests

Test:

- content loaders
- pricing loader
- project lookup
- assistant prompt builder
- validators
- utility functions

## Integration tests

Test:

- page routes
- API routes
- forms
- database writes
- authentication
- permissions

## Browser/E2E tests

Test:

- homepage navigation
- project opening
- booking flow
- assistant interaction
- mobile menu
- resume download

---

# 71. Required route tests

At minimum:

```text
GET /
GET /work/
GET /work/<valid-slug>/
GET /work/<invalid-slug>/
GET /services/
GET /process/
GET /about/
GET /book/
GET /assistant/
GET /resume/
GET /resume/file/
GET /resume/download/
GET /health/
```

Expected:

- correct status
- correct template
- correct canonical metadata
- no server errors

---

# 72. Assistant tests

Test:

1. valid public question
2. empty message
3. oversized message
4. invalid role
5. too many messages
6. Groq timeout
7. Groq failure
8. rate limit
9. prompt injection attempt
10. attempt to retrieve private knowledge
11. admin authentication
12. logout
13. admin-only write action
14. public mode cannot write
15. API key missing

---

# 73. Content tests

Test:

- invalid JSON
- missing required project fields
- duplicate project slugs
- missing featured project
- broken internal links
- malformed testimonial
- missing service fields

The build should fail early if content is invalid.

---

# 74. Content validation command

Create a management command:

```bash
python manage.py validate_content
```

It should validate:

- project schema
- service schema
- testimonial schema
- site config
- required fields
- duplicate IDs/slugs

Expected success:

```text
Content validation passed.
```

---

# 75. Build validation

Create a production validation workflow:

```bash
python manage.py check --deploy
python manage.py validate_content
python manage.py test
python manage.py collectstatic --noinput
```

If all pass, deployment can proceed.

---

# 76. Local development workflow

Every development session:

```bash
source .venv/bin/activate
python manage.py runserver
```

Before commit:

```bash
python manage.py check
python manage.py validate_content
python manage.py test
```

Before deployment:

```bash
python manage.py check --deploy
python manage.py validate_content
python manage.py test
python manage.py collectstatic --noinput
```

---

# 77. CI workflow

Recommended GitHub Actions workflow:

```text
push / pull request
        ↓
install Python
        ↓
install dependencies
        ↓
validate environment
        ↓
Django checks
        ↓
content validation
        ↓
tests
        ↓
optional lint
        ↓
build/collectstatic
```

Do not deploy if CI fails.

---

# 78. Linting and formatting

Preferred tools:

```text
Ruff
Black
```

If the project remains small, use Ruff for linting and formatting.

Rules:

- consistent imports
- no unused variables
- no obvious dead code
- no accidental debug statements
- no secrets

---

# 79. Dependency security

Periodically audit:

```bash
pip list --outdated
```

Use a dependency vulnerability scanner in CI where practical.

Do not automatically upgrade production dependencies without testing.

---

# 80. Deployment target

Current recommended target:

**Render Web Service**

Reason:

- current project already supports it
- Django server required for AI API
- simple deployment
- health checks
- environment variables
- automatic deployment

---

# 81. Production Render architecture

```text
GitHub
   ↓
Render
   ↓
Python Web Service
   ↓
Gunicorn
   ↓
Django
   ├── PostgreSQL
   ├── Groq
   └── optional email provider
```

Static files:

```text
Django collectstatic
        ↓
WhiteNoise
```

---

# 82. Render build

Recommended:

```bash
bash build.sh
```

Build script should:

```bash
set -o errexit

python manage.py migrate --noinput
python manage.py validate_content
python manage.py collectstatic --noinput
python manage.py check --deploy
```

Do not hide errors.

---

# 83. Render start

Recommended:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --log-file -
```

Worker count should be tuned after observing memory/CPU constraints.

Do not blindly increase workers.

---

# 84. Production environment variables

Required:

```text
DJANGO_ENV=production
DJANGO_DEBUG=false
DJANGO_SECRET_KEY
DJANGO_ALLOWED_HOSTS
DJANGO_CSRF_TRUSTED_ORIGINS

GROQ_API_KEY
GROQ_MODEL

BOOKING_URL
```

If PostgreSQL:

```text
DATABASE_URL
```

If email:

```text
EMAIL_HOST
EMAIL_PORT
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
EMAIL_USE_TLS
DEFAULT_FROM_EMAIL
CONTACT_EMAIL
```

Never hardcode these.

---

# 85. Production deployment sequence

```text
1. Merge feature branch
2. CI passes
3. Confirm secrets are not committed
4. Push main
5. Render build starts
6. Dependencies install
7. Database migrations run
8. Content validation runs
9. Static collection runs
10. Django deployment checks run
11. Gunicorn starts
12. Health check runs
13. Smoke tests
14. Confirm production site
15. Monitor logs
```

---

# 86. Production smoke test

After deployment:

```text
/
 /work/
/services/
/about/
/book/
/assistant/
/resume/
/health/
```

Verify:

- 200 responses
- CSS loads
- JS loads
- images load
- project links work
- booking CTA works
- assistant works
- resume works
- no console errors
- no mixed content
- HTTPS active

---

# 87. Deployment rollback

If production breaks:

1. Identify failing deployment.
2. Check Render logs.
3. Check health endpoint.
4. Roll back to previous known-good commit.
5. Fix issue on feature branch.
6. Add regression test.
7. Redeploy.

Never patch production manually without recording the fix.

---

# 88. Observability

Minimum:

- application logs
- deployment logs
- health endpoint
- error responses
- assistant failure logs without sensitive content

Avoid logging:

- API keys
- passwords
- full user conversations
- private knowledge
- personal data unnecessarily

---

# 89. Backup strategy

For PostgreSQL:

- enable provider backups where available
- know restoration procedure
- document backup frequency
- test restoration periodically

For content files:

- Git is the source of truth
- deployment contains the same version
- do not manually edit production files

---

# 90. Content update workflow

To update a project:

```text
Edit content file
↓
validate_content
↓
run tests
↓
preview locally
↓
commit
↓
push
↓
CI
↓
deploy
```

Do not edit project content directly inside templates.

---

# 91. Homepage content model

Homepage should consume structured content:

```text
site settings
profile
featured projects
services
process
pricing
testimonials
current build
FAQ
```

The homepage view should not contain large blocks of hardcoded copy.

---

# 92. Current build section

Create a dedicated content entry:

```json
{
  "title": "Currently Building",
  "project": "udhyog-saathi",
  "status": "building",
  "summary": "..."
}
```

Use it to show active work without pretending it is finished.

---

# 93. FAQ

Initial questions:

```text
What kind of projects do you take?
How does working with you start?
How much does a project cost?
How long does a project take?
Can you work with an existing team?
Do you handle deployment?
Can you maintain a project after launch?
What technologies do you use?
```

Answers must reflect actual operating model.

---

# 94. Contact strategy

The site should not force a visitor to find an email address.

Primary CTA:

```text
Book a Session
```

Secondary:

```text
Start a Project
```

Tertiary:

```text
Email Krishna
```

All should be visible without excessive scrolling.

---

# 95. Conversion principles

Every major section should answer one of:

```text
Can he do it?
Has he done it?
Does he understand my problem?
What will it cost?
What happens next?
```

If a section answers none of these, question whether it belongs.

---

# 96. Project card design

Each project card should show:

```text
Category
Title
One-line outcome
Small technology metadata
Image/media
View case study →
```

Avoid:

- giant tech badge walls
- excessive tags
- long paragraphs
- fake metrics
- decorative UI unrelated to project

---

# 97. Project page metadata

At top:

```text
CATEGORY
PROJECT NAME

One-sentence outcome.

Role
Timeline
Stack
Status
```

Then case study.

---

# 98. Design system component inventory

Required components:

```text
Button
Link
Badge
SectionHeading
Navigation
MobileNavigation
ProjectCard
ProjectMeta
ServiceCard
PricingCard
TestimonialCard
FAQItem
BookingCTA
AssistantWidget
Footer
Toast
FormField
Modal/Drawer
```

Each component should have:

- default
- hover
- focus
- disabled where relevant
- mobile behavior

---

# 99. Button hierarchy

Primary:

```text
dark background
light text
```

Secondary:

```text
transparent / surface
border
dark text
```

Tertiary:

```text
text link
arrow
```

Avoid multiple visually competing primary buttons.

---

# 100. Card system

Cards should be restrained.

Use:

- thin borders
- subtle radius
- soft shadows only where useful
- warm surfaces
- clear hierarchy

Avoid:

- huge blur
- glowing borders
- animated gradients
- excessive shadows

---

# 101. Border radius

Use a small consistent scale.

Example:

```text
sm: 8px
md: 12px
lg: 18px
pill: 999px
```

Do not use a different radius for every component.

---

# 102. Layout width

Recommended:

```text
max content width: 1200–1280px
reading width: 680–760px
```

Use consistent horizontal gutters.

---

# 103. Spacing system

Use a predictable spacing scale.

Example:

```text
4
8
12
16
24
32
48
64
80
96
128
```

Avoid arbitrary spacing values throughout templates.

---

# 104. Dark/light usage

Default:

**warm light theme**

Dark sections:

- final CTA
- footer
- selected project sections
- assistant accent areas if useful

Do not create a complete dark/light toggle unless it has a clear product benefit.

---

# 105. Accessibility preference

No essential information may depend solely on:

- hover
- animation
- color
- 3D interaction
- cursor effects

---

# 106. Browser support

Target modern:

- Chrome
- Safari
- Firefox
- Edge

Pay particular attention to Safari because the project is developed on macOS.

Test:

- sticky navigation
- viewport units
- form controls
- backdrop filters
- scroll behavior
- image rendering

---

# 107. Mobile-first requirements

Mobile must support:

- readable hero
- easy navigation
- project cards
- pricing cards without awkward horizontal overflow
- booking
- assistant
- resume
- forms

Do not simply shrink desktop.

---

# 108. SEO content hierarchy

Homepage:

```text
H1: primary positioning statement
H2: services
H2: selected work
H2: process
H2: testimonials
H2: about
H2: FAQ
H2: CTA
```

Only one primary H1.

---

# 109. Accessibility heading hierarchy

Do not use headings for styling alone.

Example:

```html
<h1>...</h1>
<h2>...</h2>
<h3>...</h3>
```

No skipped hierarchy without a reason.

---

# 110. Image alt policy

Decorative image:

```text
alt=""
```

Meaningful project screenshot:

```text
alt="Udhyog Saathi manufacturing operations dashboard"
```

Never write:

```text
alt="image"
```

---

# 111. Performance budget

Keep initial JS small.

Avoid adding libraries for:

- simple modals
- simple accordions
- simple menus
- basic animations

Prefer platform APIs and small modules.

---

# 112. Third-party services

Current / possible:

```text
Groq
Render
Booking provider
Email provider
Google Fonts or alternative font provider
```

Every third-party dependency should have:

- purpose
- privacy impact
- failure behavior
- fallback

---

# 113. AI provider abstraction

Do not tightly couple every assistant component directly to Groq.

Create a service boundary:

```text
assistant/
    service.py
    providers/
        groq.py
```

This allows future provider replacement.

Interface concept:

```text
generate_reply(messages, knowledge, settings)
```

---

# 114. Booking provider abstraction

Similarly:

```text
booking/
    service.py
    providers/
        external.py
```

The UI should use:

```text
BOOKING_URL
```

rather than hardcoding a provider across templates.

---

# 115. Content service boundary

Create:

```text
portfolio/
    content/
        loader.py
        validators.py
        repositories.py
```

Views should not directly parse JSON in multiple places.

Use:

```text
ProjectRepository
ServiceRepository
TestimonialRepository
SiteRepository
```

---

# 116. Cache strategy

Content files can be cached in process if safe.

Do not reload large files repeatedly per request.

However:

- development should reflect edits conveniently
- production can cache immutable content
- invalid content must fail clearly

---

# 117. Database usage boundary

Do not put everything into the database just because Django supports models.

Database candidates:

- inquiries
- analytics
- future CMS data
- booking records if needed

File content candidates:

- projects
- services
- testimonials
- static profile
- FAQ

This keeps the portfolio simple.

---

# 118. No CMS initially

Do not build an admin CMS in Phase 0.

Reason:

- unnecessary complexity
- content changes are infrequent
- Git provides version control
- JSON/Markdown is adequate

A CMS can be added later if content volume requires it.

---

# 119. Static export

The existing project has static export capability.

Decision:

**Do not treat static export as the primary deployment path.**

Reason:

- AI assistant requires server API
- booking/inquiry may require server logic
- analytics may require server logic

Keep static export only if it remains inexpensive and useful.

---

# 120. Phase 1 — Product and content specification

Deliverables:

```text
final positioning
homepage copy
services
pricing
process
project priority
testimonial inventory
FAQ
booking flow
AI assistant behavior
```

Acceptance:

- no placeholder strategic decisions remain except explicitly marked TBD
- no fake proof
- every section has a purpose

---

# 121. Phase 2 — Design system

Deliver:

```text
color tokens
typography
spacing
buttons
cards
navigation
forms
responsive rules
motion rules
```

Acceptance:

- components are reusable
- no old neon styling remains
- no random colors
- mobile states defined

---

# 122. Phase 3 — Foundation refactor

Deliver:

```text
clean Django structure
settings split
content repositories
validation command
base templates
component templates
static architecture
environment handling
```

Acceptance:

```bash
python manage.py check
python manage.py validate_content
python manage.py test
```

all pass.

---

# 123. Phase 4 — Global shell

Implement:

```text
base template
navigation
mobile nav
footer
buttons
typography
global spacing
error pages
```

Acceptance:

- all routes use new shell
- responsive
- accessible
- no legacy visual system

---

# 124. Phase 5 — Homepage

Implement in order:

```text
hero
trust strip
services
selected work
process
currently building
pricing
testimonials
about
FAQ
assistant
booking CTA
footer
```

Do not implement all animations first.

Build structure first.

---

# 125. Phase 6 — Case studies

Implement:

```text
/work/
/work/<slug>/
```

Build reusable case-study template.

Populate priority projects.

Acceptance:

- content-driven
- responsive
- SEO metadata
- correct links
- optimized media

---

# 126. Phase 7 — Services + pricing

Implement:

```text
/services/
pricing cards
service detail sections
FAQ
CTA
```

Pricing must be honest and configurable.

---

# 127. Phase 8 — Booking

Implement:

```text
/book/
booking CTA
provider integration
fallback contact path
```

Test:

- mobile
- desktop
- blocked third-party provider
- invalid form
- successful booking

---

# 128. Phase 9 — AI assistant

Implement:

```text
assistant widget
assistant page
API
public knowledge
rate limiting
error fallback
suggested actions
```

Then implement admin functionality only if still necessary.

---

# 129. Phase 10 — SEO + accessibility

Complete:

```text
metadata
canonical URLs
OG tags
sitemap
robots
JSON-LD
alt text
keyboard navigation
focus states
reduced motion
forms
```

---

# 130. Phase 11 — Performance

Audit:

```text
Lighthouse
PageSpeed
browser devtools
network waterfall
bundle size
image sizes
layout shifts
```

Remove anything not contributing meaningful value.

---

# 131. Phase 12 — Security review

Checklist:

```text
[ ] no secrets in Git
[ ] DEBUG=False
[ ] secure cookies
[ ] HTTPS redirect
[ ] HSTS
[ ] CSRF
[ ] rate limiting
[ ] input validation
[ ] output limits
[ ] admin authorization
[ ] private knowledge protected
[ ] safe logging
[ ] secure headers
```

---

# 132. Phase 13 — Production deployment

Before deployment:

```bash
python manage.py check --deploy
python manage.py validate_content
python manage.py test
python manage.py collectstatic --noinput
```

Then:

```text
GitHub
↓
Render
↓
build
↓
migration
↓
content validation
↓
static collection
↓
Gunicorn
↓
health check
```

---

# 133. Phase 14 — Production QA

Perform manual QA on:

```text
Home
Work
Project
Services
Process
About
Book
Assistant
Resume
404
```

Also:

```text
desktop
mobile
Safari
Chrome
```

---

# 134. Phase 15 — Launch

Launch checklist:

```text
[ ] domain configured
[ ] HTTPS active
[ ] DNS correct
[ ] production env variables present
[ ] database connected
[ ] health check passes
[ ] homepage works
[ ] booking works
[ ] assistant works
[ ] resume works
[ ] SEO metadata verified
[ ] sitemap accessible
[ ] robots accessible
[ ] no console errors
[ ] analytics works if enabled
[ ] monitoring/logs checked
```

---

# 135. Post-launch

First week:

- inspect errors
- inspect assistant failures
- inspect booking issues
- review performance
- fix mobile issues
- review conversion path

Do not immediately add new visual features.

---

# 136. Maintenance workflow

For every change:

```text
Idea
↓
Check blueprint
↓
Define requirement
↓
Update blueprint if architecture changes
↓
Implement
↓
Test
↓
Preview
↓
Commit
↓
Deploy
```

---

# 137. Feature acceptance format

Every feature should define:

```text
Feature:
Purpose:
User:
Route:
Inputs:
Outputs:
Dependencies:
Security:
Failure behavior:
Tests:
Acceptance criteria:
```

Example:

```text
Feature: Booking CTA

Purpose:
Convert interested visitors into scheduled conversations.

User:
Prospective client.

Route:
/book/

Dependencies:
External booking provider.

Failure:
Provide email/contact fallback.

Acceptance:
Visitor can reach a working booking destination from mobile and desktop.
```

---

# 138. Definition of Done

A task is not done because it looks correct locally.

A task is done when:

```text
[ ] implementation complete
[ ] responsive
[ ] accessible
[ ] tested
[ ] error states handled
[ ] security reviewed
[ ] SEO considered
[ ] performance considered
[ ] content validated
[ ] no console errors
[ ] code organized
[ ] documentation updated
[ ] blueprint updated if decision changed
```

---

# 139. Definition of Production Ready

The project is production ready when:

```text
[ ] clean repository
[ ] no secrets committed
[ ] environment separation
[ ] production database
[ ] secure Django settings
[ ] tested routes
[ ] tested APIs
[ ] validated content
[ ] responsive UI
[ ] accessibility baseline
[ ] SEO baseline
[ ] optimized media
[ ] booking works
[ ] assistant works or gracefully fails
[ ] health check works
[ ] Render deployment succeeds
[ ] rollback procedure known
```

---

# 140. Final target architecture

```text
                           INTERNET
                              │
                              ▼
                         DNS / HTTPS
                              │
                              ▼
                           RENDER
                              │
                              ▼
                       Gunicorn / Django
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
          Portfolio        Assistant        Booking
              │               │                │
              │               ▼                ▼
              │             Groq          Booking Provider
              │
              ├── Projects
              ├── Services
              ├── Pricing
              ├── About
              ├── Testimonials
              └── FAQ
                              │
                              ▼
                         PostgreSQL
                              │
                   ┌──────────┴──────────┐
                   ▼                     ▼
               Inquiries             Analytics
```

---

# 141. Final repository target

```text
portfolio/
│
├── manage.py
├── BLUEPRINT.md
├── README.md
├── pyproject.toml
├── requirements.txt
├── requirements-dev.txt
├── .env.example
├── .gitignore
├── render.yaml
├── build.sh
│
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/
│   ├── core/
│   ├── portfolio/
│   ├── assistant/
│   ├── booking/
│   └── analytics/
│
├── content/
│   ├── profile/
│   ├── projects/
│   ├── services/
│   ├── testimonials/
│   └── site/
│
├── templates/
│   ├── base/
│   ├── components/
│   ├── pages/
│   └── emails/
│
├── static/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── icons/
│   └── resume/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── scripts/
```

---

# 142. Master implementation checklist

## Phase 0 — Foundation

```text
[ ] Audit repository
[ ] Audit Git history
[ ] Rotate exposed credentials
[ ] Remove secrets from files
[ ] Confirm .env ignored
[ ] Create .env.example
[ ] Create clean Python environment
[ ] Audit dependencies
[ ] Establish branch strategy
[ ] Split Django settings
[ ] Establish app boundaries
[ ] Establish content directories
[ ] Establish template directories
[ ] Establish static directories
[ ] Establish test directories
[ ] Add formatting/linting
[ ] Add content validation
[ ] Add deployment checks
[ ] Add/repair health endpoint
[ ] Confirm local startup
[ ] Confirm test suite
```

## Phase 1 — Product

```text
[ ] Final positioning
[ ] Final hero
[ ] Final services
[ ] Define packages
[ ] Define pricing
[ ] Define process
[ ] Select projects
[ ] Collect real testimonials
[ ] Write FAQ
[ ] Define booking flow
[ ] Define assistant scope
```

## Phase 2 — Design

```text
[ ] Color tokens
[ ] Typography
[ ] Spacing
[ ] Buttons
[ ] Cards
[ ] Navigation
[ ] Forms
[ ] Motion
[ ] Responsive rules
[ ] Accessibility rules
```

## Phase 3 — UI

```text
[ ] Global shell
[ ] Homepage
[ ] Work listing
[ ] Case studies
[ ] Services
[ ] Process
[ ] About
[ ] Pricing
[ ] Testimonials
[ ] FAQ
[ ] Booking
[ ] Resume
[ ] Assistant
[ ] Footer
```

## Phase 4 — Backend

```text
[ ] Content repositories
[ ] Content validation
[ ] Inquiry model
[ ] Analytics model
[ ] Booking integration
[ ] Assistant service
[ ] Rate limiting
[ ] Error handling
[ ] Admin permissions
```

## Phase 5 — Quality

```text
[ ] Unit tests
[ ] Integration tests
[ ] API tests
[ ] E2E tests
[ ] Accessibility audit
[ ] SEO audit
[ ] Performance audit
[ ] Security audit
[ ] Mobile QA
[ ] Safari QA
```

## Phase 6 — Deployment

```text
[ ] PostgreSQL configured
[ ] Render service configured
[ ] Production environment variables
[ ] Build command verified
[ ] Start command verified
[ ] Static files verified
[ ] Migrations verified
[ ] Health check verified
[ ] HTTPS verified
[ ] Domain verified
[ ] Production smoke test
[ ] Rollback procedure verified
```

---

# 143. Decision Log

## D001 — Django remains the backend/application framework

**Decision:** Yes.

**Reason:** Existing application is Django-based and the portfolio is primarily server-rendered/content-driven.

---

## D002 — PostgreSQL for production

**Decision:** Yes.

**Reason:** More appropriate for persistent production data than SQLite.

---

## D003 — File-driven portfolio content

**Decision:** Yes.

**Reason:** Projects/services/testimonials change relatively infrequently and benefit from Git versioning.

---

## D004 — AI assistant remains

**Decision:** Yes.

**Reason:** It differentiates the portfolio and can guide visitors.

---

## D005 — AI is not required for basic site functionality

**Decision:** Yes.

**Reason:** External AI availability must never prevent visitors from navigating or booking.

---

## D006 — Old neon visual system

**Decision:** Retire.

---

## D007 — 3D / plasma / heavy visual effects

**Decision:** Retire by default.

---

## D008 — Warm minimalist visual identity

**Decision:** Adopt.

---

## D009 — External booking provider

**Decision:** Preferred.

**Provider:** TBD.

---

## D010 — Fake testimonials

**Decision:** Forbidden.

---

## D011 — Static deployment

**Decision:** Not primary.

**Reason:** Live assistant and future server functionality require Django.

---

## D012 — CMS

**Decision:** Not initially.

**Reason:** Adds complexity without current necessity.

---

# 144. Open Decisions / TBD

These must be resolved before the relevant implementation phase.

```text
TBD-001 exact final domain
TBD-002 booking provider
TBD-003 final package prices
TBD-004 package timelines
TBD-005 final testimonials
TBD-006 final project metrics
TBD-007 final font selection
TBD-008 PostgreSQL provider
TBD-009 email provider
TBD-010 exact AI rate limit
TBD-011 whether admin knowledge editing remains
TBD-012 whether inquiry records are persisted
```

Do not silently resolve these during implementation.

---

# 145. Blueprint update rules

When a major decision changes:

1. Update the relevant section.
2. Add a new Decision Log entry.
3. Add the date.
4. Explain why the decision changed.
5. Check dependent sections.
6. Update implementation checklist.
7. Update tests if behavior changed.

Never silently change architecture.

---

# 146. Recommended implementation order

The exact order is mandatory unless a documented decision changes it.

```text
PHASE 0
Foundation + security + repository cleanup
        ↓
PHASE 1
Product positioning + content
        ↓
PHASE 2
Design system
        ↓
PHASE 3
Django architecture refactor
        ↓
PHASE 4
Global UI shell
        ↓
PHASE 5
Homepage
        ↓
PHASE 6
Case studies
        ↓
PHASE 7
Services + pricing
        ↓
PHASE 8
Booking
        ↓
PHASE 9
AI assistant
        ↓
PHASE 10
SEO + accessibility
        ↓
PHASE 11
Performance
        ↓
PHASE 12
Security
        ↓
PHASE 13
Deployment
        ↓
PHASE 14
Production QA
        ↓
PHASE 15
Launch + monitoring
```

---

# 147. First implementation task

**Do not start redesigning the homepage yet.**

The first actual coding task is:

> **Phase 0 — Foundation Audit and Repository Cleanup**

First produce:

```text
repository inventory
security audit
secret rotation
dependency audit
target folder structure
environment strategy
Django settings strategy
Git baseline
```

Then validate the clean foundation.

Only after Phase 0 acceptance criteria pass should implementation move to product/content design.

---

# 148. Phase gates

Each phase has a gate.

## Gate 0

Foundation is safe and organized.

## Gate 1

Product direction is finalized.

## Gate 2

Design system is finalized.

## Gate 3

Architecture is stable.

## Gate 4

Global UI is stable.

## Gate 5

Homepage converts.

## Gate 6

Case studies are credible.

## Gate 7

Services/pricing are clear.

## Gate 8

Booking works.

## Gate 9

Assistant works safely.

## Gate 10

SEO/accessibility pass.

## Gate 11

Performance pass.

## Gate 12

Security pass.

## Gate 13

Production deployment succeeds.

## Gate 14

Production QA passes.

## Gate 15

Launch.

---

# 149. Final product principle

The finished portfolio should feel like:

> **A calm, highly competent engineer opened a small digital studio — and built a website that respects the visitor's time.**

It should communicate:

```text
Clarity
Craft
Technical depth
Product thinking
Reliability
Professionalism
Approachability
```

The website should never communicate:

```text
Noise
Overengineering
Fake authority
Visual gimmicks
Student-project energy
Technology collecting
```

---

# 150. End State

The finished product should allow a first-time visitor to understand within approximately one minute:

1. who Krishna is,
2. what he builds,
3. who he helps,
4. what he has built,
5. how he works,
6. what a project can cost,
7. how to ask questions,
8. how to book a conversation.

The technical system underneath should be:

- organized,
- secure,
- testable,
- content-driven,
- responsive,
- accessible,
- performant,
- observable,
- deployable,
- maintainable,
- and ready to scale beyond the initial freelance use case.

**This blueprint is the source of truth for the project.**
