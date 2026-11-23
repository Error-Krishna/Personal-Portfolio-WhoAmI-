# Error Krishna — Personal Portfolio & Engineering Showcase

[![Production Status](https://img.shields.io/badge/Production-Live-success?style=flat-square&logo=cloudflare)](https://errorkrishna.com)
[![Domain](https://img.shields.io/badge/Domain-errorkrishna.com-blue?style=flat-square)](https://errorkrishna.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.4-EF4444?style=flat-square&logo=turborepo)](https://turbo.build/)
[![Tests](https://img.shields.io/badge/Tests-173%20Passing-brightgreen?style=flat-square&logo=vitest)](https://errorkrishna.com)

**Live Production Website:** [https://errorkrishna.com](https://errorkrishna.com)  
**Alternative Redirection:** [https://www.errorkrishna.com](https://www.errorkrishna.com) → redirects with HTTP 301 to apex domain

---

## 🌟 Overview & Purpose

This repository hosts the official personal portfolio and engineering showcase for **Krishna Goyal** ([@Error-Krishna](https://github.com/Error-Krishna)), a Full-Stack Developer, Computer Science undergraduate at VIT-AP (Class of 2027), and product builder.

The portfolio is engineered to demonstrate real-world full-stack development, modern frontend performance, editorial responsive typography, zero-friction client inquiry workflows, and robust edge deployment.

---

## 🛠 Technology Stack

### Frontend Application (`@portfolio/web`)

- **Framework & Runtime:** [React 18.3](https://react.dev/) with [Vite 6.2](https://vitejs.dev/)
- **Language:** [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/) with custom typography, 3D flip card animations, and persistent dark/light theme
- **Routing:** [React Router 7.2](https://reactrouter.com/) (Single Page Application routing with client-side 404 boundaries)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios 1.7](https://axios-http.com/) with structured error transformers and interceptors
- **Testing:** [Vitest 3.2](https://vitest.dev/), [@testing-library/react 16.2](https://testing-library.com/), and [jsdom 26.0](https://github.com/jsdom/jsdom)

### Production Edge Layer (`worker/`)

- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/) with [Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- **Configuration:** `wrangler.jsonc` deploying assets from `./apps/web/dist`
- **Native Routing:** Single-worker API layer intercepting `/api/v1/health` and `/api/v1/contact`
- **Email Delivery:** Direct integration with [Resend REST API](https://resend.com) for real-time inquiry delivery with HTML formatting

### Alternative Persistent Backend (`@portfolio/api`)

- **Runtime:** Node.js (>= 20.x), [Express 4.21](https://expressjs.com/)
- **Database:** [Mongoose 8.10](https://mongoosejs.com/) with graceful offline/mock fallback
- **Security & Middleware:** [Helmet 8.0](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [express-rate-limit 7.5](https://github.com/express-rate-limit/express-rate-limit), [Morgan](https://github.com/expressjs/morgan)
- **Email Gateway:** Nodemailer 10.2 + Resend HTTP dispatch

### Shared Contracts & Validation (`@portfolio/contracts`)

- **Schema Validation:** [Zod 3.24](https://zod.dev/) shared contracts for contact inquiries, API error envelopes, and health check schemas

### Monorepo & Tooling

- **Package Manager:** `pnpm 11.25.0` (with pnpm workspaces)
- **Task Orchestrator:** `turbo 2.4` (caching typecheck, lint, build, test pipelines)
- **Code Quality:** ESLint 9 (Flat Config with `typescript-eslint 8.73`), Prettier 3.4

---

## 🧭 Monorepo Structure

```
krishna_portfolio/
├── apps/
│   ├── web/                         # React 18 + Vite frontend
│   │   ├── public/                  # Static assets (_headers, robots.txt, sitemap.xml, favicon.svg, images, resume)
│   │   ├── src/
│   │   │   ├── app/                 # App root, router & providers
│   │   │   ├── components/
│   │   │   │   ├── about/           # AboutSection
│   │   │   │   ├── contact/         # ContactSection (Inquiry form & mailto fallback)
│   │   │   │   ├── creative/        # CreativeSection (Visual media showcase)
│   │   │   │   ├── experience/      # ExperienceSection (Timeline)
│   │   │   │   ├── feedback/        # ErrorBoundary, ErrorMessage, LoadingSpinner
│   │   │   │   ├── hero/            # HeroSection & HandwrittenAnnotations
│   │   │   │   ├── layout/          # DynamicIsland, Footer, RootLayout
│   │   │   │   ├── navigation/      # CornerNavigationDial (Quarter-circle dial)
│   │   │   │   ├── process/         # HowIWorkSection (4-step delivery process)
│   │   │   │   ├── projects/        # ProjectsSection, ProjectCard (3D flip), VideoShowcase
│   │   │   │   ├── services/        # ServicesSection & ServicePricingCards
│   │   │   │   ├── skills/          # SkillsSection & TechStackTower
│   │   │   │   ├── testimonials/    # TestimonialsSection (3D tilt cards)
│   │   │   │   ├── transition/      # ScrollPortraitTransition (Dual portrait 3D transition)
│   │   │   │   └── ui/              # Button, Card, ChromeStar
│   │   │   ├── content/             # Mirrored site_config.json
│   │   │   ├── context/             # ThemeContext (dark/light mode)
│   │   │   ├── lib/                 # API client, site config helpers, cn utility
│   │   │   ├── pages/               # HomePage, ProjectDetailPage, ResumePage, NotFoundPage
│   │   │   └── styles/              # globals.css, Tailwind directives, animations
│   │   ├── tests/                   # Component and unit test suites
│   │   └── vite.config.ts
│   │
│   └── api/                         # Express API backend
│       ├── src/
│       │   ├── app.ts               # Express application pipeline
│       │   ├── server.ts            # Standalone server with DB lifecycle
│       │   ├── modules/             # contact, health
│       │   └── common/              # errors, middleware, utils
│       └── package.json
│
├── packages/
│   ├── contracts/                   # Shared TypeScript DTOs and Zod schemas
│   ├── eslint-config/               # Shared ESLint 9 + typescript-eslint flat config
│   └── typescript-config/           # Base tsconfig presets
│
├── worker/                          # Cloudflare Worker router (index.ts) & worker.test.ts
├── content/                         # Canonical site_config.json
├── tests/                           # Root E2E and production live verification suites
├── scripts/                         # sync-config.mjs, check-env.mjs, clean.mjs
├── wrangler.jsonc                   # Cloudflare Workers configuration
├── turbo.json                       # Turborepo task pipeline
└── package.json                     # Monorepo scripts and devDependencies
```

---

## 🚀 Key Features

1. **Global Dynamic Island:** Floating top capsule with live availability indicator, current local time, location, theme toggle, and tap-to-expand social profiles.
2. **Interactive Quarter-Circle Navigation Dial:** High-precision corner compass dial at bottom-right supporting hover, touch scrub, and instantaneous smooth section hopping.
3. **Hero & Scroll-Driven Portrait Transition:** Dual portrait alignment transitioning seamlessly between Hero and About sections during page scroll.
4. **Interactive 3D Flip Project Cards:** Desktop hover flip and mobile tap-to-flip previews showing project category, role, and key deliverables.
5. **Detailed Project Case Studies (`/work/:slug`):** Dedicated deep-dive routes with problem statements, architectural components, impact metrics, and outbound links.
6. **Transparent Services & Pricing Section:** Clear pricing tiers starting at $500 with feature comparison tables and one-click contact form prefill.
7. **Production Contact Inquiry Pipeline:** Dual-mode inquiry delivery powered by Cloudflare Worker + Resend API with client-side mailto fallback.
8. **Dark / Light Theme System:** Persistent theme selection with instant local storage synchronization and smooth CSS transitions.
9. **Interactive Resume Page (`/resume`):** Online resume and one-click download of the verified PDF resume.
10. **SEO & Social Share Ready:** Complete Open Graph, Twitter Cards, canonical URL tags, `robots.txt`, and XML `sitemap.xml`.

---

## ⚡ Quick Start & Local Development

### Prerequisites

- **Node.js:** `>= 20.0.0`
- **pnpm:** `>= 9.0.0` (Recommended: `11.x`)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Error-Krishna/krishna_portfolio.git
cd krishna_portfolio

# Install all monorepo dependencies
pnpm install
```

### 2. Environment Configuration

```bash
# Verify environment and generate .env template
pnpm run check-env

# Optionally configure your Resend API key in .env or Cloudflare Worker
```

### 3. Start Development Server

```bash
pnpm run dev
```

- Frontend application runs at: `http://localhost:5173`
- Backend API (optional persistent server) runs at: `http://localhost:5001/api/v1`

---

## 🧪 Testing Infrastructure

The project includes an extensive **173-test suite** covering unit, component, schema, worker, and live production verification.

```bash
# Run all tests across monorepo packages (Contracts, API, Web)
pnpm test

# Run unit and component tests specifically
pnpm run test:unit

# Run root E2E and Live Production Verification tests
pnpm run test:e2e

# Run test coverage
pnpm run test:coverage
```

### Test Coverage Breakdown

| Test Suite                | File Location                              |  Tests  |      Status      |
| :------------------------ | :----------------------------------------- | :-----: | :--------------: |
| **Contracts Schemas**     | `packages/contracts/src/contracts.test.ts` |    8    |    ✅ Passing    |
| **Backend API**           | `apps/api/src/**/*.test.ts`                |    9    |    ✅ Passing    |
| **Frontend Web**          | `apps/web/tests/**/*.test.tsx`             |   130   |    ✅ Passing    |
| **Cloudflare Worker**     | `worker/worker.test.ts`                    |    9    |    ✅ Passing    |
| **Root E2E & Production** | `tests/e2e/portfolio.spec.ts`              |   17    |    ✅ Passing    |
| **Total Automated Tests** |                                            | **173** | **100% Passing** |

---

## 📦 Build & Code Quality

```bash
# Typecheck entire monorepo with TypeScript
pnpm run typecheck

# Lint with ESLint 9 (flat config)
pnpm run lint

# Format code with Prettier
pnpm run format

# Verify formatting without writing
pnpm run format:check

# Production build for all packages and web static bundle
pnpm run build
```

---

## 🌐 Production Deployment

The website is actively deployed and hosted on **Cloudflare Workers with Static Assets**:

- **Domain:** `https://errorkrishna.com`
- **DNS & CDN:** Cloudflare (Domain registered via Hostinger)
- **Worker Configuration:** `wrangler.jsonc`
- **Build Output:** `apps/web/dist`

For full architecture details, deployment runbooks, and rollback procedures, consult:

- [DEPLOYMENT.md](file:///Users/krishnagoyal/Development/personal%20projects/krishna_portfolio/DEPLOYMENT.md)
- [ARCHITECTURE.md](file:///Users/krishnagoyal/Development/personal%20projects/krishna_portfolio/docs/architecture.md)
- [TESTING.md](file:///Users/krishnagoyal/Development/personal%20projects/krishna_portfolio/docs/testing.md)

---

## 📄 License

Copyright © 2024–2026 Krishna Goyal. All rights reserved.
