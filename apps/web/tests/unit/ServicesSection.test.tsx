// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ServicesSection } from '../../src/components/services/ServicesSection.js';
import { ServicePricingCards } from '../../src/components/services/ServicePricingCards.js';
import { ServiceComparisonTable } from '../../src/components/services/ServiceComparisonTable.js';

describe('Services & Pricing Experience', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Section 1: Service Pricing Cards', () => {
    it('renders four primary cards with correct titles, categories, and key deliverables', () => {
      render(<ServicePricingCards />);

      // Section header
      expect(screen.getByText('SERVICES & PRICING')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /LET'S BUILD SOMETHING USEFUL/i })
      ).toBeInTheDocument();

      // Value props
      expect(screen.getByText('Focused Scope')).toBeInTheDocument();
      expect(screen.getByText('Transparent Pricing')).toBeInTheDocument();
      expect(screen.getByText('Post-Launch Support')).toBeInTheDocument();

      // Card 1
      expect(screen.getByText('Web Applications & Landing Pages')).toBeInTheDocument();
      expect(screen.getByText('WEB & FRONTEND')).toBeInTheDocument();
      expect(screen.getByText('$500')).toBeInTheDocument();
      expect(screen.getByText('1–2 weeks')).toBeInTheDocument();
      expect(screen.getAllByText('14 days support').length).toBeGreaterThan(0);
      expect(screen.getByText('Responsive modern UI/UX')).toBeInTheDocument();

      // Card 2 (Recommended)
      expect(screen.getByText('Full-Stack MVP & Product Engineering')).toBeInTheDocument();
      expect(screen.getByText('FULL-STACK')).toBeInTheDocument();
      expect(screen.getByText('RECOMMENDED')).toBeInTheDocument();
      expect(screen.getByText('$1,200')).toBeInTheDocument();
      expect(screen.getByText('2–4 weeks')).toBeInTheDocument();
      expect(screen.getByText('30 days support')).toBeInTheDocument();

      // Card 3
      expect(screen.getByText('Backend & REST API Engineering')).toBeInTheDocument();
      expect(screen.getByText('BACKEND & API')).toBeInTheDocument();
      expect(screen.getByText('$700')).toBeInTheDocument();
      expect(screen.getByText('1–3 weeks')).toBeInTheDocument();

      // Card 4 (Custom scope option)
      expect(screen.getByText('Custom Solutions & Consulting')).toBeInTheDocument();
      expect(screen.getByText('CUSTOM SOLUTION')).toBeInTheDocument();
      expect(screen.getByText("Let's discuss")).toBeInTheDocument();
      expect(screen.getByText('Flexible timeline')).toBeInTheDocument();
      expect(screen.getByText('Ongoing support')).toBeInTheDocument();
    });

    it('renders additional specialized capabilities compactly without losing active services', () => {
      render(<ServicePricingCards />);

      expect(screen.getByText('ADDITIONAL SPECIALIZED CAPABILITIES')).toBeInTheDocument();
      expect(screen.getByText('Automation & Internal Tools')).toBeInTheDocument();
      expect(screen.getByText('Starting at $450')).toBeInTheDocument();
      expect(screen.getByText('Creative & Video Editing')).toBeInTheDocument();
      expect(screen.getByText('Starting at $250')).toBeInTheDocument();
    });

    it('invokes onSelectService callback when CTA button is clicked', () => {
      const handleSelect = vi.fn();
      render(<ServicePricingCards onSelectService={handleSelect} />);

      const mvpBtn = screen.getByRole('button', { name: /BUILD MY MVP/i });
      fireEvent.click(mvpBtn);

      expect(handleSelect).toHaveBeenCalledWith('Full-Stack MVP & Product Engineering');
    });
  });

  describe('Section 2: Service Comparison Table', () => {
    it('renders comparison heading, criteria, and 4 primary service columns', () => {
      render(<ServiceComparisonTable />);

      // Section header
      expect(screen.getByText('COMPARISON')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /SERVICE COMPARISON/i })).toBeInTheDocument();
      expect(
        screen.getByText(
          'Compare key details at a glance to find the right service for your needs.'
        )
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /VIEW DETAILED PRICING/i })).toBeInTheDocument();

      // 9 Compact Comparison Criteria
      expect(screen.getByText('Best for')).toBeInTheDocument();
      expect(screen.getByText('Typical timeline')).toBeInTheDocument();
      expect(screen.getByText('Post-launch support')).toBeInTheDocument();
      expect(screen.getByText('Frontend development')).toBeInTheDocument();
      expect(screen.getByText('Backend & APIs')).toBeInTheDocument();
      expect(screen.getByText('Database design')).toBeInTheDocument();
      expect(screen.getByText('Authentication')).toBeInTheDocument();
      expect(screen.getByText('Third-party integrations')).toBeInTheDocument();
      expect(screen.getByText('Testing & deployment')).toBeInTheDocument();

      // Verify redundant rows have been pruned
      expect(screen.queryByText('UI/UX design')).not.toBeInTheDocument();
      expect(screen.queryByText('Ongoing maintenance')).not.toBeInTheDocument();
      expect(screen.queryByText('API documentation')).not.toBeInTheDocument();
      expect(screen.queryByText('Project-based consulting')).not.toBeInTheDocument();

      // Service Headers in Table
      expect(screen.getAllByText('Web Applications & Landing Pages').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Full-Stack MVP & Product Engineering').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Backend & REST API Engineering').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Custom Solutions & Consulting').length).toBeGreaterThan(0);
    });

    it('invokes onSelectService from table bottom CTA buttons', () => {
      const handleSelect = vi.fn();
      render(<ServiceComparisonTable onSelectService={handleSelect} />);

      const webBtn = screen.getByRole('button', { name: /DISCUSS A WEB PROJECT/i });
      fireEvent.click(webBtn);

      expect(handleSelect).toHaveBeenCalledWith('Web Applications & Landing Pages');
    });
  });

  describe('Combined ServicesSection Experience', () => {
    it('renders both Section 1 and Section 2 as distinct sections', () => {
      const { container } = render(<ServicesSection />);

      // Both sections exist
      expect(container.querySelector('#services')).toBeInTheDocument();
      expect(container.querySelector('#service-comparison')).toBeInTheDocument();

      // Headings for both exist
      expect(
        screen.getByRole('heading', { name: /LET'S BUILD SOMETHING USEFUL/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /SERVICE COMPARISON/i })).toBeInTheDocument();
    });
  });
});
