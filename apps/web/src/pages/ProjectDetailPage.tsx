import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  Calendar,
  User,
  Layers,
  ArrowUpRight,
  Play,
} from 'lucide-react';
import { getProjectBySlug, siteConfig, isValidUrl, type ProjectItem } from '../lib/config/site-config.js';
import { DynamicIsland } from '../components/layout/DynamicIsland.js';
import { Footer } from '../components/layout/Footer.js';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const project: ProjectItem | undefined = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f8f6f0] text-slate-900 flex flex-col justify-between bg-grain">
        <DynamicIsland />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold block mb-2">
            404 — PROJECT NOT FOUND
          </span>
          <h1 className="font-hero font-black text-4xl text-slate-950 uppercase tracking-tight mb-4">
            PROJECT NOT FOUND
          </h1>
          <p className="font-sans text-slate-600 mb-8">
            The project case study you requested could not be found or has moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO HOME
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProjects = siteConfig.projects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white bg-grain flex flex-col justify-between">
      <DynamicIsland />

      <main className="w-full max-w-[1280px] mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-20 flex-1">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ALL PROJECTS
          </Link>
        </div>

        {/* Header Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-wider px-2.5 py-1 rounded bg-slate-950 text-white font-bold uppercase">
            {project.category}
          </span>
          <span className="font-mono text-xs tracking-wider px-2.5 py-1 rounded bg-white text-slate-800 border border-slate-300 font-semibold uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {project.status}
          </span>
        </div>

        {/* Project Title & Subtitle */}
        <h1 className="font-hero font-black [font-weight:1000] text-4xl sm:text-5xl lg:text-6xl text-slate-950 uppercase tracking-tight mb-4">
          {project.title}
        </h1>

        <p className="font-mono text-base sm:text-lg text-red-600 font-semibold tracking-wide uppercase mb-8">
          {project.subtitle}
        </p>

        {/* Key Project Quick Facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-300/80 mb-12 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5" />
              MY ROLE
            </div>
            <div className="font-sans font-bold text-sm sm:text-base text-slate-950">
              {project.role}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              TIMELINE
            </div>
            <div className="font-sans font-bold text-sm sm:text-base text-slate-950">
              {project.date}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              CATEGORY
            </div>
            <div className="font-sans font-bold text-sm sm:text-base text-slate-950 uppercase">
              {project.category}
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-1">
              DESTINATIONS
            </div>
            <div className="flex items-center gap-3">
              {isValidUrl(project.liveUrl) && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  LIVE <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {isValidUrl(project.githubUrl) && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
                >
                  CODE <Github className="w-3 h-3" />
                </a>
              )}
              {isValidUrl(project.demoUrl) && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                >
                  DEMO <Play className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Columns: Case Study Overview, Problem, Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <div>
              <h2 className="font-sans font-black text-2xl text-slate-950 tracking-tight uppercase mb-3">
                PROJECT OVERVIEW
              </h2>
              <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed">
                {project.overview}
              </p>
            </div>

            {/* Problem & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-white border border-slate-300/80">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-600 block mb-2">
                  THE CHALLENGE
                </span>
                <p className="font-sans text-sm sm:text-base text-slate-700 leading-relaxed">
                  {project.problem}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-950 text-white border border-slate-900">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                  THE SOLUTION
                </span>
                <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="font-sans font-black text-2xl text-slate-950 tracking-tight uppercase mb-4">
                KEY ARCHITECTURAL FEATURES
              </h2>
              <div className="space-y-3">
                {project.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200"
                  >
                    <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span className="font-sans text-sm sm:text-base text-slate-800 leading-snug">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Contribution */}
            {project.myContribution && (
              <div>
                <h2 className="font-sans font-black text-2xl text-slate-950 tracking-tight uppercase mb-3">
                  MY CONTRIBUTION & ENGINEERING
                </h2>
                <p className="font-sans text-base text-slate-700 leading-relaxed p-6 bg-white rounded-xl border border-slate-300/80">
                  {project.myContribution}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: Technology Stack & Links */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-300/80 shadow-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold block mb-4">
                TECHNOLOGY STACK
              </span>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs tracking-wider px-3 py-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 font-medium uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Ready to discuss similar project CTA */}
            <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800">
              <span className="font-mono text-[10px] uppercase tracking-wider text-red-500 font-bold block mb-2">
                INTERESTED IN SIMILAR WORK?
              </span>
              <h3 className="font-sans font-black text-xl text-white mb-2">
                Let's discuss your product.
              </h3>
              <p className="font-sans text-xs text-slate-300 mb-6 leading-relaxed">
                Need a similar SaaS platform, developer CLI, or full-stack web application built?
              </p>
              <button
                type="button"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                START A PROJECT
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        <div className="pt-12 border-t border-slate-300/80">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold block mb-6">
            EXPLORE MORE WORK
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProjects.map((rel) => (
              <Link
                key={rel.slug}
                to={`/work/${rel.slug}`}
                className="group p-6 rounded-xl bg-white border border-slate-300/80 hover:border-slate-950 transition-all flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    {rel.category}
                  </span>
                  <h4 className="font-sans font-black text-xl text-slate-950 group-hover:text-red-600 transition-colors">
                    {rel.title}
                  </h4>
                  <p className="font-sans text-xs text-slate-600 mt-1">{rel.subtitle}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-950 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
