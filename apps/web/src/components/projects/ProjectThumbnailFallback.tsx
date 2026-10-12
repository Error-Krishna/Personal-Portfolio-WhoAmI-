import React from 'react';

interface ProjectThumbnailFallbackProps {
  id: string;
  title: string;
  category: string;
  accentColor?: string;
  className?: string;
}

export const ProjectThumbnailFallback: React.FC<ProjectThumbnailFallbackProps> = ({
  id,
  title,
  category,
  accentColor = '#0f172a',
  className = '',
}) => {
  switch (id) {
    case 'udhyog-saathi':
      return (
        <div
          className={`w-full h-full bg-slate-50 p-2.5 sm:p-3 flex flex-col justify-between font-sans select-none overflow-hidden ${className}`}
        >
          {/* Top header bar */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-600" />
              <span className="font-mono text-[9px] font-bold text-slate-800 tracking-wider">
                UDHYOG SAATHI
              </span>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            </div>
          </div>
          {/* Mini Dashboard Content */}
          <div className="grid grid-cols-3 gap-1.5 my-auto">
            <div className="p-1.5 rounded bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[7px] text-slate-400 font-mono">ORDERS</div>
              <div className="text-[11px] font-bold text-slate-900">1,247</div>
            </div>
            <div className="p-1.5 rounded bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[7px] text-slate-400 font-mono">CLIENTS</div>
              <div className="text-[11px] font-bold text-slate-900">842</div>
            </div>
            <div className="p-1.5 rounded bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="text-[7px] text-slate-400 font-mono">REVENUE</div>
              <div className="text-[11px] font-bold text-red-600">₹12.5L</div>
            </div>
          </div>
          {/* Mini Bar Chart Graphic */}
          <div className="flex items-end gap-1 h-7 pt-1 border-t border-slate-100">
            <div className="w-1/6 bg-slate-200 rounded-t h-[40%]" />
            <div className="w-1/6 bg-slate-200 rounded-t h-[65%]" />
            <div className="w-1/6 bg-slate-300 rounded-t h-[50%]" />
            <div className="w-1/6 bg-slate-300 rounded-t h-[80%]" />
            <div className="w-1/6 bg-red-500 rounded-t h-[95%]" />
            <div className="w-1/6 bg-red-600 rounded-t h-[75%]" />
          </div>
        </div>
      );

    case 'insightloop':
      return (
        <div
          className={`w-full h-full bg-[#0a0f1d] p-2.5 sm:p-3 flex flex-col justify-between font-mono select-none overflow-hidden text-slate-300 ${className}`}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="text-[9px] text-emerald-400 font-bold">INSIGHTLOOP · LIVE</span>
            <span className="text-[8px] text-slate-500">WS SYNC</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 my-auto">
            <div className="p-1.5 rounded bg-white/5 border border-white/10">
              <div className="text-[7px] text-slate-400">NET MARGIN</div>
              <div className="text-[10px] font-bold text-emerald-400">+28.4%</div>
            </div>
            <div className="p-1.5 rounded bg-white/5 border border-white/10">
              <div className="text-[7px] text-slate-400">ACTIVE STREAMS</div>
              <div className="text-[10px] font-bold text-white">4 CHANNELS</div>
            </div>
          </div>
          <div className="flex items-end gap-1 h-7 border-t border-white/5 pt-1">
            <div className="w-1/5 bg-emerald-600/60 rounded-t h-[50%]" />
            <div className="w-1/5 bg-emerald-500/80 rounded-t h-[75%]" />
            <div className="w-1/5 bg-emerald-400 rounded-t h-[90%]" />
            <div className="w-1/5 bg-emerald-500/80 rounded-t h-[60%]" />
            <div className="w-1/5 bg-emerald-600 rounded-t h-[85%]" />
          </div>
        </div>
      );

    case 'parallel':
      return (
        <div
          className={`w-full h-full bg-[#0f111a] p-2.5 sm:p-3 flex flex-col justify-between font-sans select-none overflow-hidden text-white ${className}`}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="font-mono text-[9px] font-bold text-indigo-300">PARALLEL</span>
            </div>
            <span className="text-[8px] font-mono text-slate-400">CHANNELS</span>
          </div>
          <div className="space-y-1 my-auto">
            <div className="flex items-center gap-1.5 p-1 rounded bg-white/5 border border-white/5 text-[8px]">
              <span className="text-indigo-400 font-bold">#</span>
              <span className="text-slate-300 font-mono">founders-talk</span>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded bg-indigo-950/60 border border-indigo-500/20 text-[8px]">
              <span className="text-indigo-400 font-bold">#</span>
              <span className="text-white font-mono font-medium">engineering-hub</span>
            </div>
          </div>
          <div className="text-[8px] font-mono text-slate-400 pt-1 border-t border-white/5 flex items-center justify-between">
            <span>COMMUNITY</span>
            <span className="text-indigo-300">ONLINE</span>
          </div>
        </div>
      );

    case 'hotreload':
      return (
        <div
          className={`w-full h-full bg-[#121214] p-2.5 sm:p-3 flex flex-col justify-between font-mono select-none overflow-hidden text-emerald-400 ${className}`}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[8px] text-slate-500">CLI · GO</span>
          </div>
          <div className="text-[8px] space-y-0.5 leading-tight my-auto text-slate-300">
            <div className="text-slate-400">$ hotreload --watch</div>
            <div className="text-emerald-400">✓ watching 24 files</div>
            <div className="text-amber-300">↺ restart in 2.1ms</div>
          </div>
          <div className="text-[8px] text-slate-500 pt-1 border-t border-white/5 flex items-center justify-between">
            <span>PROCESS: RUNNING</span>
            <span className="text-emerald-400">PORT 8080</span>
          </div>
        </div>
      );

    case 'personal-finance-tracker':
      return (
        <div
          className={`w-full h-full bg-[#f8fafc] p-2.5 sm:p-3 flex flex-col justify-between font-sans select-none overflow-hidden ${className}`}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <span className="font-mono text-[9px] font-bold text-slate-800">FINANCE TRACKER</span>
            <span className="font-mono text-[8px] text-emerald-600 font-semibold">PRIVATE</span>
          </div>
          <div className="p-2 rounded bg-white border border-slate-200/80 my-auto shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="text-[8px] font-mono text-slate-400">NET ASSETS</div>
            <div className="text-xs font-bold text-slate-900">$24,850</div>
            <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-full w-[70%]" />
            </div>
          </div>
          <div className="text-[8px] font-mono text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>EXPENSES</span>
            <span className="text-slate-900 font-medium">-14.2%</span>
          </div>
        </div>
      );

    case 'krishna-portfolio':
      return (
        <div
          className={`w-full h-full bg-[#18100c] p-2.5 sm:p-3 flex flex-col justify-between font-sans select-none overflow-hidden text-white ${className}`}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-mono text-[9px] font-bold text-amber-300">KRISHNAOS</span>
            </div>
            <span className="text-[8px] font-mono text-slate-400">macOS UI</span>
          </div>
          <div className="my-auto text-center p-1.5 rounded bg-white/5 border border-white/10">
            <div className="font-hero text-[11px] uppercase tracking-wider text-amber-200">
              PORTFOLIO '26
            </div>
            <div className="text-[7px] font-mono text-slate-400">3D SCROLL & MONOREPO</div>
          </div>
          <div className="text-[8px] font-mono text-slate-400 pt-1 border-t border-white/5 flex items-center justify-between">
            <span>TYPESCRIPT</span>
            <span className="text-amber-400">TURBO</span>
          </div>
        </div>
      );

    default:
      return (
        <div
          className={`w-full h-full p-4 flex flex-col justify-between select-none overflow-hidden ${className}`}
          style={{ backgroundColor: accentColor }}
        >
          <div className="font-mono text-[9px] uppercase tracking-widest text-white/70">
            {category}
          </div>
          <div className="font-hero text-sm uppercase text-white font-black tracking-tight">
            {title}
          </div>
          <div className="font-mono text-[8px] text-white/50 tracking-wider">PROJECT PREVIEW</div>
        </div>
      );
  }
};
