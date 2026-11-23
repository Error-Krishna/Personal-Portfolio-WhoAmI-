# Development Guide

## Prerequisites

- **Node.js**: `>= 20.0.0`
- **pnpm**: `>= 9.0.0`

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Verify environment:**

   ```bash
   pnpm run check-env
   ```

3. **Start development mode:**

   ```bash
   pnpm dev
   ```
   - Web application: `http://localhost:5173`
   - Express API (optional standalone backend): `http://localhost:5001/api/v1`

4. **Run quality checks & tests:**

   ```bash
   # Linting
   pnpm run lint

   # Code formatting verification
   pnpm run format:check

   # TypeScript typechecking
   pnpm run typecheck

   # Run all package test suites
   pnpm test

   # Run root E2E and Live Production tests
   pnpm run test:e2e
   ```

5. **Build all packages:**
   ```bash
   pnpm run build
   ```
