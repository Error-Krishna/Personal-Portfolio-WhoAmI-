import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';

describe('Health & Global Error Handler Endpoints', () => {
  const app = createApp();

  it('GET /api/v1/health should return 200 with standard response envelope', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toMatch(/ok|degraded/);
    expect(res.body.data.services).toBeDefined();
  });

  it('GET /api/v1/non-existent-route should return 404 with standard error envelope', async () => {
    const res = await request(app).get('/api/v1/non-existent-route');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.statusCode).toBe(404);
    expect(res.body.error.requestId).toBeDefined();
  });
});
