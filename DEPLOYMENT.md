# Production Deployment Guide: Vercel & Multi-Platform Architecture

**Target Platform:** Vercel  
**Application:** Krishna Goyal Personal Portfolio & Engineering Showcase  
**Repository Architecture:** Turborepo pnpm Monorepo  
**Packages:** `@portfolio/web` (React/Vite), `@portfolio/api` (Express), `@portfolio/contracts` (TypeScript/Zod)  
**Status:** **READY TO DEPLOY**  

---

## A. Deployment Architecture and Rationale

This monorepo supports two proven deployment architectures. Both preserve 100% of the existing frontend animations, Dynamic Island, Navigation Dial, case study tabs, responsive styling, and contact form workflows.

### Primary Recommended Architecture: Option A (Unified Single Vercel Project)
Deploy the frontend static bundle and the serverless Express API handler together inside a single Vercel project.
- **Frontend:** Built by Vite into `apps/web/dist`, served globally via Vercel’s Edge Network CDN.
- **Backend API:** Adapted via `api/index.ts` to run as an auto-scaling Node.js Serverless Function handling all `/api/v1/*` requests.
- **Why this fits best:**
  1. **Same-Origin Networking:** The frontend makes relative calls to `/api/v1/contact`. Zero CORS preflight latency, zero cross-origin cookie/header issues.
  2. **Single Pipeline:** One Git commit triggers an atomic deployment for both frontend and backend.
  3. **Zero Maintenance:** Serverless functions scale to zero when idle with zero host maintenance.
  4. **Cost Efficiency:** Operates completely within Vercel's free hobby tier.

### Supported Alternative Architecture: Option C (Decoupled Vercel + Dedicated Host)
Deploy the frontend on Vercel Edge CDN and host the Express API on a persistent container platform (Render, Railway, Fly.io, or VPS).
- **Frontend:** Hosted on Vercel (`apps/web/dist`).
- **Backend API:** Runs as a persistent Node.js process (`pnpm --filter @portfolio/api start` executing `node dist/server.js`) on Render or Railway.
- **Why choose this alternative:**
  1. **Persistent Database Pooling:** Maintains an active MongoDB connection pool with zero serverless cold-start connection latency.
  2. **Stateful Services:** Ideal if adding long-running background tasks, WebSocket telemetry, or persistent rate-limiting buckets in the future.
  3. **Already Configured:** `apps/api/src/server.ts` and `docker/api/Dockerfile` are already built and tested for this mode. The frontend seamlessly connects by providing `VITE_API_BASE_URL`.

---

## B. Prerequisites

1. **Local Tooling:**
   - Node.js: `v20.0.0` or higher (`v24.19.0` recommended)
   - Package Manager: `pnpm` `v9.0.0` or higher (`v11.25.0` recommended)
   - Git: `v2.30+`
