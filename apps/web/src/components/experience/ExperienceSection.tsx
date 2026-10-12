import React from 'react';
import { ExternalLink, GraduationCap, Briefcase, Code, Video } from 'lucide-react';
import { siteConfig, type ExperienceItem, isValidUrl } from '../../lib/config/site-config.js';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Education: GraduationCap,
  'Product & Engineering': Briefcase,
  'Software Development': Code,
  Creative: Video,
};

export const ExperienceSection: React.FC = () => {
  return (
    <section
      id="experience"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-12 lg:px-16 py-20 lg:py-28 border-t border-slate-300/80"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            EXPERIENCE
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        {/* Headline & Supporting Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-14 lg:mb-20 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92]">
              MY JOURNEY SO FAR.
            </h2>
          </div>
          <div className="lg:col-span-5 pb-1">
            <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
              From foundational computer science studies to co-founding manufacturing software
              and shipping open-source developer tooling.
            </p>
          </div>
        </div>

        {/* Vertical Editorial Timeline */}
        <div className="relative border-l-2 border-slate-300 ml-4 sm:ml-8 md:ml-12 pl-6 sm:pl-10 space-y-12">
          {siteConfig.experience.map((item: ExperienceItem, idx: number) => {
            const IconComponent = CATEGORY_ICONS[item.category] || Briefcase;

            return (
              <div key={idx} className="relative group">
                {/* Timeline Node Marker */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1 w-6 h-6 rounded-full bg-white border-2 border-slate-900 group-hover:border-red-600 group-hover:scale-110 transition-all flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-slate-900 group-hover:bg-red-600 transition-colors" />
                </div>

                <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-300/80 hover:border-slate-950 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs sm:text-sm font-bold text-red-600 tracking-wider">
                      {item.period}
                    </span>

                    <span className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                      <IconComponent className="w-3 h-3 text-slate-900" />
                      {item.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                    <h3 className="font-sans font-black text-xl sm:text-2xl text-slate-950 tracking-tight">
                      {item.role}
                    </h3>
                    <span className="text-slate-400 font-sans text-lg hidden sm:inline">·</span>
                    <h4 className="font-sans font-semibold text-base sm:text-lg text-slate-700">
                      {item.organization}
                    </h4>
                  </div>

                  <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mb-4">
                    {item.description}
                  </p>

                  {isValidUrl(item.link) && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-900 hover:text-red-600 transition-colors uppercase tracking-wider"
                    >
                      LEARN MORE
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
