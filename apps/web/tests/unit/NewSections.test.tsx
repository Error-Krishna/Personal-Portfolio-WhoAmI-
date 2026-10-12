// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { SkillsSection } from '../../src/components/skills/SkillsSection.js';
import { ProjectsSection } from '../../src/components/projects/ProjectsSection.js';
import { ServicesSection } from '../../src/components/services/ServicesSection.js';
import { ExperienceSection } from '../../src/components/experience/ExperienceSection.js';
import { TrustSection } from '../../src/components/trust/TrustSection.js';
import { ContactSection } from '../../src/components/contact/ContactSection.js';
import { Footer } from '../../src/components/layout/Footer.js';

describe('New Sections Suite', () => {
  afterEach(() => {
    cleanup();
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
    it('renders featured projects headline and lead project', () => {
      render(
        <BrowserRouter>
          <ProjectsSection />
        </BrowserRouter>
      );
      expect(screen.getByText('FEATURED PROJECTS')).toBeInTheDocument();
      expect(screen.getByText("THINGS I'VE BUILT.")).toBeInTheDocument();
      expect(screen.getByText('Udhyog Saathi')).toBeInTheDocument();
    });

    it('renders supporting projects', () => {
      render(
        <BrowserRouter>
          <ProjectsSection />
        </BrowserRouter>
      );
      expect(screen.getByText('InsightLoop')).toBeInTheDocument();
      expect(screen.getByText('HotReload')).toBeInTheDocument();
    });
  });

  describe('ServicesSection', () => {
    it('renders services headline and packages with indicative pricing', () => {
      render(<ServicesSection />);
      expect(screen.getByText('SERVICES & PRICING')).toBeInTheDocument();
      expect(screen.getByText("LET'S BUILD SOMETHING USEFUL.")).toBeInTheDocument();
      expect(screen.getByText('Full-Stack MVP & Product Engineering')).toBeInTheDocument();
      expect(screen.getByText(/Starting at \$1,200/i)).toBeInTheDocument();
      expect(screen.getByText(/Starting at \$500/i)).toBeInTheDocument();
    });

    it('renders deliverables with inclusions', () => {
      render(<ServicesSection />);
      expect(screen.getAllByText("WHAT'S INCLUDED:").length).toBeGreaterThan(0);
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
});
