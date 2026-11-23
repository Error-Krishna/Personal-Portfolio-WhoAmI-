import { describe, it, expect } from 'vitest';
import {
  ContactInquirySchema,
  ContactInquiryResponseSchema,
  HealthCheckResponseSchema,
  ErrorCode,
  type ContactInquiry,
} from './index.js';

describe('Contracts Schema Validation', () => {
  describe('ContactInquirySchema', () => {
    it('should validate a valid contact inquiry payload', () => {
      const validPayload: ContactInquiry = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        service: 'Full-Stack MVP',
        budget: '$1,200',
        message: 'I would like to build a specialized SaaS application for my team.',
      };

      const result = ContactInquirySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Jane Doe');
        expect(result.data.email).toBe('jane@example.com');
      }
    });

    it('should reject a payload with a name shorter than 2 characters', () => {
      const invalidPayload = {
        name: 'J',
        email: 'jane@example.com',
        service: 'Web Development',
        message: 'This is a test message that is long enough.',
      };

      const result = ContactInquirySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/at least 2 characters/i);
      }
    });

    it('should reject an invalid email address', () => {
      const invalidPayload = {
        name: 'Jane Doe',
        email: 'not-an-email',
        service: 'Web Development',
        message: 'This is a test message that is long enough.',
      };

      const result = ContactInquirySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/valid email/i);
      }
    });

    it('should reject a message with fewer than 10 characters', () => {
      const invalidPayload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        service: 'Web Development',
        message: 'Too short',
      };

      const result = ContactInquirySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/at least 10 characters/i);
      }
    });

    it('should allow optional budget', () => {
      const payloadWithoutBudget = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        service: 'Web Development',
        message: 'Here is a message that meets the length requirement.',
      };

      const result = ContactInquirySchema.safeParse(payloadWithoutBudget);
      expect(result.success).toBe(true);
    });
  });

  describe('ContactInquiryResponseSchema', () => {
    it('should validate a successful inquiry response envelope', () => {
      const validResponse = {
        id: 'inq_12345',
        receivedAt: new Date().toISOString(),
        message: 'Inquiry received successfully',
        deliveryStatus: 'delivered',
        provider: 'resend',
      };

      const result = ContactInquiryResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });

  describe('HealthCheckResponseSchema', () => {
    it('should validate a health check response', () => {
      const validHealth = {
        status: 'ok',
        uptime: 123.45,
        version: '1.0.0',
        environment: 'production',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: 'connected',
            latencyMs: 12,
          },
        },
      };

      const result = HealthCheckResponseSchema.safeParse(validHealth);
      expect(result.success).toBe(true);
    });
  });

  describe('ErrorCode Enumeration', () => {
    it('should export all standardized error codes', () => {
      expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCode.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED');
      expect(ErrorCode.SERVICE_UNAVAILABLE).toBe('SERVICE_UNAVAILABLE');
    });
  });
});
