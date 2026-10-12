import React from 'react';

const SKILL_TAGS = [
  ['WEB APPS', 'FULL-STACK', 'PRODUCTS'],
  ['VIDEO EDITING', 'CREATIVE', 'AUTOMATION'],
];

const PROCESS_STEPS = [
  { label: 'BUILD', isFilled: true },
  { label: 'EXPERIMENT', isFilled: false },
  { label: 'CREATE', isFilled: false },
  { label: 'IMPROVE', isFilled: false },
];

interface AboutSectionProps {
  hideStaticPortrait?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ hideStaticPortrait = false }) => {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain select-none px-6 sm:px-12 lg:px-16 py-14 lg:py-20 flex flex-col justify-between"
    >
      <div className="w-full max-w-[1536px] mx-auto flex-1 flex flex-col justify-between">
        {/* =========================================================================
            1. SECTION LABEL: "ABOUT ME" + HORIZONTAL DIVIDER
           ========================================================================= */}
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            ABOUT ME
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        {/* =========================================================================
            2. MAIN HEADLINE (Two tightly stacked lines, Archivo Black)
           ========================================================================= */}
        <div className="mb-10 sm:mb-14 lg:mb-16">
          <h2 className="font-hero font-black [font-weight:1000] text-[11vw] sm:text-[9vw] lg:text-[7.2vw] xl:text-[98px] 2xl:text-[104px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.88] select-none">
            <span className="block">I BUILD THINGS</span>
            <span className="block">PEOPLE CAN USE.</span>
          </h2>
        </div>

        {/* =========================================================================
            3. ASYMMETRIC THREE-COLUMN COMPOSITION
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-start my-auto">
          {/* -----------------------------------------------------------------------
              LEFT COLUMN: Personal Introduction + Metadata Lines
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full pt-1 lg:pt-3">
            {/* Bio paragraph with highlighted bold phrases */}
            <p className="font-sans text-[17px] sm:text-[19px] lg:text-[20px] xl:text-[22px] text-slate-900 leading-[1.38] font-normal">
              I'm <strong className="font-bold text-slate-950">Krishna Goyal</strong>, a final year
              Computer Science student at{' '}
              <strong className="font-bold text-slate-950">VIT-AP</strong>, focused on building
              real-world products and solving meaningful problems. I work as a{' '}
              <strong className="font-bold text-slate-950">full-stack developer</strong> and also
              create content through{' '}
              <strong className="font-bold text-slate-950">video editing</strong>, combining tech
              and creativity to bring ideas to life.
            </p>

            {/* Divider line */}
            <div className="w-[88px] h-[1px] bg-slate-400 my-6 sm:my-8" />

            {/* Metadata lines */}
            <div className="space-y-3 font-mono text-xs sm:text-[13px] tracking-[0.2em] text-slate-800 uppercase font-semibold">
              <div>STUDENT · DEVELOPER · CREATOR</div>
              <div>IDEAS → PRODUCTS → IMPACT</div>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              CENTER COLUMN: Portrait Card Target Slot
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex justify-center items-center">
            {hideStaticPortrait ? (
              <div
                id="about-portrait-slot"
                className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[390px] xl:max-w-[400px] aspect-[266/307] rounded-[20px] lg:rounded-[22px] opacity-0 pointer-events-none"
              />
            ) : (
              <div
                id="about-portrait-slot"
                className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[390px] xl:max-w-[400px] aspect-[266/307] rounded-[20px] lg:rounded-[22px] overflow-hidden bg-black shadow-2xl border border-slate-900 group"
              >
                {/* Red-Lit Portrait Photo */}
                <img
                  id="about-portrait-image"
                  src="/images/about-portrait-red.png"
                  alt="Krishna Goyal"
                  className="w-full h-full object-cover object-center filter contrast-110"
                />
              </div>
            )}
          </div>

          {/* -----------------------------------------------------------------------
              RIGHT COLUMN: Short Statement + Skill Tags + Process Indicator
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full pt-1 lg:pt-3">
            {/* Short Statement */}
            <div className="mb-6 lg:mb-8">
              <h3 className="font-sans text-[20px] sm:text-[24px] lg:text-[26px] xl:text-[29px] text-slate-950 leading-[1.25] font-normal">
                From ideas on a screen
                <br />
                to products in the real world.
              </h3>
            </div>

            {/* Skill Tags: 2 rows of 3 pills */}
            <div className="space-y-3 mb-8 lg:mb-12">
              {SKILL_TAGS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex flex-wrap gap-2.5 sm:gap-3">
                  {row.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[8px] sm:rounded-[9px] border border-slate-900 bg-transparent font-mono text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.14em] uppercase text-slate-950 whitespace-nowrap hover:bg-slate-950 hover:text-white transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Vertical Process Indicator: 4 circular nodes */}
            <div className="relative pl-7 py-1">
              {/* Connecting vertical line */}
              <div className="absolute top-2 bottom-2 left-[5.5px] w-[1px] bg-slate-300" />

              <div className="space-y-5">
                {PROCESS_STEPS.map((step) => (
                  <div key={step.label} className="relative flex items-center gap-3">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-7 w-3 h-3 rounded-full transition-transform ${
                        step.isFilled ? 'bg-slate-950' : 'border border-slate-900 bg-[#f8f6f0]'
                      }`}
                    />
                    {/* Label */}
                    <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-[0.2em] text-slate-900 uppercase">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. MINIMAL FOOTER
           ========================================================================= */}
        <footer className="w-full pt-12 lg:pt-16 mt-12 flex items-center justify-between text-slate-800 select-none">
          {/* Copyright */}
          <div className="font-mono text-xs font-semibold tracking-wider whitespace-nowrap">
            &copy; 2026
          </div>

          {/* Divider line */}
          <div className="hidden sm:block flex-1 mx-8 h-[1px] bg-slate-300" />

          {/* Location info */}
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase font-semibold whitespace-nowrap">
            BASED IN INDIA &middot; OPEN TO OPPORTUNITIES
          </div>
        </footer>
      </div>
    </section>
  );
};
