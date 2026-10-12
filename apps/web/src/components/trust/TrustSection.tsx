import React from 'react';
import { siteConfig, type TrustPrincipleItem } from '../../lib/config/site-config.js';

export const TrustSection: React.FC = () => {
  return (
    <section
      id="trust"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-12 lg:px-16 py-20 lg:py-28 border-t border-slate-300/80"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            STANDARDS & PROCESS
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        {/* Headline & Supporting Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-14 lg:mb-20 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92]">
              HOW I WORK WITH CLIENTS.
            </h2>
          </div>
          <div className="lg:col-span-5 pb-1">
            <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
              Engineering credibility built on transparent scopes, typed architecture, reliable delivery,
              and thoughtful communication. Here is what you can depend on.
            </p>
          </div>
        </div>

        {/* 5 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {siteConfig.trustPrinciples.map((principle: TrustPrincipleItem) => (
            <div
              key={principle.number}
              className="group bg-white rounded-2xl p-6 sm:p-8 border border-slate-300/80 hover:border-slate-950 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between"
            >
              <div>
                <span className="font-hero font-black text-3xl sm:text-4xl text-red-600 block mb-4 group-hover:scale-105 transition-transform duration-200">
                  {principle.number}
                </span>

                <h3 className="font-sans font-black text-xl sm:text-2xl text-slate-950 tracking-tight mb-3">
                  {principle.title}
                </h3>

                <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
                  {principle.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="uppercase tracking-wider">STANDARD</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-red-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
