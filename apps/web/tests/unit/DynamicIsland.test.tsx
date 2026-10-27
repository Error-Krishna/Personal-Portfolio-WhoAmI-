// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { DynamicIsland, getConfiguredSocials } from '../../src/components/layout/DynamicIsland.js';
import { siteConfig } from '../../src/lib/config/site-config.js';

describe('DynamicIsland Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('correctly parses configured social profiles from siteConfig', () => {
    const socials = getConfiguredSocials();
    expect(socials.length).toBeGreaterThan(0);

    const github = socials.find((s) => s.id === 'github');
    expect(github).toBeDefined();
    expect(github?.url).toBe(siteConfig.links.github);
    expect(github?.handle).toMatch(/@.+/);

    const linkedin = socials.find((s) => s.id === 'linkedin');
    expect(linkedin).toBeDefined();
    expect(linkedin?.url).toBe(siteConfig.links.linkedin);

    const email = socials.find((s) => s.id === 'email');
    expect(email).toBeDefined();
    expect(email?.url).toContain('mailto:');
  });

  it('renders collapsed state with identity name and does not contain section navigation links', () => {
    render(<DynamicIsland />);

    const island = screen.getByTestId('dynamic-island');
    expect(island).toBeInTheDocument();
    expect(island).toHaveAttribute('data-expanded', 'false');

    // Display name
    expect(screen.getByText('KRISHNA GOYAL')).toBeInTheDocument();

    // Verify social handle ticker is present
    const ticker = screen.getByTestId('collapsed-social-ticker');
    expect(ticker).toBeInTheDocument();

    // STRICT CHECK: dynamic island must NOT have section navigation buttons or links
    expect(screen.queryByRole('button', { name: /^01 · HOME$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^HOME$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^WORK$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^SERVICES$/i })).not.toBeInTheDocument();
  });

  it('cycles through social handles one by one over time when collapsed', () => {
    render(<DynamicIsland />);

    const socials = getConfiguredSocials();
    const firstHandle = socials[0].handle;
    const secondHandle = socials[1].handle;

    expect(screen.getByText(firstHandle)).toBeInTheDocument();

    // Advance timer past the 2800ms cycle interval + 300ms transition
    act(() => {
      vi.advanceTimersByTime(2800);
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText(secondHandle)).toBeInTheDocument();
  });

  it('expands to full social identity panel on mouse hover after intentional dwell', () => {
    render(<DynamicIsland />);

    const island = screen.getByTestId('dynamic-island');
    expect(island).toHaveAttribute('data-expanded', 'false');

    // Simulate mouse enter - not expanded immediately due to hover intent detection
    fireEvent.mouseEnter(island);
    expect(island).toHaveAttribute('data-expanded', 'false');

    // Advance timer past the 120ms intentional dwell threshold
    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(island).toHaveAttribute('data-expanded', 'true');
    expect(screen.getByTestId('expanded-social-panel')).toBeInTheDocument();

    // Expanded panel features
    expect(screen.getByText(/AVAILABLE FOR PROJECTS/i)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.personal.title)).toBeInTheDocument();

    // All configured social profiles should be visible simultaneously
    const socials = getConfiguredSocials();
    socials.forEach((social) => {
      expect(screen.getByTitle(new RegExp(social.name, 'i'))).toHaveAttribute('href', social.url);
    });
  });

  it('collapses back when mouse leaves after debounce timeout', () => {
    render(<DynamicIsland />);

    const island = screen.getByTestId('dynamic-island');

    fireEvent.mouseEnter(island);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(island).toHaveAttribute('data-expanded', 'true');

    fireEvent.mouseLeave(island);
    // Not collapsed immediately due to grace period
    expect(island).toHaveAttribute('data-expanded', 'true');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(island).toHaveAttribute('data-expanded', 'false');
  });

  it('toggles mobile expand on click, closes on outside click or Escape key', () => {
    render(<DynamicIsland />);

    const island = screen.getByTestId('dynamic-island');

    // Click to open
    fireEvent.click(island);
    expect(island).toHaveAttribute('data-expanded', 'true');

    // Press Escape to close
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(island).toHaveAttribute('data-expanded', 'false');

    // Click to open again
    fireEvent.click(island);
    expect(island).toHaveAttribute('data-expanded', 'true');

    // Click outside to close
    fireEvent.mouseDown(document.body);
    expect(island).toHaveAttribute('data-expanded', 'false');
  });
});
