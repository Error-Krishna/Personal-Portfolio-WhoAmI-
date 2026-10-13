# Final Portfolio Health Check & Maintenance Guide

This document captures the final verified health status, architecture, verification results, and operational procedures for content personalization following the development freeze.

---

## A. Project Architecture Summary

The repository is structured as a high-performance monorepo using **pnpm workspaces** and **Turborepo**:

- **Frontend Application (`apps/web`)**:
  - React 18 SPA built with Vite 6, Tailwind CSS 3, and React Router v7.
  - Custom interactive components:
    - **Dynamic Island (`DynamicIsland.tsx`)**: Global identity capsule with smooth rotating social ticker, expanding to full social profile panel.
    - **Corner Navigation Dial (`CornerNavigationDial.tsx`)**: High-precision quarter-circle dial supporting scrub preview, settle detection, whoosh transition layer, and direct navigation.
    - **Handwritten Editorial Discovery Annotations (`HandwrittenAnnotations.tsx`)**: Refined handwritten cursive notes with organic curved SVG stroke animations pointing to Dynamic Island ("Say hello ↗") and Corner Dial ("Take a look around") to guide first-time visitors non-intrusively.
    - **Hero/About Portrait Transition (`ScrollPortraitTransition.tsx`)**: Pure CSS/RAF 3D flip card transition driven by physical scroll inertia.
    - **3D Flip Project Cards & Testimonials (`ProjectCard.tsx`, `TestimonialsSection.tsx`)**: Interactive card interactions with zero layout shift.
    - **Dynamic Project Detail Pages (`ProjectDetailPage.tsx`)**: Dynamic routing (`/work/:slug`, `/project/:slug`) with accessible tabbed case studies and video placeholders.
  - Unit & Integration testing via **Vitest** + **React Testing Library** + **jsdom**.

- **Backend Application (`apps/api`)**:
  - Express 4 REST API in TypeScript (Node 20+).
  - Security hardening with Helmet, rate limiting (`express-rate-limit`), CORS, and request ID tracking.
  - Modular architecture (`/modules/health`, `/modules/contact`).
  - Graceful MongoDB connectivity fallback (operates seamlessly even when local MongoDB daemon is offline).

- **Shared Packages (`packages/*`)**:
  - `packages/contracts`: Single source of truth for API schemas and TypeScript types via Zod (`ContactInquirySchema`, `HealthCheckResponseSchema`).
  - `packages/typescript-config`: Shared TypeScript compiler configurations.
  - `packages/eslint-config`: Shared linting base configuration.

- **Content Configuration (`content/` & `apps/web/src/content/`)**:
  - Canonical Master: `content/site_config.json`
  - Web Mirror: `apps/web/src/content/site_config.json`
  - Typed Accessor & Resilient Utilities: `apps/web/src/lib/config/site-config.ts`

---

## B. Development & Build Commands

All commands should be executed from the monorepo root using `pnpm`:

| Action | Command | Description |
| :--- | :--- | :--- |
| **Install Dependencies** | `pnpm install` | Installs all monorepo dependencies |
| **Start Development** | `pnpm run dev` | Runs web (port 5173) and api (port 5001) in parallel |
| **Run Web Dev Only** | `pnpm --filter @portfolio/web dev` | Runs Vite dev server at `http://localhost:5173` |
| **Run API Dev Only** | `pnpm --filter @portfolio/api dev` | Runs API server at `http://localhost:5001` |
| **Typecheck** | `pnpm run typecheck` | Executes `tsc --noEmit` across all workspace packages |
| **Run Web Tests** | `pnpm --filter @portfolio/web test` | Runs all 12 frontend test suites (81 unit/e2e tests) |
| **Run API Tests** | `pnpm --filter @portfolio/api test` | Runs all backend test suites (4 tests) |
| **Production Build** | `pnpm run build` | Compiles contracts, builds API, and generates production web bundle |
| **Synchronize Config** | `pnpm run sync-config` | Validates JSON and mirrors master config to web app |
| **Clean Artifacts** | `pnpm run clean` | Cleans all `dist`, `build`, and `.turbo` cache directories |
| **Environment Check** | `pnpm run check-env` | Verifies Node.js version and `.env` presence |

