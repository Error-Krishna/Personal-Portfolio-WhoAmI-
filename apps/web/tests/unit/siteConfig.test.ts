import { describe, it, expect } from 'vitest';
import {
  siteConfig,
  formatPrice,
  isValidUrl,
  getVisibleServices,
  getProjectBySlug,
  getPublishedProjects,
  getNextProject,
  getRelatedProjects,
  normalizeVideo,
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

  it('manages published project order and navigation helpers', () => {
    const published = getPublishedProjects();
    expect(published.length).toBe(9);
    expect(published[0].slug).toBe('udhyog-saathi');
    expect(published[1].slug).toBe('insightloop');

    const nextFromFirst = getNextProject('udhyog-saathi');
    expect(nextFromFirst?.slug).toBe('insightloop');

    const lastSlug = published[published.length - 1].slug;
    const nextFromLast = getNextProject(lastSlug);
    expect(nextFromLast).toBeUndefined();

    const related = getRelatedProjects('udhyog-saathi', 4);
    expect(related.length).toBe(4);
    expect(related.every((p) => p.slug !== 'udhyog-saathi')).toBe(true);
  });

  it('normalizes video configuration safely', () => {
    expect(normalizeVideo(undefined)).toBeNull();
    expect(normalizeVideo('')).toBeNull();
    expect(normalizeVideo('https://example.com/video.mp4')).toEqual({
      url: 'https://example.com/video.mp4',
    });
    expect(normalizeVideo({ url: 'https://example.com/demo.mp4', duration: '2:15' })).toEqual({
      url: 'https://example.com/demo.mp4',
      duration: '2:15',
    });
  });

  it('manages section visibility configuration with testimonials and core sections enabled', () => {
    expect(siteConfig.sectionVisibility.trust).toBe(true);
    expect(siteConfig.sectionVisibility.hero).toBe(true);
    expect(siteConfig.sectionVisibility.services).toBe(true);
    expect(siteConfig.sectionVisibility.testimonials).toBe(true);
  });

  it('provides four published testimonials with expected data contracts', () => {
    expect(siteConfig.testimonials).toBeDefined();
    expect(siteConfig.testimonials?.length).toBe(4);
    siteConfig.testimonials?.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.published).toBe(true);
      expect(t.clientName).toBeTruthy();
      expect(t.clientRole).toBeTruthy();
      expect(t.companyName).toBeTruthy();
      expect(t.testimonial).toBeTruthy();
    });
  });
});
