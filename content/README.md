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
*Note:* If any social URL is empty `""`, the interface gracefully omits that platform. No broken links are rendered.

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
  "exclusions": [
    "Copywriting and brand identity design"
  ],
  "estimatedDelivery": "1–2 weeks",
  "revisionAllowance": 2,
  "supportPeriod": "14 days post-launch",
  "featured": false,
  "ctaLabel": "Discuss Landing Page",
  "ctaDestination": "#contact"
}
```
*Note on Pricing Fallbacks:* If `startingPrice` is set to `null`, the website displays the configured `customQuoteLabel` (e.g., `"Request a Quote"`). It will **never** display `$0` or `NaN`.

---

### 5. Projects & Case Studies
In `"projects"`, add or edit project records:
```json
{
  "id": "new-saas-tool",
  "slug": "new-saas-tool",
  "title": "New SaaS Tool",
  "subtitle": "Workflow Management Platform",
  "shortDescription": "A web application solving operational bottlenecks...",
  "category": "SAAS & PRODUCTS",
  "status": "Active Development",
  "featured": true,
  "technologies": ["React", "TypeScript", "Node.js", "PostgreSQL"],
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/Error-Krishna/example",
  "role": "Full-Stack Developer",
  "date": "2025",
  "overview": "Detailed overview of the project...",
  "problem": "The problem being solved...",
  "solution": "The technical solution implemented...",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "myContribution": "Specific architectural and implementation details..."
}
```
Canonical detail routes are accessible at `/work/:slug` and `/project/:slug`.

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

### 8. Section Visibility
To show or hide entire sections on the homepage without editing component code:
```json
"sectionVisibility": {
  "hero": true,
  "about": true,
  "skills": true,
  "projects": true,
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
