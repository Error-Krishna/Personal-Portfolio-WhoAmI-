import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Link as LinkIcon } from 'lucide-react';
import {
  getProjectBySlug,
  getNextProject,
  getRelatedProjects,
  getPublishedProjects,
  isValidUrl,
  type ProjectItem,
} from '../lib/config/site-config.js';
import { DynamicIsland } from '../components/layout/DynamicIsland.js';
import { CornerNavigationDial } from '../components/navigation/CornerNavigationDial.js';
import { Footer } from '../components/layout/Footer.js';
import { ProjectVideoShowcase } from '../components/projects/ProjectVideoShowcase.js';
import { ProjectCaseStudySections } from '../components/projects/ProjectCaseStudySections.js';
import { OtherProjectsNav } from '../components/projects/OtherProjectsNav.js';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Resolve project dynamically from slug
  const project: ProjectItem | undefined = useMemo(() => {
    if (!slug) return undefined;
    const p = getProjectBySlug(slug);
    // Unpublished projects should not appear publicly
    if (p && p.published === false) return undefined;
    return p;
  }, [slug]);

  // Compute position among published projects
  const publishedList = useMemo(() => getPublishedProjects(), []);
  const projectIndex = useMemo(() => {
    if (!project) return 0;
    const idx = publishedList.findIndex(
      (p) =>
        p.slug.toLowerCase() === project.slug.toLowerCase() ||
        p.id.toLowerCase() === project.id.toLowerCase()
    );
    return idx >= 0 ? idx : 0;
  }, [project, publishedList]);

  // Resolve next project and other projects dynamically
  const nextProject = useMemo(() => {
    if (!project) return undefined;
    return getNextProject(project.slug);
  }, [project]);

  const relatedProjects = useMemo(() => {
    if (!project) return [];
    return getRelatedProjects(project.slug, 4);
  }, [project]);

  // Scroll to top immediately whenever slug changes
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo(0, 0);
      } catch {
        // Safe no-op in virtual DOM / testing environments
      }
    }
  }, [slug]);

  // 404 Not Found State
  if (!project) {
    return (
      <div className="min-h-screen bg-[#f8f6f0] text-slate-900 flex flex-col justify-between bg-grain">
        <DynamicIsland />
        <CornerNavigationDial />
        <div className="max-w-2xl mx-auto px-6 py-36 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold block mb-2">
            404 — PROJECT NOT FOUND
          </span>
          <h1 className="font-hero font-black text-4xl sm:text-5xl text-slate-950 uppercase tracking-tight mb-4">
            PROJECT NOT FOUND<span className="text-red-600">.</span>
          </h1>
          <p className="font-sans text-slate-600 mb-8 max-w-md mx-auto">
            The project case study you requested could not be found or has moved.
          </p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO PROJECTS
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedNumber = String(projectIndex + 1).padStart(2, '0');

  // Badges: category + technologies
  const displayBadges = [project.category, ...(project.technologies || []).slice(0, 3)].filter(
    Boolean
  );

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white bg-grain flex flex-col justify-between">
      <DynamicIsland />
      <CornerNavigationDial />

      <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 pt-24 sm:pt-28 pb-20 flex-1">
        {/* Top Navigation Bar (Panel 3) */}
        <div className="flex items-center justify-between gap-4 py-4 mb-8 sm:mb-12 border-b border-slate-300/60">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>

          {nextProject && (
            <Link
              to={`/work/${nextProject.slug}`}
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-red-600 transition-colors"
            >
              <span>Next Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Immersive Split Hero Section (~70:30 Media Dominance) */}
        <div className="flex flex-col lg:flex-row items-center mb-12 sm:mb-16 min-h-[460px] lg:min-h-[520px] xl:min-h-[580px] gap-8 lg:gap-0 relative">
          {/* Left Side: Project Introduction (~30% on desktop) */}
          <div className="w-full lg:w-[36%] xl:w-[30%] shrink-0 flex flex-col justify-center relative z-20 pr-0 lg:pr-6 xl:pr-8">
            {/* Project Index Label */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="font-mono text-xs tracking-widest font-bold text-slate-800 uppercase">
                PROJECT / {formattedNumber}
              </span>
            </div>

            {/* Giant Title */}
            <h1 className="font-hero font-black [font-weight:1000] text-3xl sm:text-4xl lg:text-4xl xl:text-5xl text-slate-950 uppercase tracking-[-0.035em] leading-[0.95] mb-4 break-words">
              {project.title}
              <span className="text-red-600">.</span>
            </h1>

            {/* Summary / Subtitle */}
            <p className="font-sans text-sm sm:text-base text-slate-700 leading-relaxed mb-6 max-w-md">
              {project.shortDescription || project.subtitle}
            </p>

            {/* Technology & Category Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {displayBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[10px] sm:text-[11px] tracking-wider px-2.5 sm:px-3 py-1 rounded-md bg-white text-slate-800 border border-slate-300 font-medium uppercase shadow-xs"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Project Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {isValidUrl(project.liveUrl) && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap"
                >
                  <span>View Live Product</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {isValidUrl(project.githubUrl) && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg bg-white border border-slate-300 hover:border-slate-950 hover:bg-slate-50 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-xs whitespace-nowrap"
                >
                  <span>View Source Code</span>
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}

              {isValidUrl(project.demoUrl) && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-white border border-slate-300 hover:border-slate-950 hover:bg-slate-50 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-xs whitespace-nowrap"
                  title="View Walkthrough Demo"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Side: Immersive Project Video Hero (~70% on desktop) */}
          <div className="w-full lg:w-[64%] xl:w-[70%] h-full relative z-10 flex items-center lg:-ml-4 xl:-ml-6">
            <ProjectVideoShowcase project={project} />
          </div>
        </div>

        {/* Structured Case Study Sections Below Hero */}
        <ProjectCaseStudySections project={project} />

        {/* Bottom Section: Direct Navigation to Other Projects (Panel 4) */}
        <OtherProjectsNav projects={relatedProjects} />
      </main>

      <Footer />
    </div>
  );
};
