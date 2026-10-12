import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';

describe('Contact Inquiry API Endpoint', () => {
  const app = createApp();

  it('POST /api/v1/contact should return 201 when payload is valid', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        service: 'Full-Stack MVP & Product Engineering',
        message: 'Looking to build a SaaS MVP for inventory management.',
        budget: '$1,200 – $3,000',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.message).toContain('Jane Doe');
  });

  it('POST /api/v1/contact should return 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'J', // too short
        email: 'invalid-email',
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });
});
