// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { HandwrittenAnnotations } from '../../src/components/hero/HandwrittenAnnotations.js';

describe('HandwrittenAnnotations Component', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders with pointer-events-none and aria-hidden="true" to preserve accessibility & avoid intercepting clicks', () => {
    render(<HandwrittenAnnotations />);

    const container = screen.getByTestId('handwritten-annotations');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('aria-hidden', 'true');
    expect(container).toHaveClass('pointer-events-none');
  });

  it('renders the Dynamic Island desktop annotation with "Say hello ↗" and curved SVG arrow', () => {
    render(<HandwrittenAnnotations />);

    const islandDesktop = screen.getByTestId('annotation-dynamic-island-desktop');
    expect(islandDesktop).toBeInTheDocument();
    expect(islandDesktop).toHaveClass('pointer-events-none');
    expect(islandDesktop).toHaveTextContent(/Say hello ↗/i);

    const svg = islandDesktop.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');

    const arrowPath = svg?.querySelector('path.animate-annotation-arrow');
    expect(arrowPath).toBeInTheDocument();
    expect(arrowPath).toHaveAttribute('d', 'M 2 16 C 14 18, 28 13, 39 5');
  });

  it('renders the Dynamic Island mobile annotation variant with "Say hello ↗"', () => {
    render(<HandwrittenAnnotations />);

    const islandMobile = screen.getByTestId('annotation-dynamic-island-mobile');
    expect(islandMobile).toBeInTheDocument();
    expect(islandMobile).toHaveClass('sm:hidden');
    expect(islandMobile).toHaveTextContent(/Say hello ↗/i);

    const svg = islandMobile.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders the Corner Navigation Dial annotation with "Take a look around" pointing toward the dial', () => {
    render(<HandwrittenAnnotations />);

    const dialAnnotation = screen.getByTestId('annotation-nav-dial');
    expect(dialAnnotation).toBeInTheDocument();
    expect(dialAnnotation).toHaveClass('hidden', 'md:flex', 'pointer-events-none');
    expect(dialAnnotation).toHaveTextContent(/Take a look around/i);

    const svg = dialAnnotation.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');

    const arrowPath = svg?.querySelector('path.animate-annotation-arrow');
    expect(arrowPath).toBeInTheDocument();
    expect(arrowPath).toHaveAttribute('d', 'M 3 19 C 16 19, 28 14, 40 5');
  });

  it('applies handwritten typography and entrance animation classes', () => {
    render(<HandwrittenAnnotations />);

    const labels = screen.getAllByText(/Say hello ↗/i);
    labels.forEach((label) => {
      expect(label).toHaveClass('font-handwriting');
      expect(label).toHaveClass('animate-annotation-label');
    });

    const dialLabel = screen.getByText(/Take a look around/i);
    expect(dialLabel).toHaveClass('font-handwriting');
    expect(dialLabel).toHaveClass('animate-annotation-label');
  });
});
