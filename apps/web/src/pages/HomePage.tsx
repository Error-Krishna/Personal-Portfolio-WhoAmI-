import React, { useState } from 'react';
import { DynamicIsland } from '../components/layout/DynamicIsland.js';
import { HeroSection } from '../components/hero/HeroSection.js';
import { AboutSection } from '../components/about/AboutSection.js';
import { SkillsSection } from '../components/skills/SkillsSection.js';
import { ProjectsSection } from '../components/projects/ProjectsSection.js';
import { ServicesSection } from '../components/services/ServicesSection.js';
import { ExperienceSection } from '../components/experience/ExperienceSection.js';
import { CreativeSection } from '../components/creative/CreativeSection.js';
import { TrustSection } from '../components/trust/TrustSection.js';
import { ContactSection } from '../components/contact/ContactSection.js';
import { Footer } from '../components/layout/Footer.js';
import { ScrollPortraitTransition } from '../components/transition/ScrollPortraitTransition.js';
import { siteConfig } from '../lib/config/site-config.js';

export const HomePage: React.FC = () => {
  const [isTransitionActive, setIsTransitionActive] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('');

  const visibility = siteConfig.sectionVisibility;

  return (
    <main className="relative min-h-screen bg-[#f8f6f0] text-slate-900 overflow-x-hidden selection:bg-slate-950 selection:text-white">
      {/* Dynamic Island Global Navigation Capsule */}
      <DynamicIsland />

      {/* Hero Section — independent section in standard document flow */}
      {visibility.hero && <HeroSection hideStaticPortrait={isTransitionActive} />}

      {/* About Section — independent section in standard document flow directly below Hero */}
      {visibility.about && <AboutSection hideStaticPortrait={isTransitionActive} />}

      {/* Skills Section — Tools and technologies */}
      {visibility.skills && <SkillsSection />}

      {/* Featured Projects Section — Things built */}
      {visibility.projects && <ProjectsSection />}

      {/* Services & Pricing Section — Scopes and transparent pricing */}
      {visibility.services && (
        <ServicesSection onSelectService={(service) => setSelectedService(service)} />
      )}

      {/* Experience Section — Educational background and venture history */}
      {visibility.experience && <ExperienceSection />}

      {/* Creative Work Section — Video editing and visual storytelling showcase */}
      {visibility.creative && <CreativeSection />}

      {/* Trust & Collaboration Standards — Engineering commitments */}
      {visibility.trust && <TrustSection />}

      {/* Contact Section — Conversion-focused project inquiry form */}
      {visibility.contact && <ContactSection initialService={selectedService} />}

      {/* Minimal Footer */}
      {visibility.footer && <Footer />}

      {/* Standalone Scroll-Driven 3D Portrait Flip Transition */}
      <ScrollPortraitTransition onReadyChange={setIsTransitionActive} />
    </main>
  );
};
