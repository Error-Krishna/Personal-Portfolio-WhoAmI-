// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProjectsSection } from '../../src/components/projects/ProjectsSection.js';
import { getPublishedProjects } from '../../src/lib/config/site-config.js';

describe('ProjectsSection Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders section header with editorial label, headline, and supporting text', () => {
    render(
      <BrowserRouter>
        <ProjectsSection />
      </BrowserRouter>
    );

    expect(screen.getByText('PROJECTS / 01')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /THINGS I'VE BUILT/i })).toBeInTheDocument();
    expect(
      screen.getByText('Different problems. Different products. One engineering mindset.')
    ).toBeInTheDocument();
  });

  it('renders all published projects dynamically without hardcoded counts', () => {
    render(
      <BrowserRouter>
        <ProjectsSection />
      </BrowserRouter>
    );

    const published = getPublishedProjects();
    expect(published.length).toBe(6);

    // Each project card should be rendered
    published.forEach((p) => {
      expect(screen.getAllByText(p.title).length).toBeGreaterThan(0);
    });
  });

  it('provides category filter tabs that filter projects dynamically', () => {
    render(
      <BrowserRouter>
        <ProjectsSection />
      </BrowserRouter>
    );

    const toolsBtn = screen.getByRole('button', { name: /TOOLS/i });
    expect(toolsBtn).toBeInTheDocument();

    fireEvent.click(toolsBtn);

    // HotReload is in TOOLS, so it should be visible
    expect(screen.getAllByText('HotReload').length).toBeGreaterThan(0);

    // Click ALL to restore
    const allBtn = screen.getByRole('button', { name: /ALL/i });
    fireEvent.click(allBtn);

    expect(screen.getAllByText('Udhyog Saathi').length).toBeGreaterThan(0);
  });

  it('renders flip cards with accessible links to /work/:slug', () => {
    render(
      <BrowserRouter>
        <ProjectsSection />
      </BrowserRouter>
    );

    const udhyogLink = screen.getAllByRole('link', {
      name: /View Udhyog Saathi case study/i,
    })[0];
    expect(udhyogLink).toHaveAttribute('href', '/work/udhyog-saathi');

    // Reverse side description should be present in DOM
    expect(
      screen.getByText('Turning traditional manufacturing into a digital system.')
    ).toBeInTheDocument();
  });

  it('provides touch flip preview toggle on mobile that applies is-flipped state', () => {
    const { container } = render(
      <BrowserRouter>
        <ProjectsSection />
      </BrowserRouter>
    );

    const flipInner = container.querySelector('.flip-card-inner');
    expect(flipInner).toBeInTheDocument();
    expect(flipInner).not.toHaveClass('is-flipped');

    const flipToggles = screen.getAllByTitle('Flip Card Preview');
    expect(flipToggles.length).toBeGreaterThan(0);

    // Clicking toggle adds is-flipped class
    fireEvent.click(flipToggles[0]);
    expect(flipInner).toHaveClass('is-flipped');

    // Clicking again removes is-flipped class
    fireEvent.click(flipToggles[0]);
    expect(flipInner).not.toHaveClass('is-flipped');
  });

  it('filters out unpublished projects and respects displayOrder', () => {
    const published = getPublishedProjects();
    // All returned items must have published !== false
    expect(published.every((p) => p.published !== false)).toBe(true);

    // Verify ordering by displayOrder
    for (let i = 0; i < published.length - 1; i++) {
      const orderCurrent = published[i].displayOrder ?? 999;
      const orderNext = published[i + 1].displayOrder ?? 999;
      expect(orderCurrent).toBeLessThanOrEqual(orderNext);
    }
  });
});
