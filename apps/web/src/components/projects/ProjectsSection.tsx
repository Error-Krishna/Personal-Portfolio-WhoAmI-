import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowUpRight, Play, CheckCircle } from 'lucide-react';
import { siteConfig, type ProjectItem, isValidUrl } from '../../lib/config/site-config.js';

const PROJECT_CATEGORIES = ['ALL', 'SAAS & PRODUCTS', 'FULL-STACK', 'TOOLS', 'EXPERIMENTS'] as const;

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL') return siteConfig.projects;
    return siteConfig.projects.filter(
      (p) => p.category.toUpperCase() === activeCategory.toUpperCase()
    );
  }, [activeCategory]);

  const [leadProject, ...supportingProjects] = filteredProjects;

  return (
    <section
      id="projects"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-12 lg:px-16 py-20 lg:py-28 border-t border-slate-300/80"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            FEATURED PROJECTS
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        {/* Headline & Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 lg:mb-16 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92]">
              THINGS I'VE BUILT.
            </h2>
          </div>
          <div className="lg:col-span-5 pb-1">
            <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
              Real software built to solve actual business and operational problems.
              From manufacturing operating systems to developer tooling and real-time intelligence.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10 pb-2">
          {PROJECT_CATEGORIES.map((cat) => {
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

        {/* Hero Featured Project Card (Lead Item) */}
        {leadProject && (
          <div className="mb-12 bg-white rounded-2xl border border-slate-300/90 p-6 sm:p-8 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-slate-950 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="font-mono text-[11px] tracking-wider px-2.5 py-0.5 rounded bg-slate-950 text-white font-bold uppercase">
                      FEATURED
                    </span>
                    <span className="font-mono text-[11px] tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-semibold uppercase">
                      {leadProject.category}
                    </span>
                    <span className="font-mono text-[11px] tracking-wider text-slate-500 uppercase flex items-center gap-1.5 ml-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {leadProject.status}
                    </span>
                  </div>

                  <h3 className="font-hero font-black text-3xl sm:text-4xl lg:text-5xl text-slate-950 uppercase tracking-tight mb-2">
                    {leadProject.title}
                  </h3>

                  <p className="font-mono text-xs sm:text-sm text-red-600 font-semibold tracking-wide uppercase mb-4">
                    {leadProject.subtitle}
                  </p>

                  <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
                    {leadProject.shortDescription}
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2 mb-6">
                    {leadProject.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                        <CheckCircle className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {leadProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[11px] tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-900 border border-slate-200 uppercase font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200">
                  <Link
                    to={`/work/${leadProject.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                  >
                    VIEW CASE STUDY
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  {isValidUrl(leadProject.liveUrl) && (
                    <a
                      href={leadProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-xs font-bold uppercase tracking-wider hover:border-slate-950 hover:bg-slate-50 transition-colors"
                    >
                      LIVE APP
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {isValidUrl(leadProject.githubUrl) && (
                    <a
                      href={leadProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-xs font-bold uppercase tracking-wider hover:border-slate-950 hover:bg-slate-50 transition-colors"
                    >
                      SOURCE
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Graphic Card Visual Preview */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 text-white p-6 sm:p-8 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <span className="font-mono text-xs tracking-widest text-slate-400 uppercase">
                      SYSTEM ARCHITECTURE
                    </span>
                    <span className="font-mono text-xs text-red-400 font-bold">
                      {leadProject.date}
                    </span>
                  </div>

                  <div className="space-y-4 font-mono text-xs text-slate-300">
                    <div className="p-3 rounded bg-white/5 border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">ROLE</div>
                      <div className="font-bold text-white text-sm">{leadProject.role}</div>
                    </div>

                    <div className="p-3 rounded bg-white/5 border border-white/10">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">CORE CHALLENGE</div>
                      <div className="text-slate-200 text-xs leading-relaxed">{leadProject.problem}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-slate-400 font-mono text-xs">
                  <span>PRODUCTION READY</span>
                  <span className="text-white font-bold uppercase">{leadProject.category}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supporting Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportingProjects.map((project: ProjectItem) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl p-6 sm:p-7 border border-slate-300/80 hover:border-slate-950 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold uppercase">
                    {project.category}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                    {project.date}
                  </span>
                </div>

                <h4 className="font-sans font-black text-xl sm:text-2xl text-slate-950 tracking-tight mb-1 group-hover:text-red-600 transition-colors">
                  {project.title}
                </h4>

                <p className="font-mono text-xs text-slate-500 font-medium mb-3">
                  {project.subtitle}
                </p>

                <p className="font-sans text-sm text-slate-700 leading-relaxed mb-6">
                  {project.shortDescription}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/work/${project.slug}`}
                  className="font-mono text-xs font-bold uppercase tracking-wider text-slate-950 hover:text-red-600 inline-flex items-center gap-1.5 transition-colors"
                >
                  CASE STUDY
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  {isValidUrl(project.liveUrl) && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Live Website"
                      className="p-1.5 rounded text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {isValidUrl(project.demoUrl) && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Loom Demo Video"
                      className="p-1.5 rounded text-slate-600 hover:text-red-600 hover:bg-slate-100 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </a>
                  )}

                  {isValidUrl(project.githubUrl) && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub Repository"
                      className="p-1.5 rounded text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
