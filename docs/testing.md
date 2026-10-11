# Testing Guide

## Running Tests

### Unit & Integration Tests (Vitest)
```bash
# Run all workspace tests
pnpm test

# Run API tests specifically
pnpm --filter @portfolio/api test

# Run Web frontend tests specifically
pnpm --filter @portfolio/web test
```

## Test Directory Conventions
- Unit tests co-located next to target files: `*.test.ts` / `*.test.tsx`.
- API Integration tests: `apps/api/src/tests/integration/`.
- Frontend component tests: `apps/web/src/test/`.
- E2E tests: `tests/e2e/`.
