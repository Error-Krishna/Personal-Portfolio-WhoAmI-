import React, { useState } from 'react';
import { DynamicIsland } from '../components/layout/DynamicIsland.js';
import { HeroSection } from '../components/hero/HeroSection.js';
import { AboutSection } from '../components/about/AboutSection.js';
import { ScrollPortraitTransition } from '../components/transition/ScrollPortraitTransition.js';

export const HomePage: React.FC = () => {
  const [isTransitionActive, setIsTransitionActive] = useState<boolean>(false);

  return (
    <main className="relative min-h-screen bg-[#f8f6f0] text-slate-900 overflow-x-hidden selection:bg-slate-950 selection:text-white">
      {/* Dynamic Island Top Bar */}
      <DynamicIsland />

      {/* Hero Section — independent section in standard document flow */}
      <HeroSection hideStaticPortrait={isTransitionActive} />

      {/* About Section — independent section in standard document flow directly below Hero */}
      <AboutSection hideStaticPortrait={isTransitionActive} />

      {/* Standalone Scroll-Driven 3D Portrait Flip Transition */}
      <ScrollPortraitTransition onReadyChange={setIsTransitionActive} />
    </main>
  );
};
