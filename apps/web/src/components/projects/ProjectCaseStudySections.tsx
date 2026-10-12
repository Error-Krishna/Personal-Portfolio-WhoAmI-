import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Cpu, Award, User } from 'lucide-react';
import { type ProjectItem } from '../../lib/config/site-config.js';

export type CaseStudyTabId = 'overview' | 'features' | 'architecture' | 'role' | 'outcomes';

interface ProjectCaseStudySectionsProps {
  project: ProjectItem;
}

export const ProjectCaseStudySections: React.FC<ProjectCaseStudySectionsProps> = ({ project }) => {
  // Architecture normalization
  const architectureConfig = useMemo(() => {
    return typeof project.architecture === 'string'
      ? { description: project.architecture }
      : project.architecture;
  }, [project.architecture]);

  // Contributions text
  const contributionText = project.myContribution || project.contributions;

  // Build list of valid tabs based on available data for THIS project
  const availableTabs = useMemo(() => {
    return [
      {
        id: 'overview' as CaseStudyTabId,
        number: '01',
        label: 'OVERVIEW',
        available: Boolean(project.overview),
      },
      {
        id: 'features' as CaseStudyTabId,
        number: '02',
        label: 'FEATURES',
        available: Boolean(project.features && project.features.length > 0),
      },
      {
        id: 'architecture' as CaseStudyTabId,
        number: '03',
        label: 'ARCHITECTURE',
        available: Boolean(architectureConfig?.description || architectureConfig?.components),
      },
      {
        id: 'role' as CaseStudyTabId,
        number: '04',
        label: 'MY ROLE',
        available: Boolean(contributionText || project.role),
      },
      {
        id: 'outcomes' as CaseStudyTabId,
        number: '05',
        label: 'OUTCOMES',
        available: Boolean(project.outcomes && project.outcomes.length > 0),
      },
    ].filter((t) => t.available);
  }, [project, architectureConfig, contributionText]);

  // Default to overview or first available section
  const [activeTab, setActiveTab] = useState<CaseStudyTabId>(() => {
    return availableTabs[0]?.id || 'overview';
  });

  // Whenever project changes, reset selected tab to overview or first available tab
  useEffect(() => {
    if (availableTabs.length > 0) {
      const defaultTab = availableTabs.find((t) => t.id === 'overview')?.id || availableTabs[0].id;
      setActiveTab(defaultTab);
    }
  }, [project.slug, availableTabs]);

  // If no case study sections have content, omit section
  if (availableTabs.length === 0) return null;

  // Keyboard navigation for tablist
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % availableTabs.length;
      setActiveTab(availableTabs[nextIdx].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + availableTabs.length) % availableTabs.length;
      setActiveTab(availableTabs[prevIdx].id);
    }
  };

  return (
    <div className="w-full mt-14 sm:mt-18">
      {/* ======================================================== */}
      {/* INTERACTIVE TAB NAVIGATION STRIP (Role: tablist)         */}
      {/* ======================================================== */}
      <div
        role="tablist"
        aria-label="Project Case Study Sections"
        className="flex items-center gap-6 sm:gap-10 border-b border-slate-300/80 pb-3 mb-10 overflow-x-auto no-scrollbar select-none"
      >
        {availableTabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative flex items-center gap-2 font-mono text-xs uppercase tracking-wider py-1.5 transition-colors duration-200 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-sm ${
                isActive
                  ? 'text-red-600 font-bold'
                  : 'text-slate-500 hover:text-slate-950 font-medium'
              }`}
            >
              <span className={isActive ? 'text-red-600 font-bold' : 'text-slate-400'}>
                {tab.number}
              </span>
              <span>{tab.label}</span>
              {/* Smooth active indicator underline */}
              <span
                aria-hidden="true"
                className={`absolute bottom-[-13px] left-0 right-0 h-[2px] bg-red-600 transition-all duration-200 ease-out origin-left ${
                  isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 pointer-events-none'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* ACTIVE CONTENT PANEL (Only the selected tab is mounted)  */}
      {/* ======================================================== */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="w-full min-h-[300px]"
      >
        <div key={activeTab} className="animate-tab-enter">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && project.overview && (
            <div className="space-y-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold block mb-2">
                  01 · OVERVIEW
                </span>
                <h2 className="font-hero font-black text-2xl sm:text-3xl lg:text-4xl text-slate-950 uppercase tracking-tight max-w-3xl leading-[1.05]">
                  {project.subtitle
                    ? `${project.subtitle.toUpperCase()}.`
                    : `${project.title.toUpperCase()}.`}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Narrative & Challenges */}
                <div className="lg:col-span-8 space-y-6">
                  <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed">
                    {project.overview}
                  </p>

                  {(project.problem || project.solution) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {project.problem && (
                        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                          <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-red-600 block mb-1.5">
                            THE CHALLENGE
                          </span>
                          <p className="font-sans text-sm text-slate-700 leading-relaxed">
                            {project.problem}
                          </p>
                        </div>
                      )}
                      {project.solution && (
                        <div className="p-5 rounded-xl bg-slate-950 text-white border border-slate-800 shadow-sm">
                          <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-emerald-400 block mb-1.5">
                            THE SOLUTION
                          </span>
                          <p className="font-sans text-sm text-slate-300 leading-relaxed">
                            {project.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Stats Highlights */}
                {project.stats && project.stats.length > 0 && (
                  <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                    {project.stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm"
                      >
                        <div className="font-hero font-black text-2xl sm:text-3xl text-slate-950 tracking-tight mb-1">
                          {stat.value}
                        </div>
                        <div className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FEATURES */}
          {activeTab === 'features' && project.features && (
            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold block mb-2">
                  02 · FEATURES
                </span>
                <h2 className="font-hero font-black text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight">
                  CORE CAPABILITIES & WORKFLOWS<span className="text-red-600">.</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {project.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-5 rounded-xl bg-white border border-slate-200/90 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="font-sans text-sm sm:text-base text-slate-800 leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ARCHITECTURE */}
          {activeTab === 'architecture' && architectureConfig && (
            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold block mb-2">
                  03 · ARCHITECTURE
                </span>
                <h2 className="font-hero font-black text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight">
                  TECHNICAL SYSTEM ARCHITECTURE<span className="text-red-600">.</span>
                </h2>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
                {architectureConfig.description && (
                  <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed">
                    {architectureConfig.description}
                  </p>
                )}

                {architectureConfig.diagramUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-4">
                    <img
                      src={architectureConfig.diagramUrl}
                      alt="System Architecture Diagram"
                      className="max-w-full h-auto mx-auto"
                    />
                  </div>
                )}

                {architectureConfig.components && architectureConfig.components.length > 0 && (
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold block mb-3">
                      SYSTEM COMPONENTS
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {architectureConfig.components.map((comp, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 uppercase font-medium"
                        >
                          <Cpu className="w-3.5 h-3.5 text-slate-500" />
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MY ROLE */}
          {activeTab === 'role' && (contributionText || project.role) && (
            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold block mb-2">
                  04 · MY ROLE
                </span>
                <h2 className="font-hero font-black text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight">
                  ENGINEERING CONTRIBUTIONS<span className="text-red-600">.</span>
                </h2>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-slate-100 text-xs font-mono text-slate-600">
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-950 uppercase">
                    <User className="w-3.5 h-3.5 text-red-600" />
                    {project.role}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span>TIMELINE: {project.date}</span>
                </div>

                {contributionText && (
                  <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed">
                    {contributionText}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: OUTCOMES */}
          {activeTab === 'outcomes' && project.outcomes && (
            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-red-600 font-bold block mb-2">
                  05 · OUTCOMES
                </span>
                <h2 className="font-hero font-black text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight">
                  VERIFIED OUTCOMES & IMPACT<span className="text-red-600">.</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {project.outcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-5 rounded-xl bg-white border border-slate-200/90 shadow-sm"
                  >
                    <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="font-sans text-sm sm:text-base text-slate-800 leading-relaxed">
                      {outcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
