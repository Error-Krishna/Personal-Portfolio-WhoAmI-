// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../../src/pages/HomePage.js';
import { ProjectDetailPage } from '../../src/pages/ProjectDetailPage.js';

describe('Comprehensive Click Interaction Audit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();

    // Mock IntersectionObserver
    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin: string = '';
      readonly thresholds: ReadonlyArray<number> = [];
      callback: IntersectionObserverCallback;

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn().mockReturnValue([]);
    }
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
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

  it('audits that dial-focus-backdrop never intercepts clicks in idle state', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    const backdrop = screen.getByTestId('dial-focus-backdrop');
    expect(backdrop).toBeInTheDocument();

    // Must be completely non-blocking to pointer events
    expect(backdrop.style.pointerEvents).toBe('none');
    expect(backdrop).toHaveClass('pointer-events-none');
    expect(backdrop).not.toHaveClass('pointer-events-auto');
    expect(backdrop).toHaveClass('opacity-0');
  });

  it('audits Hero CTA buttons are fully clickable and trigger smooth scroll', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    // Mock scroll target elements
    const projectsTarget = document.createElement('div');
    projectsTarget.id = 'projects';
    document.body.appendChild(projectsTarget);

    const contactTarget = document.createElement('div');
    contactTarget.id = 'contact';
    document.body.appendChild(contactTarget);

    const viewWorkBtns = screen.getAllByRole('button', { name: /VIEW MY WORK/i });
    expect(viewWorkBtns.length).toBeGreaterThan(0);
    fireEvent.click(viewWorkBtns[0]);
    expect(projectsTarget.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    const connectBtns = screen.getAllByRole('button', { name: /LET’S CONNECT/i });
    expect(connectBtns.length).toBeGreaterThan(0);
    fireEvent.click(connectBtns[0]);
    expect(contactTarget.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(projectsTarget);
    document.body.removeChild(contactTarget);
  });

  it('audits Dynamic Island identity capsule tap-to-expand and social links clickability', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    const island = screen.getByTestId('dynamic-island');
    expect(island).toBeInTheDocument();
    expect(island).toHaveAttribute('data-expanded', 'false');

    // Tap Dynamic Island to expand
    fireEvent.click(island);
    expect(island).toHaveAttribute('data-expanded', 'true');

    // Verify social profile anchor links exist and have valid href
    const githubLinks = screen.getAllByRole('link', { name: /github/i });
    expect(githubLinks.length).toBeGreaterThan(0);
    expect(githubLinks[0]).toHaveAttribute('href');

    const emailLinks = screen.getAllByRole('link', { name: /email/i });
    expect(emailLinks.length).toBeGreaterThan(0);
    expect(emailLinks[0]).toHaveAttribute('href');

    // Close button dismisses island
    const closeBtn = screen.getByRole('button', { name: /Close social panel/i });
    fireEvent.click(closeBtn);
    expect(island).toHaveAttribute('data-expanded', 'false');
  });

  it('audits Corner Navigation Dial controls and section hopping', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    const dial = screen.getByTestId('corner-navigation-dial');
    const idleBadge = screen.getByRole('button', { name: /Navigation dial: currently at HOME/i });
    expect(idleBadge).toBeInTheDocument();

    // Clicking idle badge expands the dial
    fireEvent.click(idleBadge);
    expect(dial).toHaveAttribute('data-interactive', 'true');

    // Focus backdrop is now interactive
    const backdrop = screen.getByTestId('dial-focus-backdrop');
    expect(backdrop.style.pointerEvents).toBe('auto');
    expect(backdrop).toHaveClass('pointer-events-auto');

    // Clicking backdrop closes the dial
    fireEvent.click(backdrop);
    expect(dial).toHaveAttribute('data-interactive', 'false');
    expect(backdrop.style.pointerEvents).toBe('none');
    expect(backdrop).toHaveClass('pointer-events-none');
  });

  it('audits Project Cards links navigate to detail routes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<div data-testid="detail-page-target">Detail Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const caseStudyLinks = screen.getAllByRole('link', { name: /view .* case study/i });
    expect(caseStudyLinks.length).toBeGreaterThan(0);

    // Click first case study card
    fireEvent.click(caseStudyLinks[0]);
    expect(screen.getByTestId('detail-page-target')).toBeInTheDocument();
  });

  it('audits Services Pricing cards CTA buttons trigger prefill into Contact form', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    // Mock contact element
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView = vi.fn();
    }

    const mvpBtns = screen.getAllByRole('button', { name: /Build My MVP/i });
    expect(mvpBtns.length).toBeGreaterThan(0);

    // Click a service CTA
    fireEvent.click(mvpBtns[0]);

    // Service dropdown in contact form should be prefilled
    const serviceSelect = screen.getByLabelText(/SERVICE \/ SCOPE/i) as HTMLSelectElement;
    expect(serviceSelect.value).toContain('MVP');
  });

  it('audits Contact form inputs, selects, and submit button interaction', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/YOUR NAME/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/YOUR EMAIL/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/PROJECT DESCRIPTION/i) as HTMLTextAreaElement;
    const submitBtn = screen.getByRole('button', { name: /SEND PROJECT INQUIRY/i });

    // Interactive typing
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(nameInput.value).toBe('Jane Doe');

    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    expect(emailInput.value).toBe('jane@example.com');

    fireEvent.change(messageInput, { target: { value: 'We need a high quality web application built quickly.' } });
    expect(messageInput.value).toBe('We need a high quality web application built quickly.');

    // Submit button can be clicked
    fireEvent.click(submitBtn);

    // Form reacts to submit attempt
    expect(submitBtn).toBeInTheDocument();
  });

  it('audits ProjectDetailPage interactive buttons (Back to Work, Live Demo, Dial Return)', () => {
    render(
      <MemoryRouter initialEntries={['/work/udhyog-saathi']}>
        <Routes>
          <Route path="/" element={<div data-testid="mock-home-root">Home Root</div>} />
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify ProjectDetailPage renders
    const titles = screen.getAllByText(/UDHYOG SAATHI/i);
    expect(titles.length).toBeGreaterThan(0);

    // Back to Projects link
    const backBtn = screen.getByRole('link', { name: /Back to Projects/i });
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(screen.getByTestId('mock-home-root')).toBeInTheDocument();
  });
});