2. **Platform Accounts:**
   - [Vercel Account](https://vercel.com) (connected to your GitHub account)
   - [GitHub Repository](https://github.com/Error-Krishna/krishna_portfolio) with access to `main` branch
3. **Optional External Services:**
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier cluster for inquiry persistence; optional because the API runs in offline/in-memory mode if omitted)
   - Custom Domain registrar (e.g. Namecheap, Cloudflare, Google Domains) if attaching a personal domain

---

## C. Repository Structure Relevant to Deployment

```
krishna_portfolio/
├── api/
│   └── index.ts                 # Vercel Serverless Function entry point (Option A)
├── apps/
│   ├── api/                     # Standalone Express 4 application
│   │   ├── dist/                # Compiled JavaScript output (tsc)
│   │   ├── src/
│   │   │   ├── app.ts           # Express factory & middleware pipeline
│   │   │   ├── server.ts        # Standalone HTTP server bootstrap (Option C)
│   │   │   ├── config/          # Environment, logger, MongoDB connection
│   │   │   └── modules/         # Health & Contact controllers and routes
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                     # React 18 + Vite frontend
│       ├── dist/                # Production build output directory (HTML, CSS, JS, assets)
│       ├── public/              # Static assets (images, PDF resume, icons)
│       │   ├── images/          # Profile portraits & hero background
│       │   └── resume/          # krishna-goyal-resume.pdf
│       ├── src/                 # React application source code
│       ├── index.html           # Single Page Application HTML shell
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts       # Vite bundler configuration & manual chunks
├── packages/
│   ├── contracts/               # Shared TypeScript types, schemas, and DTOs
│   ├── eslint-config/           # Shared lint rules
│   └── typescript-config/       # Base tsconfig presets
├── .env.example                 # Template for required environment variables
├── package.json                 # Monorepo root manifest (scripts, engines)
├── pnpm-workspace.yaml          # Workspace package registry
├── turbo.json                   # Turborepo task pipeline orchestration
└── vercel.json                  # Vercel build, output, and SPA routing rewrites
```

---

## D. Exact Local Commands

Execute all commands from the repository root:

```bash
# 1. Install dependencies across the entire monorepo
pnpm install

# 2. Run local development servers (Vite on :5173, Express on :5001)
pnpm run dev

# 3. Run all automated test suites (107 tests across web and api)
pnpm run test

# 4. Run TypeScript typechecking across all packages (0 errors)
pnpm run typecheck

# 5. Build production bundles for all packages
pnpm run build

# 6. Test isolated frontend production build
pnpm --filter @portfolio/web build

# 7. Preview the generated frontend build locally
pnpm --filter @portfolio/web preview

# 8. Run standalone backend server locally in production mode
pnpm --filter @portfolio/api start
```

---

## E. Exact Vercel Project Settings

When creating a new project in the [Vercel Dashboard](https://vercel.com/new):

| Setting | Exact Value to Enter | Notes / Rationale |
| :--- | :--- | :--- |
| **Framework Preset** | `Vite` | Configures Vercel's caching and asset optimization for Vite |
| **Root Directory** | `./` (leave default repository root) | Allows Vercel to access monorepo packages (`@portfolio/contracts`) |
| **Install Command** | `pnpm install` | Uses pnpm to resolve monorepo workspaces and lockfile |
| **Build Command** | `pnpm turbo run build` | Turborepo builds contracts, API, and web in dependency order |
| **Output Directory** | `apps/web/dist` | Points to Vite’s generated production bundle directory |
| **Node.js Version** | `20.x` or `22.x` | Set under Settings > General > Node.js Version |

*Note: Because [`vercel.json`](file:///Users/krishnagoyal/Development/personal%20projects/krishna_portfolio/vercel.json) is present in the repository root, Vercel will automatically prefill these build and output directory settings.*

---

## F. Environment-Variable Reference Table

Configure these in the Vercel Dashboard under **Project Settings > Environment Variables**:

| Variable | Used By | Required? | Public or Secret? | Description & Value |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | API Runtime | Optional | Secret | Set to `production`. Disables verbose debug stack traces in error envelopes. |
| `API_PREFIX` | API Runtime | Optional | Secret | Set to `/api/v1` (default in code). |
| `CORS_ORIGIN` | API Runtime | Recommended | Secret | Production domain(s). Set to `https://krishnagoyal.com,https://your-project.vercel.app`. Automatically permits Vercel preview domains. |
| `MONGODB_URI` | API Runtime | Optional | Secret | MongoDB Atlas connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`). If omitted, API operates in offline mode without crashing. |
| `VITE_API_BASE_URL` | Frontend Build | Optional | **Public** | **Option A (Vercel Serverless):** Leave unset or set to `/api/v1`.<br>**Option C (External Host):** Set to your backend URL (e.g. `https://api.yourdomain.com/api/v1`). |
| `RATE_LIMIT_WINDOW_MS` | API Runtime | Optional | Secret | Window duration in ms (default: `900000` = 15 minutes). |
| `RATE_LIMIT_MAX_REQUESTS` | API Runtime | Optional | Secret | Maximum requests per IP window (default: `100`). |
| `LOG_LEVEL` | API Runtime | Optional | Secret | Set to `info` for production. |
| `RESEND_API_KEY` | API Runtime | **Required for Email** | Secret | Resend API key (`re_...`) from resend.com for dispatching contact inquiries. |
| `CONTACT_EMAIL_TO` | API Runtime | Optional | Secret | Destination inbox (default: `iamkrishnagoyal@gmail.com`). |
| `CONTACT_EMAIL_FROM` | API Runtime | Optional | Secret | Sender address (e.g. `Krishna Goyal Portfolio <onboarding@resend.dev>` or your verified domain). |

> **CRITICAL SECURITY RULE:** Variables prefixed with `VITE_` are compiled directly into the client-side JavaScript bundle sent to every visitor's browser. **NEVER** prefix database credentials, email API keys, or private tokens with `VITE_`.

---

## G. Backend and API Deployment Instructions

### For Option A: Vercel Serverless Function (Unified Deployment)
1. Ensure [`api/index.ts`](file:///Users/krishnagoyal/Development/personal%20projects/krishna_portfolio/api/index.ts) is committed in the repository root.
2. In Vercel Project Settings > Environment Variables, add `NODE_ENV=production` and optionally `MONGODB_URI`.
3. Deploy to Vercel.
4. Requests to `https://your-domain.vercel.app/api/v1/health` will return:
   ```json
   {
     "success": true,
     "data": {
       "status": "ok",
       "version": "1.0.0",
       "environment": "production"
     }
   }
   ```

### For Option C: Deploying API to Render / Railway (Decoupled Mode)
If hosting the backend as a standalone persistent service:
1. Create a **Web Service** on Render or Railway connecting the same GitHub repository.
2. Settings:
   - **Root Directory:** `.`
   - **Build Command:** `pnpm install && pnpm --filter @portfolio/contracts build && pnpm --filter @portfolio/api build`
   - **Start Command:** `pnpm --filter @portfolio/api start`
   - **Environment Variables:**
     - `PORT=5001`
     - `NODE_ENV=production`
     - `CORS_ORIGIN=https://your-frontend.vercel.app,https://krishnagoyal.com`
     - `MONGODB_URI=<your-mongodb-atlas-uri>`
3. In your Vercel Frontend project settings:
   - Add `VITE_API_BASE_URL=https://your-api-service.onrender.com/api/v1`
   - Trigger a redeployment in Vercel to bake the URL into the frontend bundle.

---

## H. Database & External Service Setup

### MongoDB Atlas Setup (Optional but Recommended for Inquiry Storage)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) because Vercel Serverless Functions and cloud hosts utilize dynamic outbound IP addresses.
3. Under **Database Access**, create a database user with `readWrite` permissions.
4. Click **Connect > Drivers > Node.js** to copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/krishna_portfolio?retryWrites=true&w=majority
   ```
5. Add this string as `MONGODB_URI` in Vercel or Render environment variables.
6. **Graceful Offline Tolerance:** If the database is unreachable, the API logs a warning and continues in offline mode, returning status `201` for contact submissions while the client displays the fallback email link.

---

## I. SPA Routing and Direct URL Access

### How Direct Navigation Works on Vercel
Vite builds a Single Page Application with client-side routing managed by React Router v7.

When a visitor navigates directly to:
- `https://yourdomain.com/work/udhyog-saathi`
- `https://yourdomain.com/project/insightloop`
- `https://yourdomain.com/resume`

Vercel inspects [`vercel.json`](file:///Users/krishnagoyal/Development/personal%20projects/krishna_portfolio/vercel.json):
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "pnpm turbo run build",
  "outputDirectory": "apps/web/dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Routing Precedence Order Verified:
1. **Static Files Take First Precedence:** Files physically present in `apps/web/dist` (e.g. `/assets/index-CRJ3k8hI.js`, `/images/about-portrait-red.png`, `/resume/krishna-goyal-resume.pdf`) are served immediately with high-speed CDN cache headers.
2. **API Requests Route to Serverless Function:** Requests matching `/api/*` are routed to `api/index.ts`.
3. **All Other Requests Route to `index.html`:** React Router hydrates in the browser and mounts the appropriate view component (`ProjectDetailPage`, `ResumePage`, etc.) without throwing HTTP 404.

---

## J. Local Production Verification

Before triggering a remote build, simulate production locally:

```bash
# 1. Clean build all packages
pnpm run build

# 2. Verify static assets exist in build output
ls -la apps/web/dist/resume/krishna-goyal-resume.pdf
ls -la apps/web/dist/images/about-portrait-red.png

# 3. Start preview server
pnpm --filter @portfolio/web preview --port 4173

# 4. In a separate terminal, test direct route resolution
curl -I http://localhost:4173/work/udhyog-saathi   # Expected: HTTP 200 text/html
curl -I http://localhost:4173/resume               # Expected: HTTP 200 text/html
curl -I http://localhost:4173/resume/krishna-goyal-resume.pdf # Expected: HTTP 200 application/pdf
```

---

## K. Git-Based Deployment Workflow

1. Ensure all changes are committed on your local branch:
   ```bash
   git status
   git add vercel.json api/index.ts .env.example apps/api/src/app.ts packages/contracts/package.json
   git commit -m "chore(deploy): prepare Vercel monorepo configuration and serverless API adapter"
   ```
2. Push your changes to GitHub:
   ```bash
   git push origin main
   ```
3. In Vercel, import your GitHub repository:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your repository `krishna_portfolio`.
   - Vercel automatically detects `vercel.json` and configures the build settings.
   - Click **Deploy**.

---

## L. Preview Deployments vs Production Deployments

- **Production Deployments:** Any commit pushed or merged into the `main` branch automatically triggers a production deployment to your primary domain (e.g. `krishnagoyal.com` or `krishna-portfolio.vercel.app`).
- **Preview Deployments:** Any pull request or feature branch push generates a unique preview URL (e.g. `krishna-portfolio-git-feat-xyz.vercel.app`).
  - *CORS Compatibility:* The API’s CORS middleware automatically recognizes and permits all `*.vercel.app` preview URLs.

---

## M. Custom-Domain Setup

When you are ready to attach a custom domain:

1. In the Vercel Dashboard, go to **Project Settings > Domains**.
2. Enter your domain (e.g., `krishnagoyal.com` and `www.krishnagoyal.com`).
3. Vercel displays the required DNS records:
   - **For Apex Domain (`krishnagoyal.com`):**
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21`
   - **For Subdomain / WWW (`www.krishnagoyal.com`):**
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`
4. Update these records at your domain registrar (Namecheap, Cloudflare, GoDaddy, etc.).
5. Vercel automatically generates and auto-renews free Let's Encrypt SSL/TLS certificates within 5–15 minutes of DNS propagation.

---

## N. Troubleshooting

### 1. Build Failure: `Cannot find module '@portfolio/contracts'`
- **Cause:** Turborepo build order not followed or contracts package not compiled before web.
- **Fix:** Ensure Build Command is `pnpm turbo run build` (which honors `dependsOn: ["^build"]` in `turbo.json`), not plain `vite build`.

### 2. Route Refresh Returns 404
- **Cause:** Vercel rewrite rule missing.
- **Fix:** Verify `vercel.json` exists at the repository root and contains the `/(.*) -> /index.html` rewrite.

### 3. Contact Form Submission Fails with Network / CORS Error
- **Cause:** Backend CORS origin does not include the frontend domain.
- **Fix:** In backend environment variables, verify `CORS_ORIGIN` includes your production URL. If using Option A (same-origin Vercel function), ensure `VITE_API_BASE_URL` is empty or set to `/api/v1` so requests use the same origin.
- **Fallback Verification:** Even if the network drops or backend is offline, the contact interface displays an alert with a prefilled `SEND VIA EMAIL APP` button.

### 4. Missing Static Assets (Images / PDF Resume)
- **Cause:** Assets placed in `src/` instead of `public/`, or case-sensitive filename mismatch on Linux builders.
- **Fix:** Verify files exist in `apps/web/public/` (`/images/about-portrait-red.png`, `/resume/krishna-goyal-resume.pdf`). Vite automatically copies `public/` into `dist/`.

### 5. Serverless Function Timeout
- **Cause:** Serverless lambda trying to connect to an unreachable MongoDB host with infinite timeout.
- **Fix:** The codebase configures `serverSelectionTimeoutMS: 5000` and catches timeouts gracefully so the function responds within standard serverless budget.

---

## O. Rollback Procedure

If any issue occurs on a new deployment:

1. Go to your Vercel Dashboard project page.
2. Click on the **Deployments** tab.
3. Locate the previous working deployment in the list.
4. Click the three dots (`...`) on that deployment card.
5. Select **Promote to Production** (or **Instant Rollback**).
6. Vercel instantly routes edge traffic to the previous immutable deployment artifact within seconds without re-running the build.
