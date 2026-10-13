import React, { useState, useMemo } from 'react';
import {
  Layout,
  Server,
  Database,
  TerminalSquare,
  Film,
  ArrowRight,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { siteConfig, type SkillItem } from '../../lib/config/site-config.js';
import { TechLogo } from './TechLogos.js';
import { TechStackTower, type TowerItem } from './TechStackTower.js';

interface TechNode {
  name: string;
  category: 'FRONTEND' | 'BACKEND' | 'DATABASES' | 'TOOLS' | 'CREATIVE';
  x: number;
  y: number;
  labelXOffset?: number;
  labelYOffset?: number;
  isPrimary?: boolean;
}

const TECH_NODES: TechNode[] = [
  // FRONTEND (Top-Right Sector)
  { name: 'React.js', category: 'FRONTEND', x: 435, y: 245, isPrimary: true },
  { name: 'TypeScript', category: 'FRONTEND', x: 505, y: 350, isPrimary: true },
  { name: 'Tailwind CSS', category: 'FRONTEND', x: 535, y: 265 },
  { name: 'JavaScript (ES6+)', category: 'FRONTEND', x: 420, y: 160 },
  { name: 'HTML5 & CSS3', category: 'FRONTEND', x: 450, y: 85 },

  // BACKEND (Bottom-Right Sector)
  { name: 'Node.js', category: 'BACKEND', x: 395, y: 420, isPrimary: true },
  { name: 'Express.js', category: 'BACKEND', x: 355, y: 515 },
  { name: 'Python', category: 'BACKEND', x: 485, y: 460, isPrimary: true },
  { name: 'Django / DRF', category: 'BACKEND', x: 295, y: 550 },
  { name: 'REST APIs', category: 'BACKEND', x: 235, y: 460 },

  // DATABASES (Bottom-Left Sector)
  { name: 'MongoDB', category: 'DATABASES', x: 185, y: 405, isPrimary: true },
  { name: 'PostgreSQL & SQL', category: 'DATABASES', x: 95, y: 430, isPrimary: true },
  { name: 'Redis', category: 'DATABASES', x: 95, y: 335 },

  // TOOLS & INFRA (Left / Mid-Left Sector)
  { name: 'Docker', category: 'TOOLS', x: 150, y: 235, isPrimary: true },
  { name: 'Git & GitHub', category: 'TOOLS', x: 115, y: 145 },
  { name: 'Linux & CLI', category: 'TOOLS', x: 65, y: 245 },
  { name: 'Go (Golang)', category: 'TOOLS', x: 220, y: 140, isPrimary: true },

  // CREATIVE (Top-Left / Top Sector)
  { name: 'Video Editing', category: 'CREATIVE', x: 295, y: 135, isPrimary: true },
  { name: 'Visual Storytelling', category: 'CREATIVE', x: 255, y: 65 },
  { name: 'UI/UX Design Awareness', category: 'CREATIVE', x: 175, y: 75 },
];

// Structural inter-tech relationships
const INTER_CONNECTIONS: [string, string][] = [
  ['React.js', 'TypeScript'],
  ['React.js', 'Tailwind CSS'],
  ['React.js', 'JavaScript (ES6+)'],
  ['Node.js', 'Express.js'],
  ['Node.js', 'MongoDB'],
  ['Python', 'Django / DRF'],
  ['Python', 'PostgreSQL & SQL'],
  ['Docker', 'Linux & CLI'],
  ['Docker', 'Node.js'],
  ['Video Editing', 'Visual Storytelling'],
];

interface CategoryDef {
  id: 'FRONTEND' | 'BACKEND' | 'DATABASES' | 'TOOLS' | 'CREATIVE';
  num: string;
  label: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'FRONTEND', num: '01', label: 'FRONTEND', icon: Layout },
  { id: 'BACKEND', num: '02', label: 'BACKEND', icon: Server },
  { id: 'DATABASES', num: '03', label: 'DATABASES', icon: Database },
  { id: 'TOOLS', num: '04', label: 'TOOLS & INFRA', icon: TerminalSquare },
  { id: 'CREATIVE', num: '05', label: 'CREATIVE', icon: Film },
];

