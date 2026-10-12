import React from 'react';
import { Film, Video, Clapperboard, ExternalLink } from 'lucide-react';
import { siteConfig, type CreativeWorkItem, isValidUrl } from '../../lib/config/site-config.js';

export const CreativeSection: React.FC = () => {
  return (
    <section
      id="creative"
      className="relative w-full bg-[#0c0d14] text-white selection:bg-red-600 selection:text-white overflow-hidden px-6 sm:px-12 lg:px-16 py-20 lg:py-28 border-t border-white/10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[1536px] mx-auto z-10">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-red-500 uppercase">
            CREATIVE WORK
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-white/20" />
        </div>

        {/* Headline & Supporting Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-14 lg:mb-20 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-white uppercase tracking-[-0.035em] leading-[0.92]">
              I ALSO CREATE.
            </h2>
          </div>
          <div className="lg:col-span-5 pb-1">
            <p className="font-sans text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Software engineering meets visual storytelling. Editing product demonstrations,
              technical breakdowns, and high-retention short-form video that resonates with audiences.
            </p>
          </div>
        </div>

        {/* Creative Showcase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {siteConfig.creativeWorks.map((item: CreativeWorkItem, idx: number) => (
            <div
              key={item.id || idx}
              className="group bg-white/5 hover:bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-red-600/80 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Visual Icon Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    {idx === 0 ? (
                      <Clapperboard className="w-6 h-6" />
                    ) : idx === 1 ? (
                      <Video className="w-6 h-6" />
                    ) : (
                      <Film className="w-6 h-6" />
                    )}
                  </div>
                  <span className="font-mono text-[10px] tracking-wider uppercase text-slate-400 px-2.5 py-1 rounded bg-white/5 border border-white/10">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-sans font-black text-2xl text-white tracking-tight mb-3 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>

                <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Tools used */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tools.map((tool) => (
                    <span
                      key={tool}
                      className="font-mono text-[11px] tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/15 uppercase"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status and Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-red-400 flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {item.status}
                </span>

                {isValidUrl(item.link) && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    PREVIEW
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
