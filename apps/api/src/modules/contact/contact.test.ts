import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';
import { env } from '../../config/env.js';

describe('Contact Inquiry API Endpoint', () => {
  const app = createApp();

  beforeEach(() => {
    vi.restoreAllMocks();
    const defaultMockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'resend_msg_test_default' }),
    });
    vi.stubGlobal('fetch', defaultMockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('POST /api/v1/contact should return 201 when payload is valid', async () => {
    const res = await request(app).post('/api/v1/contact').send({
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
    expect(res.body.data.deliveryStatus).toBeDefined();
  });

  it('POST /api/v1/contact should return 422 when required fields are missing', async () => {
    const res = await request(app).post('/api/v1/contact').send({
      name: 'J', // too short
      email: 'invalid-email',
    });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });

  it('dispatches through Resend when RESEND_API_KEY is configured', async () => {
    // Mock global fetch to simulate Resend API response
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'resend_msg_test_123' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    // Set temporary mock API key
    const originalKey = env.RESEND_API_KEY;
    (env as { RESEND_API_KEY?: string }).RESEND_API_KEY = 're_test_mock_key';

    try {
      const res = await request(app).post('/api/v1/contact').send({
        name: 'Alice Smith',
        email: 'alice@example.com',
        service: 'UI/UX Redesign & Design Systems',
        message: 'Need a comprehensive design system for our fintech platform.',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('resend_msg_test_123');
      expect(res.body.data.provider).toBe('resend');
      expect(res.body.data.deliveryStatus).toBe('accepted');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    } finally {
      (env as { RESEND_API_KEY?: string }).RESEND_API_KEY = originalKey;
      vi.unstubAllGlobals();
    }
  });

  it('handles provider rejection gracefully with 503 and structured error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ message: 'Domain verification failed' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const originalKey = env.RESEND_API_KEY;
    (env as { RESEND_API_KEY?: string }).RESEND_API_KEY = 're_test_mock_key';

    try {
      const res = await request(app).post('/api/v1/contact').send({
        name: 'Bob Johnson',
        email: 'bob@example.com',
        service: 'Interactive 3D Experiences',
        message: 'Interested in building a 3D web configurator for our retail brand.',
      });

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('SERVICE_UNAVAILABLE');
      expect(res.body.error.message).toContain('Domain verification failed');
    } finally {
      (env as { RESEND_API_KEY?: string }).RESEND_API_KEY = originalKey;
      vi.unstubAllGlobals();
    }
  });
});
