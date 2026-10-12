import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ChromeStar } from '../ui/ChromeStar.js';

const OTHER_SIDES = [
  { label: 'SOFTWARE ENGINEER', isPrimary: true },
  { label: 'FULL-STACK DEVELOPER', isPrimary: false },
  { label: 'FREELANCER', isPrimary: false },
  { label: 'VIDEO EDITOR', isPrimary: false },
];

const SECTION_DIAL = [
  { id: 'work', label: 'WORK', active: true },
  { id: 'skills', label: 'SKILLS', active: false },
  { id: 'projects', label: 'PROJECTS', active: false },
  { id: 'experience', label: 'EXPERIENCE', active: false },
  { id: 'contact', label: 'CONTACT', active: false },
];

interface HeroSectionProps {
  hideStaticPortrait?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hideStaticPortrait = false }) => {
  const [activeDial, setActiveDial] = useState<string>('WORK');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[700px] max-h-[1200px] bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain select-none"
    >
      {/* =========================================================================
          1. TOP-LEFT DECORATIVE AREA
          - Decorative star: x ≈ 55px (3.58%), y ≈ 40px (3.91%), size: ~38 × 48 px
          - Three-line label: x ≈ 129px (8.4%), y ≈ 37px (3.61%), width: ~70px
          ========================================================================= */}
      <div className="absolute left-[3.58%] top-[3.91%] z-20 flex items-start gap-4 pointer-events-none">
        {/* Decorative Star */}
        <div className="w-[38px] h-[48px] flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-slate-950"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        {/* Three-line label: BUILD / LEARN / CREATE */}
        <div className="font-mono text-[11px] sm:text-xs tracking-[0.22em] text-slate-800 font-bold uppercase leading-[21px] select-none">
          <div>BUILD</div>
          <div>LEARN</div>
          <div>CREATE</div>
        </div>
      </div>

      {/* =========================================================================
          3. TOP-RIGHT THREE-LINE LABEL
          - Position: x ≈ 1395px (90.8%), y ≈ 39px (3.81%)
          - Width: ~90px, Line spacing: ~21px, Right edge ≈ 1480px (96.35%)
          ========================================================================= */}
      <div className="absolute right-[3.65%] top-[3.81%] z-20 pointer-events-none text-right">
        <div className="font-mono text-[11px] sm:text-xs tracking-[0.22em] text-slate-800 font-bold uppercase leading-[21px] select-none">
          <div>SOFTWARE</div>
          <div>PRODUCTS</div>
          <div>PEOPLE</div>
        </div>
      </div>

      {/* =========================================================================
          4. LEFT DECORATIVE CHROME STAR
          - Position: x ≈ 82px (5.34%), y ≈ 202px (19.73%)
          - Size: ~164 × 187 px, Center: (164, 295)
          ========================================================================= */}
      <div className="absolute left-[5.34%] top-[19.73%] z-10 animate-float-slow pointer-events-none">
        <ChromeStar size={164} rotation={-14} />
      </div>

      {/* =========================================================================
          5. SMALL INTRODUCTION LABEL (ROLE LIST / DIVIDER)
          - Position: Divider at x ≈ 776px (50.52%), extends y ≈ 214px to 322px
          - Text: x ≈ 828px (52.60%), y ≈ 215px (21.00%)
          - Line spacing: ~30px
          ========================================================================= */}
      <div className="hidden lg:flex items-start absolute left-[60%] top-[14%] z-20 h-[108px]">
        {/* Thin vertical divider line */}
        <div className="w-[1px] h-[108px] bg-slate-400/80 mr-6 shrink-0" />

        {/* 4 vertically stacked lines */}
        <div className="flex flex-col justify-between h-[108px] font-mono text-xs tracking-wider">
          {OTHER_SIDES.map((side) => (
            <div
              key={side.label}
              className={`flex items-center gap-2.5 ${
                side.isPrimary ? 'text-slate-950 font-bold' : 'text-slate-400 font-medium'
              }`}
            >
              {side.isPrimary ? (
                <span className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-sm shadow-[#8b5cf6]/60 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-transparent shrink-0" />
              )}
              <span className="tracking-[0.16em] uppercase">{side.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          6. MAIN HEADLINE (Bold Archivo Black, 3 distinct rows matching spec)
          - ROW 1: "I'M A"      x ≈ 290px (18.88%), y ≈ 213px (20.80%)
          - ROW 2: "SOFTWARE"   x ≈ 240px (15.62%), y ≈ 341px (33.30%)
          - ROW 3: "ENGINEER"   x ≈ 290px (18.88%), y ≈ 495px (48.34%)
          - Caret immediately after last letter around x ≈ 1208px
          ========================================================================= */}
      {/* Desktop Coordinate Placed Headline */}
      <div className="hidden lg:block select-none pointer-events-none">

        {/* ROW 2: "SOFTWARE" */}
        <div className="absolute left-[16%] top-[28.5%] z-10">
          <span className="font-hero font-black [font-weight:1000] text-[9.8vw] xl:text-[150px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.88] block">
            SOFTWARE
          </span>
        </div>

        {/* ROW 3: "ENGINEER|" */}
        <div className="absolute left-[20%] top-[43%] z-10 flex items-baseline">
          <span className="font-hero font-black [font-weight:1000] text-[9.3vw] xl:text-[142px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.88] block">
            ENGINEER
          </span>
          {/* Terminal caret indicator */}
          <span className="inline-block w-[6px] xl:w-[8px] h-[0.72em] bg-slate-950 ml-3 align-baseline animate-caret" />
        </div>
      </div>

      {/* Tablet & Mobile Fallback Headline */}
      <div className="lg:hidden absolute inset-x-0 top-[18%] px-6 z-10 text-center select-none pointer-events-none">
        <h1 className="font-hero text-[15vw] sm:text-[12vw] text-slate-950 uppercase tracking-[-0.035em] leading-[0.88]">
          <span className="block">I’M A</span>
          <span className="block">SOFTWARE</span>
          <span className="block">
            ENGINEER
            <span className="inline-block w-[5px] h-[0.72em] bg-slate-950 ml-1.5 align-baseline animate-caret" />
          </span>
        </h1>
        {/* Mobile fine print */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 font-mono text-[11px] text-slate-600">
          <span className="text-purple-600 font-bold">● Software Engineer</span>
          <span>&middot;</span>
          <span>Full-Stack Developer</span>
          <span>&middot;</span>
          <span>Freelancer</span>
          <span>&middot;</span>
          <span>Video Editor</span>
        </div>
      </div>

      {/* =========================================================================
          7. RIGHT DECORATIVE CHROME STAR
          - Position: x ≈ 1287px (83.79%), y ≈ 454px (44.34%)
          - Size: ~171 × 230 px, Center: (1372, 569)
          ========================================================================= */}
      <div className="absolute right-[4.5%] lg:left-[83.79%] top-[44.34%] z-10 animate-float-reverse pointer-events-none">
        <ChromeStar size={171} rotation={18} />
      </div>

      {/* =========================================================================
          8 & 9. CTA BUTTONS (Vertically arranged with generous gap to image)
          - Position: x ≈ 121px (7.88%), vertically arranged on the left
          - Distinct horizontal gap of ~290px before Center Portrait at x ≈ 657px (42.77%)
          ========================================================================= */}
      <div className="absolute left-[7.88%] bottom-[14%] lg:bottom-auto lg:top-[68.5%] z-30 flex flex-col items-start gap-[14px]">
        {/* Primary CTA Button */}
        <button
          onClick={() => scrollTo('hero')}
          className="w-[220px] sm:w-[248px] h-[52px] sm:h-[55px] rounded-[13px] bg-slate-950 hover:bg-slate-800 text-white font-sans font-bold text-xs tracking-[0.14em] uppercase transition-all shadow-xl hover:shadow-2xl flex items-center justify-between px-6 active:scale-[0.98] group"
        >
          <span>EXPLORE MY WORK</span>
          <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Secondary CTA Button */}
        <a
          href="mailto:iamkrishnagoyal@gmail.com"
          className="w-[220px] sm:w-[248px] h-[52px] sm:h-[55px] rounded-[13px] border border-slate-950/25 hover:border-slate-950 bg-transparent hover:bg-slate-950/5 text-slate-950 font-sans font-bold text-xs tracking-[0.14em] uppercase transition-all flex items-center justify-center active:scale-[0.98]"
        >
          <span>LET’S CONNECT</span>
        </a>
      </div>

      {/* =========================================================================
          10. CENTER PORTRAIT
          - Position: x ≈ 657px (42.77%), y ≈ 643px (62.79%)
          - Width: ~266px, Height: ~279px, Radius: ~16px
          - Center: (790, 782)
          ========================================================================= */}
      <div className="absolute left-[42.77%] top-[62.79%] -translate-x-1/2 lg:translate-x-0 bottom-[8%] z-20 hidden md:block">
        <div
          id="hero-portrait-slot"
          className={`w-[240px] lg:w-[266px] h-[260px] lg:h-[279px] rounded-[16px] overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800/90 shadow-2xl relative group ${
            hideStaticPortrait ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          {/* Vignette Lighting */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black/85 z-10 pointer-events-none" />

          {/* Krishna Portrait Headshot */}
          <img
            src="/images/image-removebg-preview.png"
            alt="Krishna Goyal"
            className="w-full h-full object-cover object-top filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Subtle bottom edge gradient */}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-10" />
        </div>
      </div>

      {/* =========================================================================
          11. RIGHT-SIDE SECTION NAVIGATION (TIMELINE DIAL)
          - Position: x ≈ 1110px (72.27%), y ≈ 727px (71.00%)
          - Width: ~135px, Height: ~138px
          ========================================================================= */}
      <div className="hidden lg:flex items-start absolute left-[72.27%] top-[71.00%] z-20 w-[135px] h-[138px]">
        {/* Vertical Timeline Indicator Line with 5 dots */}
        <div className="relative w-3 flex flex-col items-center justify-between h-[131px] py-1">
          {/* Vertical connecting line */}
          <div className="absolute top-2 bottom-2 w-[1px] bg-slate-300 left-1/2 -translate-x-1/2 z-0" />

          {SECTION_DIAL.map((item) => {
            const isActive = activeDial === item.label;
            return (
              <div
                key={item.label}
                className={`relative z-10 w-2.5 h-2.5 rounded-full border border-slate-900 transition-all ${
                  isActive ? 'bg-slate-950 scale-125' : 'bg-[#f8f6f0]'
                }`}
              />
            );
          })}
        </div>

        {/* Labels Column */}
        <div className="flex flex-col justify-between h-[138px] ml-4 font-mono text-[11px] tracking-[0.2em] uppercase select-none">
          {SECTION_DIAL.map((item) => {
            const isActive = activeDial === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveDial(item.label);
                  scrollTo(item.id);
                }}
                className={`text-left transition-colors ${
                  isActive ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          12. BOTTOM FOOTER
          - Shared vertical center around y ≈ 964px (occupies y = 948–979 px)
          - Left copyright: x ≈ 55px (3.58%)
          - Divider line: from x ≈ 152px (9.9%) to 1047px (68.1%)
          - Right text: x ≈ 1092px (71.09%)
          - Bottom-right star: x ≈ 1448px (94.27%)
          ========================================================================= */}
      <footer className="absolute inset-x-0 top-[93.55%] z-20 flex items-center justify-between px-[3.58%] pointer-events-none select-none">
        {/* Left Copyright */}
        <div className="font-mono text-xs text-slate-800 font-semibold tracking-wider whitespace-nowrap">
          &copy; 2026
        </div>

        {/* Horizontal Divider Line */}
        <div className="hidden sm:block flex-1 mx-8 h-[1px] bg-slate-300 max-w-[58.27%]" />

        {/* Right Footer Text */}
        <div className="font-mono text-[11px] text-slate-800 tracking-[0.22em] uppercase font-semibold whitespace-nowrap">
          BASED IN INDIA &middot; OPEN TO OPPORTUNITIES
        </div>

        {/* Bottom-Right Decorative Star */}
        <div className="w-[28px] h-[31px] flex items-center justify-center shrink-0 ml-4">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-slate-950"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      </footer>
    </section>
  );
};