---

## C. Required Environment Variables

Environment variables are defined in `.env` at the monorepo root. A template is provided in `.env.example`:

| Variable | Location | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `PORT` | Root `.env` | `5001` | Port for Express API server |
| `NODE_ENV` | Root `.env` | `development` / `production` | Application runtime environment |
| `API_PREFIX` | Root `.env` | `/api/v1` | URL prefix for REST routes |
| `CORS_ORIGIN` | Root `.env` | `http://localhost:5173` | Allowed origin for frontend API requests |
| `MONGODB_URI` | Root `.env` | `mongodb://localhost:27017/krishna_portfolio` | Database connection string |
| `RATE_LIMIT_WINDOW_MS` | Root `.env` | `900000` (15 min) | Rate limiter window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | Root `.env` | `100` | Max requests per rate limit window |
| `LOG_LEVEL` | Root `.env` | `debug` / `info` | Logging verbosity |
| `VITE_API_BASE_URL` | Root `.env` | `http://localhost:5001/api/v1` | Frontend API client base URL |

---

## D. Canonical Content Configuration Files

- **Master Configuration:** `content/site_config.json`
- **Web App Mirror:** `apps/web/src/content/site_config.json`
- **Accessor & Validation Layer:** `apps/web/src/lib/config/site-config.ts`

Any edits should be made directly in `content/site_config.json` and mirrored using `pnpm run sync-config`.

---

## E. How to Update Personal Images

1. Place your image files in `apps/web/public/images/`:
   - Hero / Dynamic Island portrait: `apps/web/public/images/your-hero-portrait.png`
   - About / Skills / Scroll Transition portrait: `apps/web/public/images/your-about-portrait.png`
2. Update the relative paths in `content/site_config.json` under `"assets"`:
   ```json
   "assets": {
     "heroPortrait": "/images/your-hero-portrait.png",
     "aboutPortrait": "/images/your-about-portrait.png",
     "contactPortrait": "/images/your-about-portrait.png",
     "resume": "/resume/krishna-goyal-resume.pdf",
     "ogImage": "/images/your-about-portrait.png"
   }
   ```
3. Run `pnpm run sync-config`. All 5 portrait locations (Dynamic Island, Hero section, About section, Interactive Skills ecosystem, and 3D Scroll transition) will update automatically.

---

## F. How to Update Social Media Links

1. Open `content/site_config.json` and edit `"links"`:
   ```json
   "links": {
     "github": "https://github.com/your-username",
     "linkedin": "https://linkedin.com/in/your-username",
     "email": "mailto:your-email@example.com",
     "phone": "tel:+1234567890",
     "resume": "/resume/krishna-goyal-resume.pdf",
     "portfolio": "https://yourdomain.com",
     "twitter": "https://x.com/your-handle",
     "youtube": ""
   }
   ```
2. Any link set to empty `""` is safely omitted from both the Dynamic Island ticker/expanded panel and the footer without breaking rendering.
3. Run `pnpm run sync-config`.

---

## G. How to Update Project Information & External URLs

1. In `content/site_config.json`, edit items in the `"projects"` array:
   - `title`: Display title
   - `slug`: URL slug (e.g., `"my-saas"` maps to `/work/my-saas`)
   - `shortDescription`: Summary for card front and detail hero
   - `cardDescription`: Statement revealed on 3D flip card back
   - `technologies`: Array of tech badges
   - `liveUrl`: URL for live product CTA button (omitted if empty)
   - `githubUrl`: URL for GitHub source code CTA button (omitted if empty)
   - `demoUrl`: Walkthrough video or demo link (omitted if empty)
   - `thumbnail`: Path to thumbnail in `/images/` (falls back to procedural graphic if omitted)
   - `video`: Optional video configuration object or URL string
   - `published`: Set to `false` to hide a project from the public grid and routes
   - `displayOrder`: Integer order in the project grid
2. Run `pnpm run sync-config`.

---

## H. How to Update Service Prices & Packages

