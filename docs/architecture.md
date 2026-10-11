# Architecture Documentation

## Overview
This repository is configured as a production-grade TypeScript monorepo powered by **pnpm workspaces** and **Turborepo**.

```
krishna_portfolio/
├── apps/
│   ├── web/                         # React 18 + Vite + Tailwind CSS Frontend
│   └── api/                         # Express + Node.js + MongoDB Backend
├── packages/
│   ├── contracts/                   # Shared TypeScript schemas, DTOs & API error envelopes (Zod)
│   ├── eslint-config/               # Shared ESLint configuration
│   └── typescript-config/           # Shared tsconfig base files
├── docker/                          # Multi-stage Dockerfiles
├── infra/                           # Docker compose configuration
├── scripts/                         # Monorepo build and validation scripts
└── docs/                            # System architecture and guides
```

## Standardized Error Handling Architecture
Both frontend and backend adhere to a unified error protocol:

### Standard Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | BAD_REQUEST | RATE_LIMIT_EXCEEDED | INTERNAL_SERVER_ERROR",
    "message": "Human readable message",
    "statusCode": 400,
    "details": [
      { "field": "email", "message": "Invalid email address" }
    ],
    "requestId": "uuidv4",
    "timestamp": "ISO-8601 string",
    "stack": "Included only in development"
  }
}
```

### Components:
1. **Contracts (`packages/contracts`)**: Defines the canonical `ApiErrorResponse`, `ErrorCode`, and validation shapes using Zod.
2. **Backend (`apps/api`)**:
   - `AppError` and custom subclass hierarchy.
   - `validateRequest` middleware converts Zod schema violations into structured error details.
   - `errorHandlerMiddleware` intercepts operational errors, syntax errors, and database errors into the standard format.
3. **Frontend (`apps/web`)**:
   - `ApiClientError` normalizes all network, HTTP, and API responses.
   - `setupInterceptors` automatically translates API error responses into `ApiClientError`.
   - `ErrorBoundary` & `ErrorMessage` components provide resilient user-facing feedback.
