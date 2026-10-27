import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { findRepoRoot, loadEnvironment, env } from './env.js';

describe('Environment Configuration Loader', () => {
  it('findRepoRoot traverses upward and locates the repository root', () => {
    const currentModuleDir = path.dirname(fileURLToPath(import.meta.url));
    const repoRoot = findRepoRoot(currentModuleDir);

    expect(repoRoot).toBeDefined();
    // Repository root must contain pnpm-workspace.yaml
    const workspaceFile = path.join(repoRoot, 'pnpm-workspace.yaml');
    expect(fs.existsSync(workspaceFile)).toBe(true);

    // Repository root must contain turbo.json
    const turboFile = path.join(repoRoot, 'turbo.json');
    expect(fs.existsSync(turboFile)).toBe(true);
  });

  it('preserves deployment platform injected values over .env values (precedence)', () => {
    // Simulate an injected environment variable from Vercel / Docker
    const testKey = 'TEST_INJECTED_ENV_KEY';
    const testVal = 'injected_platform_value';
    process.env[testKey] = testVal;

    loadEnvironment();

    // Verify injected variable was not modified or overwritten
    expect(process.env[testKey]).toBe(testVal);
    delete process.env[testKey];
  });

  it('validates loaded configuration with fallback defaults', () => {
    expect(env.NODE_ENV).toBeDefined();
    expect(env.PORT).toBeGreaterThan(0);
    expect(env.API_PREFIX).toBe('/api/v1');
    expect(env.CONTACT_EMAIL_TO).toBeDefined();
    expect(env.CONTACT_EMAIL_FROM).toBeDefined();
  });
});
