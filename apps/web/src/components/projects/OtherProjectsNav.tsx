import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { type ProjectItem } from '../../lib/config/site-config.js';
import { ProjectThumbnailFallback } from './ProjectThumbnailFallback.js';

interface OtherProjectsNavProps {
  projects: ProjectItem[];
}

export const OtherProjectsNav: React.FC<OtherProjectsNavProps> = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full pt-16 sm:pt-20 border-t border-slate-300/80">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-xs tracking-widest text-slate-800 font-bold uppercase block">
            OTHER PROJECTS
          </span>
          <p className="font-sans text-xs text-slate-500 mt-0.5">
            Explore other things I've built.
          </p>
        </div>

        <Link
          to="/#projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-bold text-slate-800 hover:text-red-600 transition-colors"
        >
          <span>Explore All Projects</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Compact Cards Grid (Panel 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((item) => (
          <Link
            key={item.slug}
            to={`/work/${item.slug}`}
            className="group p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-slate-950/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all flex items-center gap-3.5 select-none"
          >
            {/* Small Thumbnail */}
            <div className="w-14 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : item.heroImage ? (
                <img
                  src={item.heroImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <ProjectThumbnailFallback
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  accentColor={item.accentColor}
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Title and Arrow */}
            <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
              <span className="font-sans font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors truncate">
                {item.title}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-950 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
