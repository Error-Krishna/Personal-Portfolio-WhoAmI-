import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import { type ProjectItem } from '../../lib/config/site-config.js';
import { ProjectThumbnailFallback } from './ProjectThumbnailFallback.js';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  featuredHighlight?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  featuredHighlight = false,
}) => {
  const [isFlippedManual, setIsFlippedManual] = useState<boolean>(false);

  const formattedIndex = String(index + 1).padStart(2, '0');
  const accentColor = project.accentColor || '#991b1b';
  const cardDescription = project.cardDescription || project.shortDescription || project.subtitle;

  // Selected compact tags from technologies or category
  const displayTags =
    project.technologies && project.technologies.length > 0
      ? project.technologies.slice(0, featuredHighlight ? 3 : 2)
      : [project.category];

  return (
    <div
      className={`flip-card-wrapper group relative w-full ${
        featuredHighlight
          ? 'h-[215px] sm:h-[225px] lg:h-[230px]'
          : 'h-[200px] sm:h-[210px] lg:h-[215px]'
      }`}
    >
      {/* 3D Flip Inner Container */}
      <div className={`flip-card-inner ${isFlippedManual ? 'is-flipped' : ''}`}>
        {/* ======================================================== */}
        {/* CARD FRONT                                               */}
        {/* ======================================================== */}
        <Link
          to={`/work/${project.slug}`}
          aria-label={`View ${project.title} case study`}
          className="flip-card-front bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-slate-950/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all p-3.5 sm:p-4 lg:p-5 flex gap-3 sm:gap-4 lg:gap-5 items-stretch text-left overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 select-none"
        >
          {/* Left: Thumbnail Window */}
          <div className="w-[100px] xs:w-[120px] sm:w-[140px] md:w-[150px] lg:w-[155px] xl:w-[175px] shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center">
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : project.heroImage ? (
              <img
                src={project.heroImage}
                alt={project.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <ProjectThumbnailFallback
                id={project.id}
                title={project.title}
                category={project.category}
                accentColor={accentColor}
              />
            )}
          </div>

          {/* Right: Info Column */}
          <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
            <div>
              {/* Top row: Title, optional role, and arrow */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="min-w-0 flex-1">
                  {featuredHighlight && (
                    <span className="font-mono text-[9px] font-bold text-red-600 tracking-wider uppercase block mb-0.5 truncate">
                      FEATURED {project.role ? `· ${project.role}` : ''}
                    </span>
                  )}
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-950 tracking-tight leading-snug truncate">
                    {project.title}
                  </h3>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
              </div>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {project.shortDescription || project.subtitle}
              </p>
            </div>

            {/* Bottom row: Compact Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {displayTags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>

        {/* ======================================================== */}
        {/* CARD BACK (Hover/Focus Flip)                             */}
        {/* ======================================================== */}
        <Link
          to={`/work/${project.slug}`}
          aria-label={`View ${project.title} case study: ${cardDescription}`}
          className="flip-card-back rounded-2xl shadow-xl p-5 sm:p-6 flex flex-col justify-between text-left overflow-hidden select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ backgroundColor: accentColor }}
        >
          {/* Top Bar: Project Number and Arrow */}
          <div className="flex items-center justify-between text-white/90">
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              {formattedIndex}
            </span>
            <ArrowUpRight className="w-5 h-5 text-white/90" />
          </div>

          {/* Center: Bold White Description */}
          <div className="my-auto py-2">
            <p className="font-sans font-black text-lg sm:text-xl md:text-[22px] text-white tracking-tight leading-snug">
              {cardDescription}
            </p>
          </div>

          {/* Bottom Bar: Project Name ──── Category */}
          <div className="flex items-center justify-between text-white/80 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider pt-2 border-t border-white/20">
            <span className="font-bold truncate max-w-[60%]">{project.title}</span>
            <div className="h-[1px] bg-white/20 flex-1 mx-3" />
            <span className="text-white/70 shrink-0">{project.category}</span>
          </div>
        </Link>
      </div>

      {/* Accessible Mobile/Touch Manual Flip Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsFlippedManual((prev) => !prev);
        }}
        aria-label={
          isFlippedManual ? `Flip to front of ${project.title}` : `Flip to back of ${project.title}`
        }
        className="sm:hidden absolute bottom-2 right-2 z-10 p-1.5 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 transition-colors backdrop-blur-sm"
        title="Flip Card Preview"
      >
        <RotateCw className="w-3 h-3" />
      </button>
    </div>
  );
};
