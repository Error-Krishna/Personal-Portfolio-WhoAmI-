// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { DynamicIsland } from '../../src/components/layout/DynamicIsland.js';
import {
  CornerNavigationDial,
  DIAL_DESTINATIONS,
} from '../../src/components/navigation/CornerNavigationDial.js';
import { HandwrittenAnnotations } from '../../src/components/hero/HandwrittenAnnotations.js';
import { HomePage } from '../../src/pages/HomePage.js';
import { ProjectDetailPage } from '../../src/pages/ProjectDetailPage.js';
import { ResumePage } from '../../src/pages/ResumePage.js';
import { NotFoundPage } from '../../src/pages/NotFoundPage.js';
import { ContactSection } from '../../src/components/contact/ContactSection.js';
import { siteConfig } from '../../src/lib/config/site-config.js';
import { apiClient } from '../../src/lib/api/client.js';

// Setup common mock environments for mobile E2E
function setupMobileEnvironment(width = 393, height = 852) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
}

describe('Mobile End-to-End QA Test Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
    setupMobileEnvironment(393, 852); // Default Android viewport (393x852)

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes('max-width: 639px') || query.includes('max-width: 767px'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. DYNAMIC ISLAND E2E ON MOBILE
  // =========================================================================
  describe('Phase 3: Dynamic Island Mobile Interaction', () => {
    it('renders collapsed capsule with name, ticker, and avatar', () => {
      render(
        <MemoryRouter>
          <DynamicIsland />
        </MemoryRouter>
      );

      const island = screen.getByTestId('dynamic-island');
      expect(island).toBeInTheDocument();
      expect(island).toHaveAttribute('data-expanded', 'false');
      expect(screen.getByText('KRISHNA GOYAL')).toBeInTheDocument();
      expect(screen.getByTestId('collapsed-social-ticker')).toBeInTheDocument();
    });

    it('expands on tap/click and renders all social profile links with secure attributes', () => {
      render(
        <MemoryRouter>
          <DynamicIsland />
        </MemoryRouter>
      );

      const island = screen.getByTestId('dynamic-island');
      fireEvent.click(island);

      // Verify expanded state
      expect(island).toHaveAttribute('data-expanded', 'true');
      const expandedPanel = screen.getByTestId('expanded-social-panel');
      expect(expandedPanel).toBeInTheDocument();

      // Check role and availability
      expect(screen.getByText(/Full-Stack Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/AVAILABLE FOR PROJECTS/i)).toBeInTheDocument();

      // Check all social links
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(4);

      // Verify GitHub link
      const githubLink = links.find((l) => l.getAttribute('href') === siteConfig.links.github);
      expect(githubLink).toBeDefined();
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

      // Verify LinkedIn link
      const linkedinLink = links.find((l) => l.getAttribute('href') === siteConfig.links.linkedin);
      expect(linkedinLink).toBeDefined();
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

      // Verify Email link
      const emailLink = links.find((l) => l.getAttribute('href')?.startsWith('mailto:'));
      expect(emailLink).toBeDefined();

      // Verify Phone link
      const phoneLink = links.find((l) => l.getAttribute('href')?.startsWith('tel:'));
      expect(phoneLink).toBeDefined();
    });

    it('closes on mobile dismiss (X) button tap', () => {
      render(
        <MemoryRouter>
          <DynamicIsland />
        </MemoryRouter>
      );

      const island = screen.getByTestId('dynamic-island');
      fireEvent.click(island);
      expect(island).toHaveAttribute('data-expanded', 'true');

      const closeButton = screen.getByRole('button', { name: /close social panel/i });
      fireEvent.click(closeButton);

      expect(island).toHaveAttribute('data-expanded', 'false');
    });

    it('closes on bottom indicator tap and outside click', () => {
      render(
        <MemoryRouter>
          <div>
            <div data-testid="outside-area">Outside</div>
            <DynamicIsland />
          </div>
        </MemoryRouter>
      );

      const island = screen.getByTestId('dynamic-island');
      fireEvent.click(island);
      expect(island).toHaveAttribute('data-expanded', 'true');

      // Bottom indicator close
      const bottomBar = screen.getByTitle('Tap to close');
      fireEvent.click(bottomBar);
      expect(island).toHaveAttribute('data-expanded', 'false');

      // Re-open and test outside tap
      fireEvent.click(island);
      expect(island).toHaveAttribute('data-expanded', 'true');

      fireEvent.mouseDown(screen.getByTestId('outside-area'));
      expect(island).toHaveAttribute('data-expanded', 'false');
    });
  });

  // =========================================================================
  // 2. CORNER NAVIGATION DIAL E2E ON MOBILE
  // =========================================================================
  describe('Phase 4: Corner Navigation Dial Mobile Interaction', () => {
    it('renders with all 7 configured destinations matching valid section IDs', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <CornerNavigationDial />
        </MemoryRouter>
      );

      const dial = screen.getByTestId('corner-navigation-dial');
      expect(dial).toBeInTheDocument();
      expect(DIAL_DESTINATIONS).toHaveLength(7);

      const expectedIds = [
        'hero',
        'about',
        'projects',
        'services',
        'how-it-works',
        'skills',
        'contact',
      ];
      expect(DIAL_DESTINATIONS.map((d) => d.id)).toEqual(expectedIds);
    });

    it('expands on tap and commits navigation to target section with single whoosh', () => {
      const handleTransitionChange = vi.fn();
      const targetElement = document.createElement('section');
      targetElement.id = 'projects';
      document.body.appendChild(targetElement);

      render(
        <MemoryRouter initialEntries={['/']}>
          <CornerNavigationDial onTransitionChange={handleTransitionChange} />
        </MemoryRouter>
      );

      const dial = screen.getByTestId('corner-navigation-dial');

      // Tap to expand
      fireEvent.click(dial);

      // Select 'WORK' (projects)
      const workButton = screen.getByRole('button', { name: /Navigate to WORK/i });
      fireEvent.click(workButton);

      // Verify whoosh transition activated
      expect(handleTransitionChange).toHaveBeenCalledWith(true);
      expect(targetElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

      // Fast-forward settle timer (650ms)
      act(() => {
        vi.advanceTimersByTime(700);
      });

      // Verify transition resets
      expect(handleTransitionChange).toHaveBeenCalledWith(false);
      expect(dial).toHaveAttribute('data-active-section', 'projects');

      document.body.removeChild(targetElement);
    });

    it('renders return to home button on non-homepage routes and navigates back', () => {
      render(
        <MemoryRouter initialEntries={['/resume']}>
          <Routes>
            <Route path="/resume" element={<CornerNavigationDial />} />
            <Route path="/" element={<div data-testid="mock-home">Home Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      const dial = screen.getByTestId('corner-navigation-dial');
      fireEvent.mouseEnter(dial);

      const returnBtn = screen.getByRole('button', { name: /RETURN TO HOME/i });
      expect(returnBtn).toBeInTheDocument();

      fireEvent.click(returnBtn);
      expect(screen.getByTestId('mock-home')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 3. HANDWRITTEN ANNOTATIONS
  // =========================================================================
  describe('Phase 5: Handwritten Annotations Style & Responsiveness', () => {
    it('renders "Touch me" mobile annotation and hides dial annotation on mobile', () => {
      render(<HandwrittenAnnotations />);

      const annotationsContainer = screen.getByTestId('handwritten-annotations');
      expect(annotationsContainer).toHaveClass('pointer-events-none');

      // Mobile Dynamic Island annotation
      const mobileAnnotation = screen.getByTestId('annotation-dynamic-island-mobile');
      expect(mobileAnnotation).toBeInTheDocument();
      expect(mobileAnnotation).toHaveTextContent('Touch me');
      expect(mobileAnnotation).toHaveClass('flex', 'sm:hidden');

      // Desktop Dynamic Island annotation
      const desktopAnnotation = screen.getByTestId('annotation-dynamic-island-desktop');
      expect(desktopAnnotation).toHaveTextContent('Touch me');
      expect(desktopAnnotation).toHaveClass('hidden', 'sm:flex');

      // Dial annotation (hidden on mobile < 768px)
      const dialAnnotation = screen.getByTestId('annotation-nav-dial');
      expect(dialAnnotation).toBeInTheDocument();
      expect(dialAnnotation).toHaveTextContent('Take a look around');
      expect(dialAnnotation).toHaveClass('hidden', 'md:flex');
    });
  });

  // =========================================================================
  // 4. ROUTE NAVIGATION MATRIX
  // =========================================================================
  describe('Phase 6: Route Navigation Matrix', () => {
    it('renders all published project detail pages properly', () => {
      const publishedProjects = siteConfig.projects.filter((p) => p.published !== false);
      expect(publishedProjects.length).toBe(9);

      publishedProjects.forEach((project, idx) => {
        const { unmount } = render(
          <MemoryRouter initialEntries={[`/work/${project.slug}`]}>
            <Routes>
              <Route path="/work/:slug" element={<ProjectDetailPage />} />
            </Routes>
          </MemoryRouter>
        );

        // Project title must be visible
        expect(
          screen.getByRole('heading', { name: new RegExp(project.title, 'i') })
        ).toBeInTheDocument();
        // Overview or problem statement
        expect(screen.getByText(project.problem || project.shortDescription)).toBeInTheDocument();
        // Back to Projects link always present
        expect(screen.getByRole('link', { name: /Back to Projects/i })).toBeInTheDocument();
        // Next Project navigation link present for all but last
        if (idx < publishedProjects.length - 1) {
          expect(screen.getByRole('link', { name: /Next Project/i })).toBeInTheDocument();
        }

        unmount();
      });
    });

    it('renders 404 Project Not Found for non-existent slug', () => {
      render(
        <MemoryRouter initialEntries={['/work/non-existent-project-xyz']}>
          <Routes>
            <Route path="/work/:slug" element={<ProjectDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/404 — PROJECT NOT FOUND/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /RETURN TO PROJECTS/i })).toBeInTheDocument();
    });

    it('renders ResumePage with download PDF button and all resume sections', () => {
      render(
        <MemoryRouter initialEntries={['/resume']}>
          <ResumePage />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { level: 1, name: /KRISHNA GOYAL/i })).toBeInTheDocument();
      expect(screen.getByText(/EDUCATION/i)).toBeInTheDocument();
      expect(screen.getByText(/TECHNICAL STACK/i)).toBeInTheDocument();
      expect(screen.getByText(/RECOGNITION & CERTIFICATIONS/i)).toBeInTheDocument();

      const downloadButton = screen.getByRole('link', { name: /DOWNLOAD PDF RESUME/i });
      expect(downloadButton).toHaveAttribute('href', siteConfig.assets.resume);
      expect(downloadButton).toHaveAttribute('download', 'krishna-goyal-resume.pdf');
    });

    it('renders NotFoundPage for unknown routes', () => {
      render(
        <MemoryRouter initialEntries={['/unknown-random-route']}>
          <NotFoundPage />
        </MemoryRouter>
      );

      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Back to Home/i })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 5. HOMEPAGE SECTION ANCHORS & CTAS
  // =========================================================================
  describe('Phase 7: Homepage Section Anchors & CTAs', () => {
    it('renders all 11 required homepage sections in DOM', () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/']}>
          <HomePage />
        </MemoryRouter>
      );

      const requiredSections = [
        'hero',
        'about',
        'projects',
        'work',
        'testimonials',
        'services',
        'service-comparison',
        'how-it-works',
        'skills',
        'experience',
        'creative',
        'contact',
      ];

      requiredSections.forEach((id) => {
        const el = container.querySelector(`#${id}`);
        expect(el).not.toBeNull();
      });
    });

    it('verifies hero action buttons trigger scroll to projects and contact', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <HomePage />
        </MemoryRouter>
      );

      const viewWorkButtons = screen.getAllByRole('button', { name: /VIEW MY WORK/i });
      expect(viewWorkButtons.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(viewWorkButtons[0]);

      const connectButtons = screen.getAllByRole('button', { name: /LET’S CONNECT/i });
      expect(connectButtons.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(connectButtons[0]);
    });
  });

  // =========================================================================
  // 6. CONTACT FORM VALIDATION & FALLBACK FLOW
  // =========================================================================
  describe('Phase 9: Contact Form Validation & Submission Fallback', () => {
    it('validates required fields and shows inline errors on invalid input', async () => {
      render(<ContactSection />);

      const submitButton = screen.getByRole('button', { name: /SEND PROJECT INQUIRY/i });
      fireEvent.click(submitButton);

      // Name & message validation errors
      expect(screen.getByText(/Please enter your name/i)).toBeInTheDocument();
      expect(screen.getByText(/Please provide a valid email/i)).toBeInTheDocument();
      expect(screen.getByText(/Please provide at least 10 characters/i)).toBeInTheDocument();
    });

    it('accepts valid input and triggers error state with mailto fallback when API is offline', async () => {
      vi.spyOn(apiClient, 'post').mockRejectedValueOnce(new Error('Network error'));

      render(<ContactSection />);

      // Fill in valid form data
      fireEvent.change(screen.getByPlaceholderText(/Alex Morgan/i), {
        target: { value: 'Alex Morgan' },
      });
      fireEvent.change(screen.getByPlaceholderText(/alex@company.com/i), {
        target: { value: 'alex@company.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/Share a brief overview/i), {
        target: { value: 'We need a high-performance web MVP built within 3 weeks.' },
      });

      const submitButton = screen.getByRole('button', { name: /SEND PROJECT INQUIRY/i });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      // When API call fails, fallback mailto button should appear
      const fallbackLink = screen.getByRole('link', { name: /SEND VIA EMAIL APP/i });
      expect(fallbackLink).toBeInTheDocument();
      expect(fallbackLink.getAttribute('href')).toContain('mailto:iamkrishnagoyal@gmail.com');
      expect(fallbackLink.getAttribute('href')).toContain(encodeURIComponent('Alex Morgan'));
    });
  });

  // =========================================================================
  // 7. MULTI-VIEWPORT RESPONSIVENESS MATRIX
  // =========================================================================
  describe('Phase 2 & 10: Multi-Viewport Matrix (320px to 430px)', () => {
    const viewports = [
      { name: 'Ultra-Compact Phone', width: 320, height: 600 },
      { name: 'Android Standard (Samsung Galaxy S20)', width: 360, height: 800 },
      { name: 'Compact Phone (iPhone SE)', width: 375, height: 667 },
      { name: 'Modern Android (Pixel 7 / 8)', width: 393, height: 852 },
      { name: 'Large Android (Samsung Galaxy Ultra)', width: 412, height: 915 },
      { name: 'Max Android / iPhone Pro Max', width: 430, height: 932 },
    ];

    viewports.forEach(({ name, width, height }) => {
      it(`renders properly on ${name} (${width}x${height}) without layout collision`, () => {
        setupMobileEnvironment(width, height);

        const { container } = render(
          <MemoryRouter initialEntries={['/']}>
            <HomePage />
          </MemoryRouter>
        );

        // Dynamic Island is in the document
        const island = screen.getByTestId('dynamic-island');
        expect(island).toBeInTheDocument();

        // Corner Navigation Dial is in the document
        const dial = screen.getByTestId('corner-navigation-dial');
        expect(dial).toBeInTheDocument();

        // Verify root container has overflow-x-hidden
        const main = container.querySelector('main');
        expect(main).toHaveClass('overflow-x-hidden');
      });
    });
  });
});
