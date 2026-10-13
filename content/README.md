# Krishna Goyal Portfolio — Content & Site Configuration Guide

This portfolio uses a **Single Source of Truth** architecture powered by `content/site_config.json`. All personal information, social links, project case studies, service packages, pricing, skills, and section visibility can be configured directly in this file without modifying application source code.

---

## 📁 File Locations

- **Master Configuration:** `content/site_config.json`
- **Web App Mirror:** `apps/web/src/content/site_config.json`
- **TypeScript Accessor & Validation Layer:** `apps/web/src/lib/config/site-config.ts`

---

## 🛠 How to Update Content

### 1. Personal Information & Bio

In the `"personal"` section of `content/site_config.json`:

```json
"personal": {
  "name": "Krishna Goyal",
  "displayName": "KRISHNA GOYAL",
  "title": "Full-Stack Developer & Product Builder",
  "headline": "I build things people can use.",
  "location": "Amaravati, India",
  "graduationYear": 2027,
  "email": "iamkrishnagoyal@gmail.com",
  "availability": "open_to_freelance",
  "availabilityLabel": "OPEN TO FREELANCE PROJECTS",
  "shortBio": "Final year Computer Science student at VIT-AP, focused on building real-world products...",
  "timezone": "Asia/Kolkata",
  "responseTime": "Within 24 hours"
}
```

### 2. Social Links & External Profiles

In the `"links"` section:

```json
"links": {
  "github": "https://github.com/Error-Krishna",
  "linkedin": "https://linkedin.com/in/krishna2611",
  "email": "mailto:iamkrishnagoyal@gmail.com",
  "phone": "tel:+919064700906",
  "resume": "/resume/krishna-goyal-resume.pdf",
  "portfolio": "https://personal-portfolio-whoami-1.onrender.com",
  "twitter": "https://x.com/yourusername",
  "youtube": ""
}
```

_Note:_ If any social URL is empty `""`, the interface gracefully omits that platform. No broken links are rendered.

### 3. Portraits, Resume & Images

In the `"assets"` section:

```json
"assets": {
  "heroPortrait": "/images/image-removebg-preview.png",
  "aboutPortrait": "/images/about-portrait-red.png",
  "contactPortrait": "/images/about-portrait-red.png",
  "resume": "/resume/krishna-goyal-resume.pdf",
  "ogImage": "/images/about-portrait-red.png"
}
```

To update an image, place your new asset in `apps/web/public/images/` and update the relative path here.

---

### 4. Services & Indicative Pricing

#### Changing Currency or General Pricing Rules

```json
"pricing": {
  "currency": "USD",
  "displayCurrency": "USD",
  "showPricing": true,
  "showHourlyRate": false,
  "hourlyRate": null,
  "minimumProjectBudget": 500,
  "customQuoteLabel": "Request a Quote"
}
```

#### Adding or Updating a Service Package

In `"services"`:

```json
{
  "id": "landing-page",
  "title": "Landing Page Development",
  "shortDescription": "High-conversion responsive landing page with custom branding and animations.",
  "category": "Frontend & Web",
  "visible": true,
  "startingPrice": 650,
  "currency": "USD",
  "pricingModel": "starting_at",
  "deliverables": [
    "Responsive React & Tailwind implementation",
    "Interactive UI states and animations",
    "SEO metadata and performance optimization",
    "Deployment to Vercel/Render"
  ],
  "exclusions": ["Copywriting and brand identity design"],
  "estimatedDelivery": "1–2 weeks",
  "revisionAllowance": 2,
  "supportPeriod": "14 days post-launch",
  "featured": false,
  "ctaLabel": "Discuss Landing Page",
  "ctaDestination": "#contact"
}
```

_Note on Pricing Fallbacks:_ If `startingPrice` is set to `null`, the website displays the configured `customQuoteLabel` (e.g., `"Request a Quote"`). It will **never** display `$0` or `NaN`.

---

### 5. Projects & Case Studies

All portfolio projects are dynamically driven by the `projects` array in `content/site_config.json`. The Project Index grid, interactive 3D flip cards, reusable Project Detail pages, and cross-project navigation all read directly from this single source of truth.

#### Supported Project Schema Fields

```json
{
  "id": "project-identifier",
  "slug": "url-friendly-slug",
  "title": "Display Title",
  "subtitle": "Secondary Title / One-Liner",
  "shortDescription": "Concise summary displayed on the card front and detail hero.",
  "cardDescription": "Bold 1-2 line statement revealed on the reverse side of the 3D flip card.",
  "category": "SAAS & PRODUCTS",
  "status": "Active Development | Shipped | Live",
  "featured": true,
  "technologies": ["React", "TypeScript", "Node.js"],
  "thumbnail": "/images/project-thumb.png",
  "heroImage": "/images/project-hero.png",
  "video": {
    "url": "https://example.com/walkthrough.mp4",
    "duration": "2:15",
    "poster": "/images/project-hero.png"
  },
  "accentColor": "#991b1b",
  "displayOrder": 1,
  "published": true,
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/Error-Krishna/example",
  "demoUrl": "https://loom.com/share/...",
  "role": "Co-founder & Full-Stack Developer",
  "date": "2024 - Present",
  "overview": "Detailed project narrative and problem context.",
  "problem": "Specific operational or engineering bottleneck addressed.",
  "solution": "Technical solution, architecture, and workflows implemented.",
  "features": ["Feature item 1", "Feature item 2"],
  "stats": [
    { "label": "Core Modules", "value": "5+" },
    { "label": "In-House Build", "value": "100%" },
    { "label": "In Production", "value": "Live" }
  ],
  "architecture": {
    "description": "High-level description of system components and communication pipelines.",
    "diagramUrl": "/images/architecture-diagram.png",
    "components": ["React SPA", "Express API", "MongoDB", "WebSocket Gateway"]
  },
  "myContribution": "Concrete personal engineering ownership and implementation details.",
  "outcomes": [
    "Measurable impact or verified operational result 1",
    "Measurable impact or verified operational result 2"
  ],
  "relatedProjects": ["slug-1", "slug-2", "slug-3", "slug-4"]
}
```

