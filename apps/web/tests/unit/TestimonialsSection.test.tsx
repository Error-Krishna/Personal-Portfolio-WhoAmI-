// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { TestimonialsSection } from '../../src/components/testimonials/TestimonialsSection.js';
import { HomePage } from '../../src/pages/HomePage.js';

describe('TestimonialsSection Component', () => {
  let intersectionCallback: IntersectionObserverCallback | null = null;
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    observeMock = vi.fn();
    disconnectMock = vi.fn();

    // Mock IntersectionObserver
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];

      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      observe = observeMock;
      unobserve = vi.fn();
      disconnect = disconnectMock;
      takeRecords = vi.fn().mockReturnValue([]);
    }

    window.IntersectionObserver = MockIntersectionObserver;

    // Default matchMedia (reduced-motion false)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
    cleanup();
    vi.restoreAllMocks();
    intersectionCallback = null;
  });

  it('renders editorial label, main headline, and supporting text', () => {
    render(<TestimonialsSection />);

    expect(screen.getByText('CLIENT FEEDBACK / 01—04')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /WHAT PEOPLE SAY/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Good work is built on good collaboration.')
    ).toBeInTheDocument();
  });

  it('renders exactly four testimonial cards in dark theme', () => {
    render(<TestimonialsSection />);

    const card0 = screen.getByTestId('testimonial-card-0');
    const card1 = screen.getByTestId('testimonial-card-1');
    const card2 = screen.getByTestId('testimonial-card-2');
    const card3 = screen.getByTestId('testimonial-card-3');

    expect(card0).toBeInTheDocument();
    expect(card1).toBeInTheDocument();
    expect(card2).toBeInTheDocument();
    expect(card3).toBeInTheDocument();
    expect(screen.queryByTestId('testimonial-card-4')).not.toBeInTheDocument();

    // Verify dark theme classes
    const backFace = screen.getByTestId('card-back-0');
    expect(backFace.className).toContain('bg-[#0f1117]');
    expect(backFace.className).toContain('text-white');

    const frontFace = screen.getByTestId('card-front-0');
    expect(frontFace.className).toContain('bg-[#0f1117]');
    expect(frontFace.className).toContain('text-white');
  });

  it('initially displays the BACK side of all four cards with logos and company names', () => {
    render(<TestimonialsSection />);

    // Verify all four cards are initially not flipped
    for (let i = 0; i < 4; i++) {
      const card = screen.getByTestId(`testimonial-card-${i}`);
      const inner = card.querySelector('[data-flipped]');
      expect(inner).toHaveAttribute('data-flipped', 'false');

      const backFace = screen.getByTestId(`card-back-${i}`);
      expect(backFace).not.toHaveAttribute('aria-hidden');

      const frontFace = screen.getByTestId(`card-front-${i}`);
      expect(frontFace).toHaveAttribute('aria-hidden', 'true');
    }

    // Company names visible on the back face
    expect(screen.getAllByText('Udhyog Saathi').length).toBeGreaterThan(0);
    expect(screen.getAllByText('InsightLoop').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Studio Parallel').length).toBeGreaterThan(0);
    expect(screen.getAllByText('HotReload CLI').length).toBeGreaterThan(0);
  });

  it('keeps cards showing the back for 1 second, then slowly flips ALL four cards simultaneously', () => {
    render(<TestimonialsSection />);

    // Initially unflipped
    for (let i = 0; i < 4; i++) {
      const card = screen.getByTestId(`testimonial-card-${i}`);
      expect(card.querySelector('[data-flipped]')).toHaveAttribute('data-flipped', 'false');
    }

    // Simulate intersection entry (shared trigger)
    act(() => {
      if (intersectionCallback) {
        intersectionCallback(
          [
            {
              isIntersecting: true,
              intersectionRatio: 0.3,
              target: document.createElement('section'),
              boundingClientRect: {} as DOMRectReadOnly,
              intersectionRect: {} as DOMRectReadOnly,
              rootBounds: null,
              time: Date.now(),
            },
          ],
          {} as IntersectionObserver
        );
      }
    });

    // Observer disconnected immediately after trigger to avoid repeated firing
    expect(disconnectMock).toHaveBeenCalled();

    // At 500ms (during the 1s delay), cards STILL show the back face
    act(() => {
      vi.advanceTimersByTime(500);
    });
    for (let i = 0; i < 4; i++) {
      const card = screen.getByTestId(`testimonial-card-${i}`);
      expect(card.querySelector('[data-flipped]')).toHaveAttribute('data-flipped', 'false');
    }

    // At 1000ms, the timer fires and ALL FOUR CARDS flip together
    act(() => {
      vi.advanceTimersByTime(500);
    });

    for (let i = 0; i < 4; i++) {
      const card = screen.getByTestId(`testimonial-card-${i}`);
      const inner = card.querySelector('[data-flipped]');
      expect(inner).toHaveAttribute('data-flipped', 'true');
      expect(inner?.className).toContain('duration-[1400ms]');

      const backFace = screen.getByTestId(`card-back-${i}`);
      expect(backFace).toHaveAttribute('aria-hidden', 'true');

      const frontFace = screen.getByTestId(`card-front-${i}`);
      expect(frontFace).not.toHaveAttribute('aria-hidden');
    }

    // Front testimonial content revealed with light text
    expect(
      screen.getByText(/Working with Krishna was seamless from initial discovery/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Client Partner')).toBeInTheDocument();
    expect(screen.getByText('Technical Lead')).toBeInTheDocument();
    expect(screen.getByText('Creative Director')).toBeInTheDocument();
    expect(screen.getByText('Systems Architect')).toBeInTheDocument();
  });

  it('reveals front face immediately without 3D animation when prefers-reduced-motion is active', () => {
    // Mock reduced motion enabled
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<TestimonialsSection />);

    // With reduced motion, cards are flipped immediately without delay or 3D transition
    for (let i = 0; i < 4; i++) {
      const card = screen.getByTestId(`testimonial-card-${i}`);
      const inner = card.querySelector('[data-flipped]');
      expect(inner).toHaveAttribute('data-flipped', 'true');
      expect(inner?.className).toContain('transition-none');
    }
  });

  it('positions TestimonialsSection between Projects and Services on HomePage', () => {
    const { container } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const projectsEl = container.querySelector('#projects');
    const testimonialsEl = container.querySelector('#testimonials');
    const servicesEl = container.querySelector('#services');

    expect(projectsEl).toBeInTheDocument();
    expect(testimonialsEl).toBeInTheDocument();
    expect(servicesEl).toBeInTheDocument();

    // Verify DOM order: Projects -> Testimonials -> Services
    if (projectsEl && testimonialsEl && servicesEl) {
      const isAfterProjects =
        Boolean(projectsEl.compareDocumentPosition(testimonialsEl) & Node.DOCUMENT_POSITION_FOLLOWING);
      const isBeforeServices =
        Boolean(testimonialsEl.compareDocumentPosition(servicesEl) & Node.DOCUMENT_POSITION_FOLLOWING);

      expect(isAfterProjects).toBe(true);
      expect(isBeforeServices).toBe(true);
    }
  });
});
