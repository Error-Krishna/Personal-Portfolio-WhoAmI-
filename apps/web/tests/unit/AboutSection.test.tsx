// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { AboutSection } from '../../src/components/about/AboutSection.js';

describe('AboutSection Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders section label and main headline matching reference design', () => {
    render(<AboutSection />);

    // Section label
    expect(screen.getByText('ABOUT ME')).toBeInTheDocument();

    // Main headline lines
    expect(screen.getByText('I BUILD THINGS')).toBeInTheDocument();
    expect(screen.getByText('PEOPLE CAN USE.')).toBeInTheDocument();
  });

  it('renders personal introduction with emphasized phrases and metadata lines', () => {
    render(<AboutSection />);

    // Bold phrases
    expect(screen.getByText('Krishna Goyal')).toBeInTheDocument();
    expect(screen.getByText('VIT-AP')).toBeInTheDocument();
    expect(screen.getByText('full-stack developer')).toBeInTheDocument();
    expect(screen.getByText('video editing')).toBeInTheDocument();

    // Metadata lines
    expect(screen.getByText(/STUDENT · DEVELOPER · CREATOR/i)).toBeInTheDocument();
    expect(screen.getByText(/IDEAS → PRODUCTS → IMPACT/i)).toBeInTheDocument();
  });

  it('renders center portrait card slot with red-lit portrait image', () => {
    render(<AboutSection />);

    const portraitImg = screen.getByAltText('Krishna Goyal');
    expect(portraitImg).toBeInTheDocument();
    expect(portraitImg).toHaveAttribute('src', '/images/about-portrait-red.png');
  });

  it('renders short statement and all 6 skill tags', () => {
    render(<AboutSection />);

    // Statement
    expect(screen.getByText(/From ideas on a screen/i)).toBeInTheDocument();

    // 6 skill tags
    expect(screen.getByText('WEB APPS')).toBeInTheDocument();
    expect(screen.getByText('FULL-STACK')).toBeInTheDocument();
    expect(screen.getByText('PRODUCTS')).toBeInTheDocument();
    expect(screen.getByText('VIDEO EDITING')).toBeInTheDocument();
    expect(screen.getByText('CREATIVE')).toBeInTheDocument();
    expect(screen.getByText('AUTOMATION')).toBeInTheDocument();
  });

  it('renders vertical process indicator with 4 steps', () => {
    render(<AboutSection />);

    expect(screen.getByText('BUILD')).toBeInTheDocument();
    expect(screen.getByText('EXPERIMENT')).toBeInTheDocument();
    expect(screen.getByText('CREATE')).toBeInTheDocument();
    expect(screen.getByText('IMPROVE')).toBeInTheDocument();
  });

  it('renders minimal footer with copyright and opportunities text', () => {
    render(<AboutSection />);

    expect(screen.getByText('© 2026')).toBeInTheDocument();
    expect(screen.getByText(/BASED IN INDIA · OPEN TO OPPORTUNITIES/i)).toBeInTheDocument();
  });
});
