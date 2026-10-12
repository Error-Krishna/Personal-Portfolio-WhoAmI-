import { describe, it, expect } from 'vitest';
import {
  siteConfig,
  formatPrice,
  isValidUrl,
  getVisibleServices,
  getProjectBySlug,
} from '../../src/lib/config/site-config.js';

describe('Site Configuration & Utilities', () => {
  it('loads valid personal configuration', () => {
    expect(siteConfig.personal.name).toBe('Krishna Goyal');
    expect(siteConfig.personal.displayName).toBe('KRISHNA GOYAL');
    expect(siteConfig.personal.graduationYear).toBe(2027);
    expect(siteConfig.personal.email).toBe('iamkrishnagoyal@gmail.com');
  });

  it('formats prices correctly without generating fake values', () => {
    expect(formatPrice(1200, 'USD')).toBe('Starting at $1,200');
    expect(formatPrice(500, 'USD')).toBe('Starting at $500');
    expect(formatPrice(null, 'USD', 'Request a Quote')).toBe('Request a Quote');
    expect(formatPrice(undefined, 'USD', 'Request a Quote')).toBe('Request a Quote');
    expect(formatPrice(0, 'USD', 'Custom Scope')).toBe('Custom Scope');
  });

  it('validates URLs safely', () => {
    expect(isValidUrl('https://github.com/Error-Krishna')).toBe(true);
    expect(isValidUrl('mailto:iamkrishnagoyal@gmail.com')).toBe(true);
    expect(isValidUrl('/resume/krishna-goyal-resume.pdf')).toBe(true);
    expect(isValidUrl('#contact')).toBe(true);
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('#')).toBe(false);
    expect(isValidUrl(null)).toBe(false);
    expect(isValidUrl(undefined)).toBe(false);
  });

  it('retrieves visible services and projects', () => {
    const services = getVisibleServices();
    expect(services.length).toBeGreaterThan(0);
    expect(services.every((s) => s.visible !== false)).toBe(true);

    const udhyogSaathi = getProjectBySlug('udhyog-saathi');
    expect(udhyogSaathi).toBeDefined();
    expect(udhyogSaathi?.title).toBe('Udhyog Saathi');
    expect(udhyogSaathi?.category).toBe('SAAS & PRODUCTS');
  });
});