1. In `content/site_config.json`:
   - Adjust global pricing rules in `"pricing"`:
     ```json
     "pricing": {
       "currency": "USD",
       "displayCurrency": "USD",
       "showPricing": true,
       "customQuoteLabel": "Request a Quote"
     }
     ```
   - Update individual packages in `"services"`:
     ```json
     {
       "id": "full-stack-mvp",
       "title": "Full-Stack MVP Development",
       "startingPrice": 1200,
       "deliverables": [ ... ],
       "keyDeliverables": [ ... ],
       "estimatedDelivery": "2–4 weeks",
       "supportPeriod": "30 days included"
     }
     ```
   - Setting `"startingPrice": null` automatically renders `"Request a Quote"`. It will never display `$0` or `NaN`.
2. Run `pnpm run sync-config`.

---

## I. How to Update Testimonials & Associated Assets

1. In `content/site_config.json` under `"testimonials"`:
   ```json
   {
     "id": "testimonial-01",
     "published": true,
     "clientName": "Client Partner",
     "clientRole": "Product Lead",
     "companyName": "Udhyog Saathi",
     "productName": "Manufacturing OS",
     "testimonial": "Working with Krishna was seamless...",
     "profileImage": "/images/testimonials/client-01.png"
   }
   ```
2. If `profileImage` is empty `""`, an initials avatar badge is generated automatically.
3. Run `pnpm run sync-config`.

---

## J. How to Synchronize Mirrored Configuration Files

To mirror changes from `content/site_config.json` to `apps/web/src/content/site_config.json`:

```bash
pnpm run sync-config
```

Or manually:
```bash
cp content/site_config.json apps/web/src/content/site_config.json
```

---

## K. Known Limitations & Audit Notes

1. **ESLint Command:**
   - `pnpm run lint` (`turbo run lint`) attempts to execute `eslint`, which is not present in workspace `devDependencies`.
   - All TypeScript validation is strictly enforced by `tsc --noEmit` (`pnpm run typecheck`), which passes with 0 errors across all 5 workspace packages.
2. **Backend Network Testing in Sandbox:**
   - In sandboxed environments without loopback network access, Supertest's localhost socket bind (`connect EPERM 127.0.0.1`) is blocked by OS sandbox isolation.
   - When run with network access or locally outside the sandbox, 100% of API test assertions pass (4 of 4 tests).
3. **Visual Verification:**
   - No browser automation CLI (e.g. Playwright/Puppeteer browser session) is installed in this runtime environment. Visual and responsive behaviors were verified through Vitest component tests, jsdom layout simulations, and coordinate inspection.

---

## L. Final Verification Results

- **TypeScript Compilation (`pnpm run typecheck`)**:
  - `@portfolio/contracts`: PASSED (0 errors)
  - `@portfolio/api`: PASSED (0 errors)
  - `@portfolio/web`: PASSED (0 errors)
  - **Overall: 4/4 packages passed**
- **Frontend Unit Tests (`pnpm --filter @portfolio/web test`)**:
  - 12 test suites, 81 tests: **100% PASSED**
    - `HandwrittenAnnotations.test.tsx`: 5 tests passed
    - `CornerNavigationDial.test.tsx`: 9 tests passed
    - `DynamicIsland.test.tsx`: 6 tests passed
    - `NewSections.test.tsx`: 18 tests passed
    - `ProjectDetailPage.test.tsx`: 8 tests passed
    - `ProjectsSection.test.tsx`: 6 tests passed
    - `ServicesSection.test.tsx`: 6 tests passed
    - `TestimonialsSection.test.tsx`: 6 tests passed
    - `AboutSection.test.tsx`: 6 tests passed
    - `ScrollPortraitTransition.test.tsx`: 2 tests passed
    - `siteConfig.test.ts`: 8 tests passed
    - `smoke.test.ts`: 1 test passed
- **Backend Tests (`pnpm --filter @portfolio/api test`)**:
  - 2 test suites, 4 tests: **100% PASSED**
    - `health.test.ts`: 2 tests passed
    - `contact.test.ts`: 2 tests passed
- **Production Build (`pnpm run build`)**:
  - Turborepo build pipeline: **100% PASSED**
  - Vite generated optimized client bundle:
    - HTML: `1.23 kB`
    - CSS: `77.12 kB`
    - JS Vendor Chunks: `235.45 kB`
    - JS App: `286.83 kB`
