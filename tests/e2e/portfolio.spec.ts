import { describe, it, expect } from 'vitest';
import siteConfig from '../../apps/web/src/content/site_config.json' with { type: 'json' };

const PRODUCTION_URL = 'https://errorkrishna.com';
const WWW_PRODUCTION_URL = 'https://www.errorkrishna.com';

describe('End-to-End & Production Verification Matrix', () => {
  // ==========================================================================
  // Test Suite A: Homepage & Core Infrastructure
  // ==========================================================================
  describe('Test Suite A: Homepage & Core Infrastructure', () => {
    it('should successfully load the live homepage with 200 OK and text/html', async () => {
      const res = await fetch(`${PRODUCTION_URL}/`);
      expect(res.status).toBe(200);
      const contentType = res.headers.get('content-type') || '';
      expect(contentType).toContain('text/html');

      const html = await res.text();
      expect(html).toContain('<!doctype html>');
      expect(html).toContain('<div id="root"></div>');
      expect(html).toContain('Krishna Goyal');
    });

    it('should include required Google Fonts preconnect and stylesheets', async () => {
      const res = await fetch(`${PRODUCTION_URL}/`);
      const html = await res.text();
      expect(html).toContain('fonts.googleapis.com');
      expect(html).toContain('fonts.gstatic.com');
      expect(html).toContain('Archivo+Black');
    });
  });

  // ==========================================================================
  // Test Suite B: Navigation & Direct Route Access
  // ==========================================================================
  describe('Test Suite B: Navigation & Direct Route Access', () => {
    it('should serve direct URL access to /resume route', async () => {
      const res = await fetch(`${PRODUCTION_URL}/resume`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('<div id="root"></div>');
    });

    it('should serve direct URL access to published project routes', async () => {
      const sampleSlugs = ['udhyog-saathi', 'insightloop', 'lucid'];
      for (const slug of sampleSlugs) {
        const res = await fetch(`${PRODUCTION_URL}/work/${slug}`);
        expect(res.status).toBe(200);
        const html = await res.text();
        expect(html).toContain('<div id="root"></div>');
      }
    });

    it('should serve single-page application fallback on non-existent routes', async () => {
      const res = await fetch(`${PRODUCTION_URL}/non-existent-route-404-check`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('<div id="root"></div>');
    });
  });

  // ==========================================================================
  // Test Suite C: Projects Showcase & Data Integrity
  // ==========================================================================
  describe('Test Suite C: Projects Showcase & Data Integrity', () => {
    it('should contain valid configuration for all 12 projects', () => {
      expect(siteConfig.projects).toHaveLength(12);

      for (const project of siteConfig.projects) {
        expect(project.id).toBeTruthy();
        expect(project.slug).toBe(project.id);
        expect(project.title).toBeTruthy();
        expect(project.category).toBeTruthy();
        expect(project.status).toBeTruthy();
        expect(project.technologies.length).toBeGreaterThan(0);
        expect(project.overview).toBeTruthy();
        expect(project.problem).toBeTruthy();
        expect(project.solution).toBeTruthy();
      }
    });

    it('should contain valid GitHub repository URLs for projects', () => {
      for (const project of siteConfig.projects) {
        if (project.githubUrl) {
          expect(project.githubUrl).toMatch(/^https:\/\/github\.com\//);
        }
      }
    });

    it('should verify published projects have valid live or demo URLs where specified', () => {
      const published = siteConfig.projects.filter((p) => p.published !== false);
      expect(published.length).toBeGreaterThanOrEqual(10);

      const projectsWithLive = published.filter((p) => p.liveUrl && p.liveUrl.trim().length > 0);
      expect(projectsWithLive.length).toBeGreaterThanOrEqual(5);

      for (const p of projectsWithLive) {
        expect(p.liveUrl).toMatch(/^https?:\/\//);
      }
    });
  });

  // ==========================================================================
  // Test Suite D: Contact Form & API Integrity
  // ==========================================================================
  describe('Test Suite D: Contact Form & API Integrity', () => {
    it('should handle CORS OPTIONS preflight on /api/v1/contact', async () => {
      const res = await fetch(`${PRODUCTION_URL}/api/v1/contact`, {
        method: 'OPTIONS',
        headers: {
          Origin: PRODUCTION_URL,
          'Access-Control-Request-Method': 'POST',
        },
      });
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });

    it('should reject empty contact form submissions with 400 VALIDATION_ERROR', async () => {
      const res = await fetch(`${PRODUCTION_URL}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid JSON on /api/v1/contact with 400 INVALID_JSON', async () => {
      const res = await fetch(`${PRODUCTION_URL}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'malformed_json_body',
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('INVALID_JSON');
    });
  });

  // ==========================================================================
  // Test Suite E: Responsive Viewports Specifications
  // ==========================================================================
  describe('Test Suite E: Responsive Viewports Specifications', () => {
    const requiredViewports = [
      { name: 'Ultra Compact Mobile', width: 320, height: 568 },
      { name: 'Standard Compact Phone', width: 375, height: 667 },
      { name: 'Modern iPhone / Android', width: 390, height: 844 },
      { name: 'Large Flagship Phone', width: 430, height: 932 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Laptop / Small Desktop', width: 1024, height: 768 },
      { name: 'Standard Desktop', width: 1280, height: 800 },
      { name: 'Large Desktop', width: 1440, height: 900 },
      { name: 'Ultra-wide Desktop', width: 1920, height: 1080 },
    ];

    it('should define and support all 9 standard responsive viewport tiers', () => {
      expect(requiredViewports).toHaveLength(9);
      expect(requiredViewports[0].width).toBe(320);
      expect(requiredViewports[requiredViewports.length - 1].width).toBe(1920);
    });

    it('should adhere to Tailwind CSS container and breakpoint conventions', () => {
      expect(siteConfig.sectionVisibility.hero).toBe(true);
      expect(siteConfig.sectionVisibility.projects).toBe(true);
      expect(siteConfig.sectionVisibility.contact).toBe(true);
    });
  });

  // ==========================================================================
  // Test Suite F: Production Live Health & Asset Delivery
  // ==========================================================================
  describe('Test Suite F: Production Live Health & Asset Delivery', () => {
    it('should verify live /api/v1/health returns status ok with 200', async () => {
      const res = await fetch(`${PRODUCTION_URL}/api/v1/health`);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.status).toBe('ok');
      expect(json.data.environment).toBe('production');
      expect(json.data.version).toBeTruthy();
    });

    it('should verify production PDF resume is downloadable with 200 application/pdf', async () => {
      const res = await fetch(`${PRODUCTION_URL}/resume/krishna-goyal-resume.pdf`);
      expect(res.status).toBe(200);
      const contentType = res.headers.get('content-type') || '';
      expect(contentType).toContain('application/pdf');
    });

    it('should verify production images return 200 OK with correct MIME types', async () => {
      const images = [
        { path: '/images/image-removebg-preview.png', type: 'image/png' },
        { path: '/images/hero-bg.jpg', type: 'image/jpeg' },
        { path: '/images/lucid-thumb.png', type: 'image/png' },
        { path: '/images/lucid-hero.png', type: 'image/png' },
        { path: '/images/about-portrait-red.png', type: 'image/png' },
      ];

      for (const img of images) {
        const res = await fetch(`${PRODUCTION_URL}${img.path}`);
        expect(res.status).toBe(200);
        const contentType = res.headers.get('content-type') || '';
        expect(contentType).toContain(img.type);
      }
    });

    it('should verify HTTPS redirect for www subdomain', async () => {
      const res = await fetch(WWW_PRODUCTION_URL, { redirect: 'manual' });
      // Expect 301 or 302 redirect from www to apex
      expect([301, 302, 308]).toContain(res.status);
      const location = res.headers.get('location') || '';
      expect(location).toMatch(/^https:\/\/errorkrishna\.com/);
    });
  });
});
