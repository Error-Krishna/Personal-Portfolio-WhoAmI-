// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProjectDetailPage } from '../../src/pages/ProjectDetailPage.js';

describe('ProjectDetailPage Component', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders project detail page with split hero, intro, and video placeholder', () => {
    render(
      <MemoryRouter initialEntries={['/work/udhyog-saathi']}>
        <Routes>
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Title and label
    expect(screen.getByRole('heading', { name: /UDHYOG SAATHI/i })).toBeInTheDocument();
    expect(screen.getByText(/PROJECT \/ 01/i)).toBeInTheDocument();

    // Action buttons
    expect(screen.getByRole('link', { name: /View Live Product/i })).toHaveAttribute(
      'href',
      'https://udhyogsaathi.in/'
    );
    expect(screen.getByRole('link', { name: /View Source Code/i })).toBeInTheDocument();

    // Video placeholder status
    expect(screen.getByText('PRODUCT WALKTHROUGH COMING SOON')).toBeInTheDocument();

    // Case study sections
    expect(screen.getByRole('tab', { name: /01 OVERVIEW/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /02 FEATURES/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /03 ARCHITECTURE/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /04 MY ROLE/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /05 OUTCOMES/i })).toBeInTheDocument();

    // Stats
    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.getByText('Core Modules')).toBeInTheDocument();
  });

  it('renders top navigation with Next Project link dynamically', () => {
    render(
      <MemoryRouter initialEntries={['/work/udhyog-saathi']}>
        <Routes>
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const backLink = screen.getByRole('link', { name: /Back to Projects/i });
    expect(backLink).toHaveAttribute('href', '/#projects');

    const nextLink = screen.getByRole('link', { name: /Next Project/i });
    expect(nextLink).toHaveAttribute('href', '/work/insightloop');
  });

  it('renders other projects direct navigation excluding current project', () => {
    render(
      <MemoryRouter initialEntries={['/work/udhyog-saathi']}>
        <Routes>
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('OTHER PROJECTS')).toBeInTheDocument();
    expect(screen.getByText("Explore other things I've built.")).toBeInTheDocument();

    // InsightLoop is in other projects
    expect(screen.getAllByText('InsightLoop').length).toBeGreaterThan(0);
  });

  it('handles projects without liveUrl safely without broken links', () => {
    render(
      <MemoryRouter initialEntries={['/work/hotreload']}>
        <Routes>
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // HotReload has no liveUrl configured, so View Live Product link should not be rendered
    expect(screen.queryByRole('link', { name: /View Live Product/i })).not.toBeInTheDocument();
    // But it does have githubUrl and demoUrl
    expect(screen.getByRole('link', { name: /View Source Code/i })).toBeInTheDocument();
    expect(screen.getByTitle('View Walkthrough Demo')).toBeInTheDocument();
  });

  it('supports canonical /project/:slug route alias', () => {
    render(
      <MemoryRouter initialEntries={['/project/insightloop']}>
        <Routes>
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /INSIGHTLOOP/i })).toBeInTheDocument();
  });

  it('switches content panels interactively when tab buttons are selected', () => {
    render(
      <MemoryRouter initialEntries={['/work/udhyog-saathi']}>
        <Routes>
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Initial default tab is OVERVIEW
    const overviewTab = screen.getByRole('tab', { name: /01 OVERVIEW/i });
    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.getByText('Core Modules')).toBeInTheDocument();

    // Click FEATURES tab
    const featuresTab = screen.getByRole('tab', { name: /02 FEATURES/i });
    fireEvent.click(featuresTab);

    expect(featuresTab).toHaveAttribute('aria-selected', 'true');
    expect(overviewTab).toHaveAttribute('aria-selected', 'false');
    // Overview stats should NO LONGER be rendered in the active panel
    expect(screen.queryByText('Core Modules')).not.toBeInTheDocument();
    // Features headline should be rendered
    expect(
      screen.getByRole('heading', { name: /CORE CAPABILITIES & WORKFLOWS/i })
    ).toBeInTheDocument();

    // Click MY ROLE tab
    const roleTab = screen.getByRole('tab', { name: /04 MY ROLE/i });
    fireEvent.click(roleTab);

    expect(roleTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: /ENGINEERING CONTRIBUTIONS/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /CORE CAPABILITIES & WORKFLOWS/i })
    ).not.toBeInTheDocument();
  });

  it('supports keyboard arrow keys for tab switching', () => {
    render(
      <MemoryRouter initialEntries={['/work/udhyog-saathi']}>
        <Routes>
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const overviewTab = screen.getByRole('tab', { name: /01 OVERVIEW/i });
    const featuresTab = screen.getByRole('tab', { name: /02 FEATURES/i });

    // Press ArrowRight on Overview tab
    fireEvent.keyDown(overviewTab, { key: 'ArrowRight' });

    expect(featuresTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders 404 state for unknown or missing project slug', () => {
    render(
      <MemoryRouter initialEntries={['/work/non-existent-project']}>
        <Routes>
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('404 — PROJECT NOT FOUND')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /PROJECT NOT FOUND/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /RETURN TO PROJECTS/i })).toBeInTheDocument();
  });
});
