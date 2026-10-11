import React from 'react';
import { DynamicIsland } from '../components/layout/DynamicIsland.js';
import { HeroSection } from '../components/hero/HeroSection.js';

export const HomePage: React.FC = () => {
  return (
    <main className="relative min-h-screen bg-[#f7f5f0] text-slate-900 overflow-x-hidden selection:bg-slate-950 selection:text-white">
      {/* Dynamic Island Top Bar */}
      <DynamicIsland />

      {/* Hero Section */}
      <HeroSection />
    </main>
  );
};
