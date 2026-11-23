import { describe, it, expect, vi, beforeEach } from 'vitest';
import worker from './index.js';

describe('Cloudflare Worker Router (worker/index.ts)', () => {
  const mockAssetsFetch = vi.fn();
  const mockEnv = {
    ASSETS: { fetch: mockAssetsFetch },
    RESEND_API_KEY: 'test_resend_api_key',
    CONTACT_EMAIL_TO: 'iamkrishnagoyal@gmail.com',
    CONTACT_EMAIL_FROM: 'Krishna Goyal Portfolio <onboarding@resend.dev>',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CORS Preflight Handler', () => {
    it('should respond to OPTIONS request with 204 and CORS headers', async () => {
      const request = new Request('https://errorkrishna.com/api/v1/contact', {
        method: 'OPTIONS',
        headers: {
          Origin: 'https://errorkrishna.com',
          'Access-Control-Request-Method': 'POST',
        },
      });

      const response = await worker.fetch(request, mockEnv);
      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://errorkrishna.com');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });

  describe('Health Check Endpoints', () => {
    it('should respond with 200 OK on /api/v1/health', async () => {
      const request = new Request('https://errorkrishna.com/api/v1/health');
      const response = await worker.fetch(request, mockEnv);
      expect(response.status).toBe(200);

      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.status).toBe('ok');
      expect(json.data.environment).toBe('production');
      expect(json.data.version).toBe('1.0.0');
    });

    it('should respond with 200 OK on /api/health alias', async () => {
      const request = new Request('https://errorkrishna.com/api/health');
      const response = await worker.fetch(request, mockEnv);
      expect(response.status).toBe(200);

      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.status).toBe('ok');
    });
  });

  describe('Contact Form Endpoint (/api/v1/contact)', () => {
    it('should return 400 when body is invalid JSON', async () => {
      const request = new Request('https://errorkrishna.com/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json-string',
      });

      const response = await worker.fetch(request, mockEnv);
      expect(response.status).toBe(400);

      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('INVALID_JSON');
    });

    it('should return 400 when required fields (name, email, message) are missing', async () => {
      const request = new Request('https://errorkrishna.com/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          email: '',
          message: '',
        }),
      });

      const response = await worker.fetch(request, mockEnv);
      expect(response.status).toBe(400);

      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 503 SERVICE_UNAVAILABLE when RESEND_API_KEY is not configured', async () => {
      const envWithoutKey = {
        ...mockEnv,
        RESEND_API_KEY: undefined,
      };

      const request = new Request('https://errorkrishna.com/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Doe',
          email: 'jane@example.com',
          message: 'Hello Krishna, I want to discuss a project.',
        }),
      });

      const response = await worker.fetch(request, envWithoutKey);
      expect(response.status).toBe(503);

      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('SERVICE_UNAVAILABLE');
    });

    it('should return 201 on valid submission and successful Resend dispatch', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 'resend_msg_test_123' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const request = new Request('https://errorkrishna.com/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Doe',
          email: 'jane@example.com',
          service: 'Full-Stack MVP',
          budget: '$1,200',
          message: 'Hello Krishna, I want to discuss a project.',
        }),
      });

      const response = await worker.fetch(request, mockEnv);
      expect(response.status).toBe(201);

      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.id).toBe('resend_msg_test_123');
      expect(json.data.deliveryStatus).toBe('delivered');
      expect(json.data.provider).toBe('resend');

      vi.unstubAllGlobals();
    });

    it('should return provider error status when Resend rejects message', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ message: 'Domain verification failed' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const request = new Request('https://errorkrishna.com/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Doe',
          email: 'jane@example.com',
          service: 'Full-Stack MVP',
          message: 'Hello Krishna, I want to discuss a project.',
        }),
      });

      const response = await worker.fetch(request, mockEnv);
      expect(response.status).toBe(403);

      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('EMAIL_SEND_FAILED');
      expect(json.error.message).toBe('Domain verification failed');

      vi.unstubAllGlobals();
    });
  });

  describe('Static Asset Delegation', () => {
    it('should pass non-API requests to env.ASSETS.fetch', async () => {
      mockAssetsFetch.mockResolvedValue(new Response('index html', { status: 200 }));

      const request = new Request('https://errorkrishna.com/resume');
      const response = await worker.fetch(request, mockEnv);

      expect(mockAssetsFetch).toHaveBeenCalledWith(request);
      expect(response.status).toBe(200);
    });
  });
});
