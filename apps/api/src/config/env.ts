import dotenv from 'dotenv';
import { z } from 'zod';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Traverses upward from a given directory to discover the repository root.
 * Detects workspace marker files (`pnpm-workspace.yaml` or `turbo.json`),
 * providing a stable reference independent of the shell's process.cwd().
 */
export function findRepoRoot(startDir: string): string {
  let curr = startDir;
  while (curr !== path.dirname(curr)) {
    if (
      fs.existsSync(path.join(curr, 'pnpm-workspace.yaml')) ||
      fs.existsSync(path.join(curr, 'turbo.json'))
    ) {
      return curr;
    }
    curr = path.dirname(curr);
  }
  // Fallback to relative traversal if no marker found (4 levels up from config dir)
  return path.resolve(startDir, '../../../../');
}

/**
 * Loads the repository-root .env file if available, while ensuring that any
 * environment variables injected by deployment platforms (e.g., Vercel, Docker, CI)
 * take precedence (override: false).
 */
export function loadEnvironment(): void {
  const currentModuleDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = findRepoRoot(currentModuleDir);
  const rootEnvPath = path.join(repoRoot, '.env');

  if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath, override: false });
  } else {
    dotenv.config({ override: false });
  }
}

// Initialize environment variables from root .env before validation
loadEnvironment();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default('5001'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/krishna_portfolio'),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default('100'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('debug'),
  // Email Dispatch Configuration (Resend or SMTP)
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL_TO: z.string().email().default('iamkrishnagoyal@gmail.com'),
  CONTACT_EMAIL_FROM: z.string().default('Krishna Goyal Portfolio <onboarding@resend.dev>'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

const parseEnv = () => {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment configuration');
  }
  return result.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof EnvSchema>;
