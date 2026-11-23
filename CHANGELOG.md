# Changelog

All notable changes, bug fixes, testing additions, and documentation updates made to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased] - 2026-11-24

### Added

- **Cloudflare Worker Unit Tests (`worker/worker.test.ts`):** 9 comprehensive automated tests verifying CORS preflight OPTIONS, `/api/v1/health` and `/api/health` endpoints, `/api/v1/contact` body validation, Resend API email dispatch mocks, and static asset delegation to `env.ASSETS`.
- **Contracts Schema Tests (`packages/contracts/src/contracts.test.ts`):** 8 automated tests verifying Zod schema parsing, required field assertions, validation error messages, and response envelope typing.
- **Root End-to-End & Live Production Verification (`tests/e2e/portfolio.spec.ts`):** 17 automated tests running directly against `https://errorkrishna.com` to verify live homepage HTML delivery, direct route hydration (`/resume`, `/work/*`), API health, contact form validation, downloadable PDF resume, and image asset MIME types.
- **Root Vitest & Coverage Configuration (`vitest.config.ts`):** Installed and configured `@vitest/coverage-v8` for monorepo and edge testing.
- **Branded Vector Favicon (`apps/web/public/favicon.svg`):** High-resolution SVG favicon featuring the Error Krishna `>EK_` terminal aesthetic with a glowing red indicator dot.
- **Search Engine Discovery Assets:**
  - `apps/web/public/robots.txt`: Explicit crawl permissions and sitemap link.
  - `apps/web/public/sitemap.xml`: Complete XML sitemap listing home, resume, and all 12 project case study URLs with change frequencies and priorities.
- **Security & Caching Headers (`apps/web/public/_headers`):** Deployed for Cloudflare Static Assets, declaring `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and immutable 1-year caching for `/assets/*`.
- **SEO & Social Share Metadata (`apps/web/index.html`):** Added Open Graph tags, Twitter / X summary card tags, canonical link tag (`https://errorkrishna.com/`), and Schema.org `Person` and `WebSite` JSON-LD structured data.
- **New Package Scripts (`package.json`):** Added `test:unit`, `test:e2e`, and `test:coverage` commands to package manifests.
- **System Architecture & Testing Documentation:** Authored root `ARCHITECTURE.md` and `TESTING.md` with system topology and test breakdowns.

### Changed

- **ESLint 9 & TypeScript-ESLint Tooling:** Upgraded and configured ESLint 9 Flat Config with `typescript-eslint 8.73` in `packages/eslint-config`, resolving `sh: eslint: command not found` and enabling type-aware linting with zero errors across the monorepo.
- **Cloudflare Worker Response Headers (`worker/index.ts`):** Injected security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) on all API responses.
- **Canonical Site Configuration (`content/site_config.json`):** Updated portfolio link from obsolete Render URL to canonical production domain `https://errorkrishna.com`.
- **Prettier Code Formatting:** Fixed formatting across 42 files, bringing the monorepo into 100% compliance with `pnpm run format:check`.
- **Deployment Documentation (`DEPLOYMENT.md`):** Updated guide to accurately reflect the active live deployment on Cloudflare Workers with Static Assets.
- **README Documentation (`README.md`):** Replaced obsolete starter template with complete project overview, live links, test tables, and runbooks.

### Fixed

- **P1: Broken Lint Command:** Fixed missing `eslint` dependency and TypeScript syntax parsing errors in ESLint flat config.
- **P1: Missing Favicon:** Fixed 404 / HTML fallback on `/vite.svg` by creating and referencing `/favicon.svg`.
- **P1: Missing SEO Discovery:** Fixed crawlers receiving SPA HTML when requesting `/robots.txt` and `/sitemap.xml`.
- **P2: Empty E2E Test Placeholder:** Replaced empty stub `tests/e2e/portfolio.spec.ts` with a comprehensive 17-test verification suite.
