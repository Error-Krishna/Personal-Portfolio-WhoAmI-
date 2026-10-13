// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {
  CornerNavigationDial,
  DIAL_DESTINATIONS,
} from '../../src/components/navigation/CornerNavigationDial.js';

describe('CornerNavigationDial Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
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

  it('renders top-right quarter circle dial with all 7 destinations configured', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <CornerNavigationDial />
      </MemoryRouter>
    );

    const dial = screen.getByTestId('corner-navigation-dial');
    expect(dial).toBeInTheDocument();
    expect(dial).toHaveClass('fixed', 'top-0', 'right-0');

    // Check all 7 destinations exist in DIAL_DESTINATIONS
    expect(DIAL_DESTINATIONS).toHaveLength(7);
    const expectedLabels = ['HOME', 'ABOUT', 'WORK', 'SERVICES', 'PROCESS', 'SKILLS', 'CONTACT'];
    expect(DIAL_DESTINATIONS.map((d) => d.label)).toEqual(expectedLabels);

    // Initial active section is 'hero'
    expect(dial).toHaveAttribute('data-active-section', 'hero');
    expect(dial).toHaveAttribute('data-preview-section', 'hero');

    // Compact idle status badge is present
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('HOME')).toBeInTheDocument();
  });

  it('expands into interactive mode on hover and reveals focus backdrop overlay', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <CornerNavigationDial />
      </MemoryRouter>
    );

    const dial = screen.getByTestId('corner-navigation-dial');
    const backdrop = screen.getByTestId('dial-focus-backdrop');

    expect(dial).toHaveAttribute('data-interactive', 'false');
    expect(backdrop).toHaveClass('opacity-0');

    // Hover dial
    fireEvent.mouseEnter(dial);

    expect(dial).toHaveAttribute('data-interactive', 'true');
    expect(backdrop).toHaveClass('opacity-100');

    // Labels for all sections are rendered
    for (const dest of DIAL_DESTINATIONS) {
      const elements = screen.getAllByText(dest.label);
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toBeInTheDocument();
    }
  });

  it('behaves as scrub-to-select: needle previews destinations without navigating until scroll settles', () => {
    const onTransitionChange = vi.fn();

    // Create target section elements in DOM
    const aboutElement = document.createElement('section');
    aboutElement.id = 'about';
    const contactElement = document.createElement('section');
    contactElement.id = 'contact';
    document.body.appendChild(aboutElement);
    document.body.appendChild(contactElement);

    render(
      <MemoryRouter initialEntries={['/']}>
        <CornerNavigationDial onTransitionChange={onTransitionChange} />
      </MemoryRouter>
    );

    const dial = screen.getByTestId('corner-navigation-dial');

    // 1. Initial state: on HOME
    expect(dial).toHaveAttribute('data-active-section', 'hero');
    expect(dial).toHaveAttribute('data-preview-section', 'hero');

    // 2. Scroll downward once over the dial
    fireEvent.wheel(dial, { deltaY: 50 });

    // Needle moves to ABOUT in preview, but actual section remains HOME
    expect(dial).toHaveAttribute('data-preview-section', 'about');
    expect(dial).toHaveAttribute('data-active-section', 'hero');
    expect(dial).toHaveAttribute('data-scrubbing', 'true');

    // STRICT CHECK: page must NOT navigate or scroll while scrubbing
    expect(aboutElement.scrollIntoView).not.toHaveBeenCalled();
    expect(onTransitionChange).not.toHaveBeenCalled();

    // 3. Continue scrolling down through all destinations to CONTACT
    for (let i = 0; i < 6; i++) {
      act(() => {
        vi.advanceTimersByTime(90); // Advance past 80ms step cooldown
      });
      fireEvent.wheel(dial, { deltaY: 50 });
    }

    // Needle now points to CONTACT in preview, but page is STILL on HOME
    expect(dial).toHaveAttribute('data-preview-section', 'contact');
    expect(dial).toHaveAttribute('data-active-section', 'hero');
    expect(contactElement.scrollIntoView).not.toHaveBeenCalled();
    expect(onTransitionChange).not.toHaveBeenCalled();

    // 4. User stops scrolling: wait for 300ms debounce settle interval
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // 5. Navigation commits: exactly ONE whoosh transition and smooth scroll
    expect(onTransitionChange).toHaveBeenCalledTimes(1);
    expect(onTransitionChange).toHaveBeenCalledWith(true);
    expect(contactElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    // 6. Transition settles after 650ms
    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(onTransitionChange).toHaveBeenCalledWith(false);
    expect(dial).toHaveAttribute('data-active-section', 'contact');

    document.body.removeChild(aboutElement);
    document.body.removeChild(contactElement);
  });

  it('does not navigate if user scrolls and returns to current active section', () => {
    const onTransitionChange = vi.fn();
    render(
      <MemoryRouter initialEntries={['/']}>
        <CornerNavigationDial onTransitionChange={onTransitionChange} />
      </MemoryRouter>
    );

    const dial = screen.getByTestId('corner-navigation-dial');

    // Scroll down to ABOUT
    fireEvent.wheel(dial, { deltaY: 50 });
    expect(dial).toHaveAttribute('data-preview-section', 'about');

    // Scroll back up to HOME before settle timer fires
    act(() => {
      vi.advanceTimersByTime(90);
    });
    fireEvent.wheel(dial, { deltaY: -50 });
    expect(dial).toHaveAttribute('data-preview-section', 'hero');

    // Settle timer expires
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Since previewed section is already the active section, no navigation occurs
    expect(onTransitionChange).not.toHaveBeenCalled();
    expect(dial).toHaveAttribute('data-active-section', 'hero');
  });

  it('cancels uncommitted preview and restores actual section if pointer leaves dial before settle', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <CornerNavigationDial />
      </MemoryRouter>
    );

    const dial = screen.getByTestId('corner-navigation-dial');
    fireEvent.mouseEnter(dial);

    // Scroll to ABOUT
    fireEvent.wheel(dial, { deltaY: 50 });
    expect(dial).toHaveAttribute('data-preview-section', 'about');

    // Pointer leaves dial before settle timer expires
    fireEvent.mouseLeave(dial);

    // Preview is cancelled and needle reverts to actual section ('hero')
    expect(dial).toHaveAttribute('data-preview-section', 'hero');
    expect(dial).toHaveAttribute('data-active-section', 'hero');
  });

  it('supports keyboard navigation: Arrow keys preview, Enter commits, Escape cancels', () => {
    const onTransitionChange = vi.fn();
    const aboutElement = document.createElement('section');
    aboutElement.id = 'about';
    document.body.appendChild(aboutElement);

    render(
      <MemoryRouter initialEntries={['/']}>
        <CornerNavigationDial onTransitionChange={onTransitionChange} />
      </MemoryRouter>
    );

    const dial = screen.getByTestId('corner-navigation-dial');
    fireEvent.mouseEnter(dial);

    // Arrow Down previews next destination without navigating
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(dial).toHaveAttribute('data-preview-section', 'about');
    expect(dial).toHaveAttribute('data-active-section', 'hero');
    expect(aboutElement.scrollIntoView).not.toHaveBeenCalled();

    // Escape cancels preview
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(dial).toHaveAttribute('data-preview-section', 'hero');

    // Arrow Down again then Enter to commit
    fireEvent.mouseEnter(dial);
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(dial).toHaveAttribute('data-preview-section', 'about');

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onTransitionChange).toHaveBeenCalledWith(true);
    expect(aboutElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(aboutElement);
  });

  it('direct clicks commit immediately without waiting for scroll settle timer', () => {
    const onTransitionChange = vi.fn();
    const targetElement = document.createElement('section');
    targetElement.id = 'projects';
    document.body.appendChild(targetElement);

    render(
      <MemoryRouter initialEntries={['/']}>
        <CornerNavigationDial onTransitionChange={onTransitionChange} />
      </MemoryRouter>
    );

    const dial = screen.getByTestId('corner-navigation-dial');
    fireEvent.mouseEnter(dial);

    const workButton = screen.getByRole('button', { name: /Navigate to WORK/i });
    fireEvent.click(workButton);

    // Direct click commits immediately
    expect(onTransitionChange).toHaveBeenCalledWith(true);
    expect(dial).toHaveAttribute('data-preview-section', 'projects');
    expect(targetElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Transition completes
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(dial).toHaveAttribute('data-active-section', 'projects');
    expect(onTransitionChange).toHaveBeenCalledWith(false);

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

  it('respects prefers-reduced-motion preference without smooth scrolling delays', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const onTransitionChange = vi.fn();
    const targetElement = document.createElement('section');
    targetElement.id = 'contact';
    document.body.appendChild(targetElement);

    render(
      <MemoryRouter initialEntries={['/']}>
        <CornerNavigationDial onTransitionChange={onTransitionChange} />
      </MemoryRouter>
    );

    const dial = screen.getByTestId('corner-navigation-dial');
    fireEvent.mouseEnter(dial);

    const contactBtn = screen.getByRole('button', { name: /Navigate to CONTACT/i });
    fireEvent.click(contactBtn);

    // Reduced motion behavior uses 'auto'
    expect(targetElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto' });
    expect(onTransitionChange).toHaveBeenCalledWith(false);

    document.body.removeChild(targetElement);
  });

  it('guarantees dial-focus-backdrop has pointer-events: none in idle mode to prevent intercepting page clicks', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <CornerNavigationDial />
      </MemoryRouter>
    );

    const backdrop = screen.getByTestId('dial-focus-backdrop');
    // In idle mode, backdrop MUST NOT have pointer-events-auto
    expect(backdrop).not.toHaveClass('pointer-events-auto');
    expect(backdrop).toHaveClass('pointer-events-none');
    expect(backdrop.style.pointerEvents).toBe('none');

    // On hover, backdrop enters interactive mode
    const dial = screen.getByTestId('corner-navigation-dial');
    fireEvent.mouseEnter(dial);

    expect(backdrop).toHaveClass('pointer-events-auto');
    expect(backdrop).not.toHaveClass('pointer-events-none');
    expect(backdrop.style.pointerEvents).toBe('auto');

    // Clicking the backdrop dismisses it and restores pointer-events: none
    fireEvent.click(backdrop);

    expect(backdrop).not.toHaveClass('pointer-events-auto');
    expect(backdrop).toHaveClass('pointer-events-none');
    expect(backdrop.style.pointerEvents).toBe('none');
  });
});