#### How-To Guide for Managing Projects

1. **Where Project Data Lives:**
   - Canonical file: `content/site_config.json`
   - Web application mirror: `apps/web/src/content/site_config.json`

2. **How to Add a New Project:**
   - Add a new JSON object to the `"projects"` array in `content/site_config.json`.
   - Provide a unique URL-safe `slug` (e.g. `"my-new-app"`).
   - The project automatically appears in the desktop 2-column grid and dynamically registers routes `/work/my-new-app` and `/project/my-new-app`.
   - No React code edits are required!

3. **How to Add Thumbnails & Hero Images:**
   - Place image assets in `apps/web/public/images/` (e.g. `apps/web/public/images/my-app-thumb.png`).
   - Reference them with leading slash: `"thumbnail": "/images/my-app-thumb.png"`, `"heroImage": "/images/my-app-hero.png"`.
   - If omitted, the project automatically displays a polished minimal typographic/UI fallback matching its accent color.

4. **How to Add Product Walkthrough Videos Later:**
   - Video can be either a direct URL string or an object with metadata:
     ```json
     "video": {
       "url": "https://assets.example.com/demo.mp4",
       "duration": "1:45",
       "poster": "/images/my-app-poster.png"
     }
     ```
   - When `video` is empty or omitted, the page renders a polished video showcase placeholder with play button and "PRODUCT WALKTHROUGH COMING SOON" badge.
   - When a valid video URL is added, the video player activates without layout shifts.

5. **How to Add Case Study Sections:**
   - Sections (Overview, Features, Architecture, My Role, Outcomes) render dynamically only when content is provided.
   - If an optional section like `architecture` or `outcomes` is omitted, the template cleanly omits that section and its tab.

6. **How to Change Project Order:**
   - Modify the `"displayOrder"` integer (e.g., `1`, `2`, `3`). Projects are sorted ascending by `displayOrder`.
   - The 2-column grid and next/previous project navigation update automatically.

7. **How to Publish or Unpublish a Project:**
   - Set `"published": false` on any project.
   - Unpublished projects are automatically filtered out from the public index grid, other-project navigation rows, and direct URLs (safely rendering 404).
   - Set `"published": true` to republish.

8. **How to Remove a Project:**
   - Delete the project object from the `"projects"` array.

9. **How to Synchronize Configuration:**
   - Run:
     ```bash
     cp content/site_config.json apps/web/src/content/site_config.json
     ```
   - In development mode, Vite will hot-reload the changes immediately.

---

### 6. Skills & Technology Stack

In `"skills"`, entries are categorized into `FRONTEND`, `BACKEND`, `DATABASES`, `TOOLS`, and `CREATIVE`:

```json
{
  "name": "Next.js",
  "category": "FRONTEND",
  "icon": "Layers",
  "description": "Server-side rendering, App Router, and static site generation."
}
```

---

### 7. Experience / Journey Timeline

In `"experience"`:

```json
{
  "period": "2024 — PRESENT",
  "organization": "Udhyog Saathi",
  "role": "Co-Founder & Product Developer",
  "category": "Product & Engineering",
  "description": "Building a SaaS business operating system for small and mid-sized manufacturing enterprises.",
  "link": "https://udhyogsaathi.in/"
}
```

---

### 8. Testimonials & Client Feedback

In `"testimonials"`:

```json
{
  "id": "testimonial-01",
  "published": true,
  "clientName": "Client Partner",
  "clientRole": "Product Lead",
  "companyName": "Udhyog Saathi",
  "productName": "Manufacturing OS",
  "testimonial": "Working with Krishna was seamless from initial discovery to final deployment.",
  "profileImage": "",
  "companyLogo": ""
}
```

---

### 9. Section Visibility

To show or hide entire sections on the homepage without editing component code:

```json
"sectionVisibility": {
  "hero": true,
  "about": true,
  "skills": true,
  "projects": true,
  "testimonials": true,
  "services": true,
  "experience": true,
  "creative": true,
  "trust": true,
  "contact": true,
  "footer": true
}
```

---

### 9. Synchronizing Changes

After updating `content/site_config.json`, sync it to the web application:

```bash
cp content/site_config.json apps/web/src/content/site_config.json
```

Vite will hot-reload the changes instantly in development mode!
