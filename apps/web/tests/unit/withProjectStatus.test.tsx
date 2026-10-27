// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import {
  withProjectStatus,
  ProjectStatusBadge,
  normalizeProjectStatus,
} from '../../src/components/projects/withProjectStatus.js';
import { ProjectCard, ProjectCardWithStatus } from '../../src/components/projects/ProjectCard.js';
import { getPublishedProjects, type ProjectItem } from '../../src/lib/config/site-config.js';

describe('withProjectStatus Higher-Order Component & Status Badges', () => {
  afterEach(() => {
    cleanup();
  });

  const mockProject: ProjectItem = {
    id: 'test-app',
    slug: 'test-app',
    title: 'Test Application',
    subtitle: 'A test project for HOC verification',
    shortDescription: 'Testing project card HOC wrapper and status badges.',
    category: 'FULL-STACK',
    status: 'in-development',
    featured: false,
    technologies: ['React', 'TypeScript'],
    role: 'Lead Engineer',
    date: '2026',
    overview: 'Test overview description',
    problem: 'Test problem',
    solution: 'Test solution',
    features: ['Feature 1', 'Feature 2'],
  };

  it('1. renders the original wrapped project card cleanly', () => {
    const EnhancedCard = withProjectStatus(ProjectCard);
    render(
      <BrowserRouter>
        <EnhancedCard project={mockProject} index={0} />
      </BrowserRouter>
    );

    // Title and short description from original card must render
    expect(screen.getByRole('heading', { name: 'Test Application' })).toBeInTheDocument();
    expect(
      screen.getAllByText('Testing project card HOC wrapper and status badges.').length
    ).toBeGreaterThan(0);
  });

  it('2. preserves all original card props (index, featuredHighlight, role)', () => {
    const EnhancedCard = withProjectStatus(ProjectCard);
    render(
      <BrowserRouter>
        <EnhancedCard project={mockProject} index={4} featuredHighlight={true} />
      </BrowserRouter>
    );

    // Featured label with role should render
    expect(screen.getByText(/FEATURED · Lead Engineer/i)).toBeInTheDocument();

    // Flip card back should have formatted index '05'
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('3. displays "In Development" when status is in-development', () => {
    const projectInDev: ProjectItem = { ...mockProject, status: 'In Development' };
    const EnhancedCard = withProjectStatus(ProjectCard);

    render(
      <BrowserRouter>
        <EnhancedCard project={projectInDev} index={0} />
      </BrowserRouter>
    );

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('In Development');
    expect(badge).toHaveAttribute('data-project-status', 'in-development');
    expect(badge).toHaveAttribute('aria-label', 'Project status: In Development');
  });

  it('4. displays "Prototype" when status is prototype', () => {
    const projectProto: ProjectItem = { ...mockProject, status: 'Working Prototype' };
    const EnhancedCard = withProjectStatus(ProjectCard);

    render(
      <BrowserRouter>
        <EnhancedCard project={projectProto} index={0} />
      </BrowserRouter>
    );

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Prototype');
    expect(badge).toHaveAttribute('data-project-status', 'prototype');
    expect(badge).toHaveAttribute('aria-label', 'Project status: Prototype');
  });

  it('5. displays "Completed" when status is completed', () => {
    const projectCompleted: ProjectItem = { ...mockProject, status: 'Shipped' };
    const EnhancedCard = withProjectStatus(ProjectCard);

    render(
      <BrowserRouter>
        <EnhancedCard project={projectCompleted} index={0} />
      </BrowserRouter>
    );

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Completed');
    expect(badge).toHaveAttribute('data-project-status', 'completed');
    expect(badge).toHaveAttribute('aria-label', 'Project status: Completed');
  });

  it('6. handles missing or empty status values gracefully without breaking rendering', () => {
    const projectWithoutStatus: ProjectItem = { ...mockProject, status: '' };
    const EnhancedCard = withProjectStatus(ProjectCard);

    render(
      <BrowserRouter>
        <EnhancedCard project={projectWithoutStatus} index={0} />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Test Application' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('7. safely handles invalid status values and prop override', () => {
    // Normalization returns undefined for unknown strings
    expect(normalizeProjectStatus('unknown-status-xyz')).toBeUndefined();
    expect(normalizeProjectStatus(null)).toBeUndefined();
    expect(normalizeProjectStatus(undefined)).toBeUndefined();

    // Prop override takes precedence over project.status
    const EnhancedCard = withProjectStatus(ProjectCard);
    render(
      <BrowserRouter>
        <EnhancedCard
          project={{ ...mockProject, status: 'Completed' }}
          status="in-development"
          index={0}
        />
      </BrowserRouter>
    );

    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('In Development');
  });

  it('8. confirms Personal Finance Tracker is completely removed from published projects catalog', () => {
    const published = getPublishedProjects();
    const pft = published.find(
      (p) => p.slug === 'personal-finance-tracker' || p.id === 'personal-finance-tracker'
    );
    expect(pft).toBeUndefined();
    expect(published.length).toBe(9);
  });

  it('9. confirms remaining 9 projects are present and correctly ordered', () => {
    const published = getPublishedProjects();
    expect(published.map((p) => p.slug)).toEqual([
      'udhyog-saathi',
      'insightloop',
      'lucid',
      'alpha-vault',
      'parallel',
      'mern-starter',
      'hotreload',
      'job-automation',
      'krishna-portfolio',
    ]);
  });

  it('10. verifies existing project links and card interactions still work with HOC', () => {
    render(
      <BrowserRouter>
        <ProjectCardWithStatus project={mockProject} index={0} />
      </BrowserRouter>
    );

    const cardLinks = screen.getAllByRole('link', { name: /View Test Application case study/i });
    expect(cardLinks.length).toBeGreaterThan(0);
    expect(cardLinks[0]).toHaveAttribute('href', '/work/test-app');
  });

  it('11. avoids rendering duplicate status badges', () => {
    render(
      <BrowserRouter>
        <ProjectCardWithStatus project={mockProject} index={0} />
      </BrowserRouter>
    );

    const badges = screen.getAllByRole('status');
    expect(badges.length).toBe(1);
  });

  it('12. allows suppressing the status badge via showStatusBadge={false}', () => {
    render(
      <BrowserRouter>
        <ProjectCardWithStatus project={mockProject} index={0} showStatusBadge={false} />
      </BrowserRouter>
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
