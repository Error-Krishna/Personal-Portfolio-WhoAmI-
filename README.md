# Krishna Goyal - Portfolio (MERN Monorepo)

A production-level full-stack MERN monorepo built with TypeScript, React 18, Vite, Express, and MongoDB, orchestrated by Turborepo and pnpm workspaces.

---

## 🏗 Repository Structure

```
mern-starter/
│
├── apps/
│   │
│   ├── web/                         # React 18 + Vite frontend
│   │   ├── public/                  # Static assets (images, resume)
│   │   ├── src/
│   │   │   ├── app/                 # App, router & providers
│   │   │   ├── assets/              # Bundled assets
│   │   │   ├── components/
│   │   │   │   ├── ui/              # Reusable UI components (Button, Card, etc.)
│   │   │   │   ├── layout/          # Root layout and future sidebar/navigation
│   │   │   │   └── feedback/        # ErrorBoundary, ErrorMessage, LoadingSpinner
│   │   │   ├── features/            # Feature-driven business modules
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   ├── lib/
│   │   │   │   ├── api/             # Axios client, typed errors & interceptors
│   │   │   │   └── utils/           # Utility helpers (cn, formatting)
│   │   │   ├── pages/               # HomePage, NotFoundPage
│   │   │   ├── stores/              # State management
│   │   │   ├── styles/              # Global Tailwind CSS
│   │   │   ├── test/                # Setup and test utils
│   │   │   ├── types/               # App-specific TypeScript definitions
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                         # Express + Node.js backend
│       ├── src/
│       │   ├── app.ts               # Express application config & middleware chain
│       │   ├── server.ts            # HTTP server, DB connection & graceful shutdown
│       │   ├── config/              # env validation (Zod), logger, mongo database
│       │   ├── common/
│       │   │   ├── errors/          # AppError class hierarchy & error codes
│       │   │   ├── middleware/      # error-handler, not-found, request-id, validate-request
│       │   │   ├── utils/           # async-handler, response formatters
│       │   │   ├── constants/       # HTTP status codes
│       │   │   └── types/           # Express request typing
│       │   ├── middleware/          # request-logger, rate-limit, auth stubs
│       │   ├── modules/
│       │   │   └── health/          # Health monitoring routes & controller
│       │   ├── routes/              # Centralized route mounting
│       │   ├── docs/                # API specification
│       │   ├── jobs/                # Background job workers
│       │   └── tests/               # Vitest integration tests
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── contracts/                   # Shared Zod schemas, error types & API envelopes
│   ├── eslint-config/               # Shared ESLint configuration
│   └── typescript-config/           # Shared tsconfig base files
│
├── docker/
│   ├── api/                         # Multi-stage Dockerfile for API
│   └── web/                         # Nginx + multi-stage Dockerfile for Web
│
├── infra/
│   └── docker-compose.yml           # Full-stack Compose setup (Web, API, Mongo)
│
├── scripts/
│   ├── check-env.mjs                # Environment validator
│   ├── clean.mjs                    # Build artifact cleanup
│   └── wait-for-services.mjs        # Health readiness poller
│
├── docs/
│   ├── architecture.md
│   ├── development.md
│   ├── testing.md
│   └── deployment.md
│
├── .github/workflows/               # GitHub Actions CI
├── .env.example
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

---

## 🛡 Standardized Error Handling Architecture

Every error in the system—whether database validation, 404 routes, unhandled server exceptions, malformed request JSON, or network disconnection—is intercepted and mapped to a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | BAD_REQUEST | RATE_LIMIT_EXCEEDED | INTERNAL_SERVER_ERROR",
    "message": "Human readable error description",
    "statusCode": 400,
    "details": [
      {
        "field": "email",
        "message": "Please enter a valid email address",
        "code": "invalid_string"
      }
    ],
    "requestId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "timestamp": "2026-10-11T13:00:00.000Z"
  }
}
```

On the frontend, Axios interceptors translate this directly into strongly-typed `ApiClientError` instances, providing clean user-facing error messages, field-level feedback, and retry mechanisms.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Servers
```bash
pnpm dev
```
- Web: `http://localhost:5173`
- API: `http://localhost:5001/api/v1`

### 3. Build & Typecheck
```bash
pnpm build
pnpm typecheck
```
