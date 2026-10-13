import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { getPublishedProjects, type ProjectItem } from '../../lib/config/site-config.js';
import { ProjectCard } from './ProjectCard.js';

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Load all published projects dynamically from single source of truth
  const publishedProjects = useMemo(() => {
    return getPublishedProjects();
  }, []);

  // First 3 featured projects for priority showcase
  const featuredTopProjects = useMemo(() => {
    const featured = publishedProjects.filter((p) => p.featured);
    return featured.slice(0, 3);
  }, [publishedProjects]);

  // Remaining published projects for secondary collection
  const remainingProjects = useMemo(() => {
    const featuredIds = new Set(featuredTopProjects.map((p) => p.id));
    return publishedProjects.filter((p) => !featuredIds.has(p.id));
  }, [publishedProjects, featuredTopProjects]);

  // Compute available categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedProjects.forEach((p) => {
      if (p.category) set.add(p.category.toUpperCase());
    });
    return ['ALL', ...Array.from(set)];
  }, [publishedProjects]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL') return publishedProjects;
    return publishedProjects.filter(
      (p) => p.category?.toUpperCase() === activeCategory.toUpperCase()
    );
  }, [activeCategory, publishedProjects]);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="projects"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-10 lg:px-12 py-20 lg:py-28 border-t border-slate-300/80"
    >
      {/* Anchor for 'work' navigation target */}
      <div id="work" className="absolute -top-12 left-0 pointer-events-none" />

      <div className="w-full max-w-[1536px] mx-auto">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-16">
          <div className="max-w-3xl">
            {/* Small Label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
                PROJECTS / 01
              </span>
              <div className="w-12 sm:w-16 h-[1px] bg-slate-400/80" />
            </div>

            {/* Main Headline */}
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92] mb-4">
              THINGS I'VE BUILT<span className="text-red-600">.</span>
            </h2>

            {/* Supporting Text */}
            <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
              Different problems. Different products. One engineering mindset.
            </p>
          </div>

          {/* Category Filter Tabs (Right side on desktop, wraps on mobile) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pb-1 self-start lg:self-end">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`font-mono text-xs tracking-wider px-3.5 py-1.5 rounded-full border transition-all duration-200 uppercase font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                      : 'bg-white/80 text-slate-700 border-slate-300/90 hover:border-slate-900 hover:text-slate-950'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION CONTENT */}
        {activeCategory === 'ALL' ? (
          <div>
            {/* 1. TOP TIER: FEATURED HIGHLIGHTS (Top 3 Projects) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-300/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                    FEATURED WORK
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                  03 SELECTED CASE STUDIES
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {featuredTopProjects.map((project: ProjectItem, index: number) => (
                  <ProjectCard
                    key={project.id || project.slug}
                    project={project}
                    index={index}
                    featuredHighlight={true}
                  />
                ))}
              </div>
            </div>

            {/* 2. COMPACT POST-WORK CONVERSION CTA */}
            <div className="my-8 sm:my-10 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-sans font-bold text-base sm:text-lg text-slate-950 tracking-tight">
                    Have a project like this?
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 mt-0.5">
                    Whether you need an MVP, full-stack application, or custom backend, let's talk.
                  </p>
                </div>
              </div>

              <a
                href="#contact"
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-800 px-5 py-3 rounded-xl transition-all shadow-md active:scale-[0.98] shrink-0 cursor-pointer group"
              >
                <span>LET’S DISCUSS IT</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* 3. SECONDARY TIER: REMAINING PUBLISHED PROJECTS */}
            {remainingProjects.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-300/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                      ADDITIONAL SYSTEMS & UTILITIES
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                    {remainingProjects.length} MORE PROJECTS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {remainingProjects.map((project: ProjectItem, index: number) => (
                    <ProjectCard
                      key={project.id || project.slug}
                      project={project}
                      index={featuredTopProjects.length + index}
                      featuredHighlight={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Filtered Category View */
          <div>
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                {filteredProjects.map((project: ProjectItem, index: number) => (
                  <ProjectCard
                    key={project.id || project.slug}
                    project={project}
                    index={index}
                    featuredHighlight={project.featured}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80">
                <p className="font-mono text-sm text-slate-500 uppercase tracking-wider">
                  No projects found in this category.
                </p>
              </div>
            )}

            {/* Post-Work CTA also accessible when filtered */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 animate-pulse" />
                <h4 className="font-sans font-bold text-base text-slate-950 tracking-tight">
                  Have a project like this?
                </h4>
              </div>
              <a
                href="#contact"
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-800 px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-[0.98] shrink-0 cursor-pointer group"
              >
                <span>LET’S DISCUSS IT</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
