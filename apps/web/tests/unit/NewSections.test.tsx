// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { SkillsSection } from '../../src/components/skills/SkillsSection.js';
import { ProjectsSection } from '../../src/components/projects/ProjectsSection.js';
import { ServicesSection } from '../../src/components/services/ServicesSection.js';
import { ExperienceSection } from '../../src/components/experience/ExperienceSection.js';
import { HowIWorkSection } from '../../src/components/process/HowIWorkSection.js';
import { TrustSection } from '../../src/components/trust/TrustSection.js';
import { ContactSection } from '../../src/components/contact/ContactSection.js';
import { Footer } from '../../src/components/layout/Footer.js';
import { HomePage } from '../../src/pages/HomePage.js';

describe('New Sections Suite', () => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('SkillsSection', () => {
    it('renders section label and build tech stack headline', () => {
      render(
        <BrowserRouter>
          <SkillsSection />
        </BrowserRouter>
      );
      expect(screen.getByText('SKILLS / 02')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /BUILD YOUR/i })).toBeInTheDocument();
      expect(screen.getByText('BUILD SOMETHING TOGETHER.')).toBeInTheDocument();
    });

    it('renders category rows and branching ecosystem nodes', () => {
      render(
        <BrowserRouter>
          <SkillsSection />
        </BrowserRouter>
      );
      expect(screen.getByRole('button', { name: /01 FRONTEND/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /02 BACKEND/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /03 DATABASES/i })).toBeInTheDocument();
      expect(screen.getAllByText(/React/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Node/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/MongoDB/i).length).toBeGreaterThan(0);
    });

    it('switches category when category button is clicked', () => {
      render(
        <BrowserRouter>
          <SkillsSection />
        </BrowserRouter>
      );
      const backendBtn = screen.getByRole('button', { name: /02 BACKEND/i });
      fireEvent.click(backendBtn);

      expect(screen.getAllByText(/BACKEND/i).length).toBeGreaterThan(0);
    });

    it('does not render the redundant custom project stack preview card', () => {
      render(
        <BrowserRouter>
          <SkillsSection />
        </BrowserRouter>
      );
      expect(screen.queryByText('CUSTOM PROJECT STACK PREVIEW')).not.toBeInTheDocument();
      expect(screen.queryByText('01 · FRONTEND')).not.toBeInTheDocument();
      expect(screen.queryByText('02 · BACKEND')).not.toBeInTheDocument();
    });

    it('renders selected technology panel and tech stack tower instead of related projects', () => {
      render(
        <BrowserRouter>
          <SkillsSection />
        </BrowserRouter>
      );
      // Selected technology default is React.js
      expect(screen.getByRole('heading', { name: 'React.js' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ADD TO STACK/i })).toBeInTheDocument();

      // Tech Stack Tower is present
      expect(screen.getByText('CUSTOM STACK TOWER')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /RESET TOWER/i })).toBeInTheDocument();

      // Related projects card has been removed
      expect(screen.queryByText('RELATED PROJECTS')).not.toBeInTheDocument();
      expect(screen.queryByText(/IN THIS BRANCH/i)).not.toBeInTheDocument();
    });

    it('stacks cylinder blocks on the tower and breaks them into pieces on reset', () => {
      render(
        <BrowserRouter>
          <SkillsSection />
        </BrowserRouter>
      );
      // Select Python
      const pythonBtn = screen.getByRole('button', { name: /Python/i });
      fireEvent.click(pythonBtn);

      // Click ADD TO STACK
      const addBtn = screen.getByRole('button', { name: /ADD TO STACK/i });
      fireEvent.click(addBtn);

      // Python block is in the tower
      expect(screen.getAllByText('Python').length).toBeGreaterThan(0);

      // Click RESET TOWER
      const resetBtn = screen.getByRole('button', { name: /RESET TOWER/i });
      fireEvent.click(resetBtn);

      expect(resetBtn).toBeInTheDocument();
    });

    it('renders bottom CTA strip', () => {
      render(
        <BrowserRouter>
          <SkillsSection />
        </BrowserRouter>
      );
      expect(screen.getByText('BUILD SOMETHING TOGETHER.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /LET'S BUILD YOURS/i })).toBeInTheDocument();
    });
  });

  describe('ProjectsSection', () => {
    it('renders editorial headline and project items', () => {
      render(
        <BrowserRouter>
          <ProjectsSection />
        </BrowserRouter>
      );
      expect(screen.getByText('PROJECTS / 01')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /THINGS I'VE BUILT/i })).toBeInTheDocument();
      expect(screen.getAllByText('Udhyog Saathi').length).toBeGreaterThan(0);
    });

    it('renders project cards across categories', () => {
      render(
        <BrowserRouter>
          <ProjectsSection />
        </BrowserRouter>
      );
      expect(screen.getAllByText('InsightLoop').length).toBeGreaterThan(0);
      expect(screen.getAllByText('HotReload').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Parallel').length).toBeGreaterThan(0);
    });
  });

  describe('ServicesSection', () => {
    it('renders services headline and packages with indicative pricing', () => {
      render(<ServicesSection />);
      expect(screen.getByText('SERVICES & PRICING')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /LET'S BUILD SOMETHING USEFUL/i })
      ).toBeInTheDocument();
      expect(screen.getAllByText('Full-Stack MVP & Product Engineering').length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\$1,200/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\$500/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Let's discuss/i).length).toBeGreaterThan(0);
    });

    it('renders key deliverables and comparison table', () => {
      render(<ServicesSection />);
      expect(screen.getAllByText(/KEY DELIVERABLES/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('heading', { name: /SERVICE COMPARISON/i })).toBeInTheDocument();
      expect(screen.getByText('VIEW DETAILED PRICING')).toBeInTheDocument();
      expect(screen.getByText('Frontend development')).toBeInTheDocument();
      expect(screen.getByText('Backend & APIs')).toBeInTheDocument();
    });
  });

  describe('ExperienceSection', () => {
    it('renders experience headline and journey entries', () => {
      render(<ExperienceSection />);
      expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
      expect(screen.getByText('MY JOURNEY SO FAR.')).toBeInTheDocument();
      expect(screen.getByText('Vellore Institute of Technology (VIT-AP)')).toBeInTheDocument();
    });
  });

  describe('HowIWorkSection', () => {
    it('renders unified heading, supporting text, 5-step connected flow, and CTA to #contact', () => {
      render(<HowIWorkSection />);
      expect(screen.getByText('HOW IT WORKS')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /HOW WE'LL WORK TOGETHER/i })).toBeInTheDocument();
      expect(
        screen.getByText(
          /A straightforward process to take your idea from the first conversation to a finished product\./i
        )
      ).toBeInTheDocument();

      // Verify all 5 steps
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /DISCOVER/i })).toBeInTheDocument();
      expect(
        screen.getByText(/We discuss your idea, goals, requirements, and budget\./i)
      ).toBeInTheDocument();

      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /PLAN/i })).toBeInTheDocument();
      expect(
        screen.getByText(
          /We define the scope, choose the right approach, and agree on deliverables and timelines\./i
        )
      ).toBeInTheDocument();

      expect(screen.getByText('03')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /BUILD/i })).toBeInTheDocument();
      expect(
        screen.getByText(/I develop your solution, share progress, and incorporate your feedback\./i)
      ).toBeInTheDocument();

      expect(screen.getByText('04')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /DELIVER/i })).toBeInTheDocument();
      expect(
        screen.getByText(
          /We test the final product, deploy it if required, and complete the handover\./i
        )
      ).toBeInTheDocument();

      expect(screen.getByText('05')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /SUPPORT/i })).toBeInTheDocument();
      expect(
        screen.getByText(/We discuss improvements, fixes, and next steps after delivery\./i)
      ).toBeInTheDocument();

      // CTA link to #contact
      const ctaLink = screen.getByRole('link', {
        name: /HAVE A PROJECT IN MIND\? LET'S TALK/i,
      });
      expect(ctaLink).toBeInTheDocument();
      expect(ctaLink).toHaveAttribute('href', '#contact');
    });
  });

  describe('TrustSection', () => {
    it('renders trust principles', () => {
      render(<TrustSection />);
      expect(screen.getByText('HOW I WORK WITH CLIENTS.')).toBeInTheDocument();
      expect(screen.getByText('Transparent & Defined Scope')).toBeInTheDocument();
      expect(screen.getByText('Production-Grade, Typed Code')).toBeInTheDocument();
    });
  });

  describe('ContactSection', () => {
    it('renders contact form fields', () => {
      render(<ContactSection />);
      expect(screen.getByLabelText(/YOUR NAME/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/YOUR EMAIL/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/PROJECT DESCRIPTION/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /SEND PROJECT INQUIRY/i })).toBeInTheDocument();
    });

    it('displays validation errors on invalid submit', () => {
      render(<ContactSection />);
      const submitBtn = screen.getByRole('button', { name: /SEND PROJECT INQUIRY/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText(/Please enter your name/i)).toBeInTheDocument();
      expect(screen.getByText(/Please provide a valid email/i)).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('renders copyright and navigation links', () => {
      render(<Footer />);
      expect(screen.getAllByText(/KRISHNA GOYAL/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/ALL RIGHTS RESERVED/i)).toBeInTheDocument();
      expect(screen.getByText(/OPEN TO FREELANCE PROJECTS/i)).toBeInTheDocument();
    });
  });

  describe('HomePage Process Section Integration', () => {
    it('renders only one combined process section on the homepage without duplicate trust section', () => {
      const { container } = render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      // Verify unified process section exists
      expect(
        screen.getByRole('heading', { name: /HOW WE'LL WORK TOGETHER/i })
      ).toBeInTheDocument();
      expect(container.querySelectorAll('#how-it-works')).toHaveLength(1);

      // Verify old separate "HOW I WORK WITH CLIENTS" headline is not present on the homepage
      expect(screen.queryByText('HOW I WORK WITH CLIENTS.')).not.toBeInTheDocument();
    });
  });
});
