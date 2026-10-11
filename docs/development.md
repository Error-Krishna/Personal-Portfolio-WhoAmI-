# Development Guide

## Prerequisites
- **Node.js**: >= 20.x
- **pnpm**: >= 9.x
- **MongoDB** (optional locally, auto-reconnects gracefully if absent)

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
   - Express API: `http://localhost:5000/api/v1`

4. **Build all packages:**
   ```bash
   pnpm build
   ```

5. **Typecheck & Lint:**
   ```bash
   pnpm typecheck
   pnpm lint
   ```
