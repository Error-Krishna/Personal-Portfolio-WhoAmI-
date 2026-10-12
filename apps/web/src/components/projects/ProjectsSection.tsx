import React, { useState, useMemo } from 'react';
import { getPublishedProjects, type ProjectItem } from '../../lib/config/site-config.js';
import { ProjectCard } from './ProjectCard.js';

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Load all published projects dynamically from single source of truth
  const publishedProjects = useMemo(() => {
    return getPublishedProjects();
  }, []);

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

  return (
    <section
      id="projects"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-12 lg:px-16 py-20 lg:py-28 border-t border-slate-300/80"
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

        {/* Dynamic Responsive 2-Column Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredProjects.map((project: ProjectItem, index: number) => (
              <ProjectCard key={project.id || project.slug} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80">
            <p className="font-mono text-sm text-slate-500 uppercase tracking-wider">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