export const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryDef['id']>('FRONTEND');
  const [selectedTech, setSelectedTech] = useState<string>('React.js');
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [towerStack, setTowerStack] = useState<TowerItem[]>([
    { id: 'dock-init', name: 'Docker', category: 'TOOLS', colorIndex: 3, addedAt: 0 },
    { id: 'pg-init', name: 'PostgreSQL & SQL', category: 'DATABASES', colorIndex: 2, addedAt: 0 },
    { id: 'node-init', name: 'Node.js', category: 'BACKEND', colorIndex: 1, addedAt: 0 },
    { id: 'react-init', name: 'React.js', category: 'FRONTEND', colorIndex: 0, addedAt: 0 },
  ]);
  const [isShattering, setIsShattering] = useState<boolean>(false);

  // Dynamic category counts from configuration
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = siteConfig.skills.filter((s) => s.category === cat.id).length;
    });
    return counts;
  }, []);

  // Current active technology object
  const activeSkillObj: SkillItem | undefined = useMemo(() => {
    return siteConfig.skills.find((s) => s.name === selectedTech);
  }, [selectedTech]);

  // Handle tech node selection
  const handleSelectTech = (techName: string, category: CategoryDef['id']) => {
    setSelectedTech(techName);
    setActiveCategory(category);
  };

  // Stack Builder Assignment - drops new cylinder onto Hanoi tower
  const handleAssignToStack = (techName: string, category: CategoryDef['id']) => {
    if (isShattering) return;

    // Drop new cylinder onto Hanoi tower (max 6 blocks)
    setTowerStack((prev) => {
      const maxCapacity = 6;
      let next = [...prev];
      if (next.length >= maxCapacity) {
        next = next.slice(1);
      }
      const nextColorIndex = (next.length > 0 ? next[next.length - 1].colorIndex + 1 : 0) % 8;
      return [
        ...next,
        {
          id: `${techName}-${Date.now()}`,
          name: techName,
          category,
          colorIndex: nextColorIndex,
          addedAt: Date.now(),
        },
      ];
    });
  };

  // Reset stack with breaking pieces shatter physics
  const handleResetStack = () => {
    if (isShattering) return;

    if (towerStack.length === 0) {
      setTowerStack([
        { id: 'dock-init', name: 'Docker', category: 'TOOLS', colorIndex: 3, addedAt: 0 },
        { id: 'pg-init', name: 'PostgreSQL & SQL', category: 'DATABASES', colorIndex: 2, addedAt: 0 },
        { id: 'node-init', name: 'Node.js', category: 'BACKEND', colorIndex: 1, addedAt: 0 },
        { id: 'react-init', name: 'React.js', category: 'FRONTEND', colorIndex: 0, addedAt: 0 },
      ]);
      return;
    }

    setIsShattering(true);

    setTimeout(() => {
      setTowerStack([]);
      setIsShattering(false);
    }, 750);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeFocusTech = hoveredTech || selectedTech;

  return (
    <section
      id="skills"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-12 lg:px-16 py-20 lg:py-28 border-t border-slate-300/80"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* =========================================================================
            1. SECTION HEADER
           ========================================================================= */}
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            SKILLS / 02
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 lg:mb-16 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92]">
              BUILD YOUR<br />TECH STACK.
            </h2>
          </div>
          <div className="lg:col-span-5 pb-1">
            <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
              Explore my tech ecosystem and see how different technologies come together to build real products.
            </p>
          </div>
        </div>

        {/* =========================================================================
            2. THREE-COLUMN DESKTOP COMPOSITION (Left: Categories | Center: Map | Right: Details)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start mb-16">
          {/* -----------------------------------------------------------------------
              LEFT PANEL: Vertical Technology Categories
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold px-1 mb-2">
              CATEGORIES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      // Select first technology in that category
                      const firstTech = TECH_NODES.find((n) => n.category === cat.id);
                      if (firstTech) setSelectedTech(firstTech.name);
                    }}
                    className={`group w-full p-4 rounded-xl text-left border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 text-white border-slate-950 shadow-md translate-x-1'
                        : 'bg-white/80 hover:bg-white text-slate-800 border-slate-300/80 hover:border-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isActive ? 'text-red-500' : 'text-slate-400 group-hover:text-slate-900'
                        }`}
                      >
                        {cat.num}
                      </span>

                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white'
                        } transition-colors`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>

                      <span className="font-sans font-bold text-xs sm:text-sm tracking-tight uppercase">
                        {cat.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive
                            ? 'text-red-500 translate-x-0.5'
                            : 'text-slate-400 group-hover:text-slate-900'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              CENTER: Branching Technology Ecosystem (Responsive SVG Map)
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 bg-white/70 rounded-2xl border border-slate-300/80 p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />

            {/* Instruction pill */}
            <div className="font-mono text-[11px] tracking-wider uppercase text-slate-500 bg-white/90 border border-slate-200 px-3 py-1 rounded-full mb-3 shadow-xs flex items-center gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              INTERACTIVE ECOSYSTEM · CLICK NODE TO EXPLORE
            </div>

            <div className="w-full max-w-[560px] aspect-square relative select-none">
              <svg viewBox="0 0 600 600" className="w-full h-full">
                <defs>
                  {/* Portrait circular crop */}
                  <clipPath id="center-portrait-clip">
                    <circle cx="300" cy="300" r="42" />
                  </clipPath>

                  {/* Red drop shadow filter */}
                  <filter id="crimson-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#dc2626" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Concentric Orbital Guide Rings */}
                <circle cx="300" cy="300" r="130" fill="none" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 4" />
                <circle cx="300" cy="300" r="200" fill="none" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 4" />
                <circle cx="300" cy="300" r="265" fill="none" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 4" />

                {/* Inter-technology connections */}
                {INTER_CONNECTIONS.map(([src, dst], idx) => {
                  const node1 = TECH_NODES.find((n) => n.name === src);
                  const node2 = TECH_NODES.find((n) => n.name === dst);
                  if (!node1 || !node2) return null;

                  const isConnectedActive =
                    (activeFocusTech === src || activeFocusTech === dst) &&
                    (node1.category === activeCategory || node2.category === activeCategory);

                  return (
                    <line
                      key={`inter-${idx}`}
                      x1={node1.x}
                      y1={node1.y}
                      x2={node2.x}
                      y2={node2.y}
                      stroke={isConnectedActive ? '#dc2626' : 'rgba(0,0,0,0.06)'}
                      strokeWidth={isConnectedActive ? 1.75 : 1}
                      strokeDasharray={isConnectedActive ? 'none' : '2 3'}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Radial Branches from Center to Nodes */}
                {TECH_NODES.map((node) => {
                  const isNodeCategoryActive = node.category === activeCategory;
                  const isNodeSelected = activeFocusTech === node.name;

                  return (
                    <line
                      key={`radial-${node.name}`}
                      x1="300"
                      y1="300"
                      x2={node.x}
                      y2={node.y}
                      stroke={
                        isNodeSelected
                          ? '#dc2626'
                          : isNodeCategoryActive
                          ? 'rgba(220, 38, 38, 0.4)'
                          : 'rgba(0,0,0,0.07)'
                      }
                      strokeWidth={isNodeSelected ? 2 : isNodeCategoryActive ? 1.25 : 0.75}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Center Portrait Element */}
                <g className="cursor-pointer" onClick={() => setSelectedTech('React.js')}>
                  {/* Outer delicate ring */}
                  <circle cx="300" cy="300" r="54" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                  {/* Outer solid border */}
                  <circle cx="300" cy="300" r="46" fill="#f8f6f0" stroke="#dc2626" strokeWidth="2.5" />
                  {/* Actual Photo */}
                  <image
                    href={siteConfig.assets?.aboutPortrait || '/images/about-portrait-red.png'}
                    x="256"
                    y="256"
                    width="88"
                    height="88"
                    clipPath="url(#center-portrait-clip)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  {/* Small red live indicator dot */}
                  <circle cx="334" cy="266" r="4.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                </g>

                {/* Technology Nodes */}
                {TECH_NODES.map((node) => {
                  const isCategoryActive = node.category === activeCategory;
                  const isSelected = selectedTech === node.name;
                  const isHovered = hoveredTech === node.name;
                  const isHighlighted = isSelected || isHovered;

                  const opacity = isCategoryActive ? 1 : 0.4;
                  const radius = node.isPrimary ? 22 : 18;

                  return (
                    <g
                      key={node.name}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${node.name}`}
                      onMouseEnter={() => setHoveredTech(node.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                      onClick={() => handleSelectTech(node.name, node.category)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSelectTech(node.name, node.category);
                        }
                      }}
                      className="cursor-pointer transition-all duration-200 outline-none group"
                      style={{ opacity }}
                    >
                      {/* Highlight Outer Ring */}
                      {isHighlighted && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius + 6}
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          className="animate-spin-slow origin-center"
                        />
                      )}

                      {/* Node White Circle Base */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius}
                        fill="#ffffff"
                        stroke={isHighlighted ? '#dc2626' : isCategoryActive ? '#0f1117' : '#cbd5e1'}
                        strokeWidth={isHighlighted ? 2.5 : 1.5}
                        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.06))"
                        className="transition-all duration-200 group-hover:scale-110"
                      />

                      {/* Logo Icon via ForeignObject */}
                      <foreignObject
                        x={node.x - (radius - 4)}
                        y={node.y - (radius - 4)}
                        width={(radius - 4) * 2}
                        height={(radius - 4) * 2}
                        className="pointer-events-none"
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <TechLogo name={node.name} size={node.isPrimary ? 20 : 16} />
                        </div>
                      </foreignObject>

                      {/* Technology Text Label */}
                      <text
                        x={node.x}
                        y={node.y + radius + 13}
                        textAnchor="middle"
                        className={`font-sans text-[10px] font-bold tracking-tight select-none pointer-events-none ${
                          isHighlighted ? 'fill-red-600' : isCategoryActive ? 'fill-slate-900' : 'fill-slate-500'
                        }`}
                      >
                        {node.name.replace(' (ES6+)', '').replace(' & CSS3', '').replace(' / DRF', '').replace(' & SQL', '').replace(' & GitHub', '').replace(' & CLI', '').replace(' (Golang)', '')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
              RIGHT PANEL: Selected Technology & Related Projects
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            {/* Selected Tech Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-300/80 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                    <TechLogo name={selectedTech} size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-sans font-black text-lg text-slate-950 tracking-tight leading-tight truncate">
                      {selectedTech}
                    </h3>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-red-600 block mt-0.5">
                      {activeCategory}
                    </span>
                  </div>
                </div>

                {/* Add to Stack Action */}
                <button
                  type="button"
                  onClick={() => handleAssignToStack(selectedTech, activeCategory)}
                  title="Assign to Tech Stack"
                  className="px-2.5 py-1.5 rounded-md bg-slate-950 hover:bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  ADD TO STACK
                </button>
              </div>

              {activeSkillObj?.description && (
                <p className="font-sans text-xs text-slate-600 leading-relaxed mt-3">
                  {activeSkillObj.description}
                </p>
              )}
            </div>

            {/* Tech Stack Tower (Tower of Hanoi interactive physics game) */}
            <TechStackTower
              stack={towerStack}
              onReset={handleResetStack}
              onDiscuss={scrollToContact}
              isShattering={isShattering}
            />
          </div>
        </div>

        {/* =========================================================================
            3. BOTTOM CTA STRIP
           ========================================================================= */}
        <div className="pt-8 border-t border-slate-300/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                BUILD SOMETHING TOGETHER.
              </span>
            </div>
            <p className="font-sans text-sm text-slate-600">
              From idea to deployment, I combine the right technologies to build scalable and reliable products.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToContact}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-red-600/30 cursor-pointer shrink-0"
          >
            LET'S BUILD YOURS
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
