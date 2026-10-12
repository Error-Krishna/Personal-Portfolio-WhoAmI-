// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ScrollPortraitTransition } from '../../src/components/transition/ScrollPortraitTransition.js';
import { HeroSection } from '../../src/components/hero/HeroSection.js';
import { AboutSection } from '../../src/components/about/AboutSection.js';

describe('ScrollPortraitTransition Component', () => {
  beforeEach(() => {
    // Mock matchMedia
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

    // Mock window inner dimensions
    window.innerWidth = 1440;
    window.innerHeight = 900;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders null when slots are not ready', () => {
    const { container } = render(<ScrollPortraitTransition />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly alongside HeroSection and AboutSection in document flow', () => {
    const onReadyChange = vi.fn();

    const { container } = render(
      <main>
        <HeroSection hideStaticPortrait={false} />
        <AboutSection hideStaticPortrait={false} />
        <ScrollPortraitTransition onReadyChange={onReadyChange} />
      </main>
    );

    // Verify hero portrait slot exists in Hero
    const heroSlot = container.querySelector('#hero-portrait-slot');
    expect(heroSlot).toBeInTheDocument();

    // Verify about portrait slot exists in About
    const aboutSlot = container.querySelector('#about-portrait-slot');
    expect(aboutSlot).toBeInTheDocument();
  });
});
