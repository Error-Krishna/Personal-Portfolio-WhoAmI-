import { z } from 'zod';

export const HealthCheckResponseSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error']),
  uptime: z.number(),
  timestamp: z.string(),
  version: z.string(),
  environment: z.string(),
  services: z.object({
    database: z.object({
      status: z.enum(['connected', 'disconnected', 'connecting']),
      latencyMs: z.number().optional(),
    }),
  }),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
