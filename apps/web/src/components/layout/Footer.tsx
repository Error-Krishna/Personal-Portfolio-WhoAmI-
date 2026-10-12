import React from 'react';
import { Github, Linkedin, ArrowUp } from 'lucide-react';
import { siteConfig, isValidUrl } from '../../lib/config/site-config.js';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white border-t border-slate-300/80 px-6 sm:px-12 lg:px-16 py-12 lg:py-16 bg-grain">
      <div className="w-full max-w-[1536px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-300/80 items-start">
          {/* Brand & Role */}
          <div className="md:col-span-5">
            <h3 className="font-hero font-black text-2xl sm:text-3xl tracking-tight text-slate-950 uppercase mb-2">
              {siteConfig.personal.displayName}
            </h3>
            <p className="font-sans text-sm text-slate-600 mb-4 max-w-sm">
              {siteConfig.personal.title}. Building real software products, scalable full-stack
              applications, and engaging visual media.
            </p>

            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-300 text-xs font-mono font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {siteConfig.personal.availabilityLabel}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-4">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold block mb-4">
              NAVIGATION
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-700">
              <button
                type="button"
                onClick={() => scrollTo('hero')}
                className="text-left hover:text-slate-950 hover:underline cursor-pointer"
              >
                01. HOME
              </button>
              <button
                type="button"
                onClick={() => scrollTo('about')}
                className="text-left hover:text-slate-950 hover:underline cursor-pointer"
              >
                02. ABOUT
              </button>
              <button
                type="button"
                onClick={() => scrollTo('skills')}
                className="text-left hover:text-slate-950 hover:underline cursor-pointer"
              >
                03. SKILLS
              </button>
              <button
                type="button"
                onClick={() => scrollTo('projects')}
                className="text-left hover:text-slate-950 hover:underline cursor-pointer"
              >
                04. PROJECTS
              </button>
              <button
                type="button"
                onClick={() => scrollTo('services')}
                className="text-left hover:text-slate-950 hover:underline cursor-pointer"
              >
                05. SERVICES
              </button>
              <button
                type="button"
                onClick={() => scrollTo('experience')}
                className="text-left hover:text-slate-950 hover:underline cursor-pointer"
              >
                06. EXPERIENCE
              </button>
              <button
                type="button"
                onClick={() => scrollTo('creative')}
                className="text-left hover:text-slate-950 hover:underline cursor-pointer"
              >
                07. CREATIVE
              </button>
              <button
                type="button"
                onClick={() => scrollTo('contact')}
                className="text-left hover:text-slate-950 hover:underline cursor-pointer"
              >
                08. CONTACT
              </button>
            </div>
          </div>

          {/* Socials & Resume */}
          <div className="md:col-span-3 flex flex-col justify-between h-full">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold block mb-4">
                EXTERNAL DESTINATIONS
              </span>
              <div className="flex flex-col gap-2 font-mono text-xs">
                {isValidUrl(siteConfig.links.github) && (
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-700 hover:text-slate-950"
                  >
                    <Github className="w-3.5 h-3.5" />
                    GITHUB PROFILE
                  </a>
                )}
                {isValidUrl(siteConfig.links.linkedin) && (
                  <a
                    href={siteConfig.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-700 hover:text-slate-950"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LINKEDIN NETWORK
                  </a>
                )}
                {isValidUrl(siteConfig.links.resume) && (
                  <a
                    href={siteConfig.links.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-red-600 font-bold hover:underline"
                  >
                    VIEW RESUME (PDF)
                  </a>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-slate-600 hover:text-slate-950 uppercase font-semibold cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              BACK TO TOP
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <div>
            © {currentYear} {siteConfig.personal.name}. ALL RIGHTS RESERVED.
          </div>
          <div>
            BASED IN {siteConfig.personal.location.toUpperCase()} · TIMEZONE {siteConfig.personal.timezone}
          </div>
        </div>
      </div>
    </footer>
  );
};
