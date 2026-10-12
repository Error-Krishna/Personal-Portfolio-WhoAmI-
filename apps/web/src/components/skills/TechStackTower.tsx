import React, { useState, useEffect } from 'react';
import { RotateCcw, ArrowRight } from 'lucide-react';

export interface TowerItem {
  id: string;
  name: string;
  category: string;
  colorIndex: number;
  addedAt: number;
}

export interface DiscPalette {
  name: string;
  top: string;
  body: string;
  dark: string;
  text: string;
}

export const DISC_PALETTES: DiscPalette[] = [
  {
    name: 'crimson',
    top: '#f43f5e',
    body: '#e11d48',
    dark: '#9f1239',
    text: '#ffffff',
  },
  {
    name: 'sapphire',
    top: '#60a5fa',
    body: '#2563eb',
    dark: '#1e40af',
    text: '#ffffff',
  },
  {
    name: 'emerald',
    top: '#34d399',
    body: '#059669',
    dark: '#065f46',
    text: '#ffffff',
  },
  {
    name: 'amber',
    top: '#fbbf24',
    body: '#d97706',
    dark: '#92400e',
    text: '#ffffff',
  },
  {
    name: 'purple',
    top: '#a78bfa',
    body: '#7c3aed',
    dark: '#5b21b6',
    text: '#ffffff',
  },
  {
    name: 'teal',
    top: '#2dd4bf',
    body: '#0d9488',
    dark: '#115e59',
    text: '#ffffff',
  },
  {
    name: 'orange',
    top: '#fb923c',
    body: '#ea580c',
    dark: '#9a3412',
    text: '#ffffff',
  },
  {
    name: 'indigo',
    top: '#818cf8',
    body: '#4f46e5',
    dark: '#3730a3',
    text: '#ffffff',
  },
];

const SHARD_SHAPES = [
  'polygon(0% 0%, 100% 25%, 80% 100%, 10% 90%)',
  'polygon(25% 0%, 100% 0%, 75% 100%, 0% 80%)',
  'polygon(0% 20%, 85% 0%, 100% 80%, 15% 100%)',
  'polygon(10% 0%, 100% 30%, 90% 100%, 0% 100%)',
  'polygon(30% 0%, 100% 10%, 70% 100%, 0% 90%)',
  'polygon(0% 10%, 90% 0%, 100% 100%, 20% 90%)',
  'polygon(15% 0%, 100% 0%, 85% 100%, 0% 85%)',
  'polygon(0% 0%, 80% 30%, 100% 100%, 30% 90%)',
];

interface Shard {
  id: string;
  colOffset: number;
  bottom: number;
  width: number;
  height: number;
  color: string;
  vx: number;
  vy: number;
  rot: number;
  clipPath: string;
}

interface TechStackTowerProps {
  stack: TowerItem[];
  onReset: () => void;
  onDiscuss?: () => void;
  isShattering?: boolean;
}

export const TechStackTower: React.FC<TechStackTowerProps> = ({
  stack,
  onReset,
  onDiscuss,
  isShattering = false,
}) => {
  const [shards, setShards] = useState<Shard[]>([]);

  // Generate shatter fragments when isShattering triggers
  useEffect(() => {
    if (isShattering && stack.length > 0) {
      const generated: Shard[] = [];
      stack.forEach((item, index) => {
        const discBottom = 24 + index * 32;
        const discWidth = Math.max(120, 216 - index * 16);
        const palette = DISC_PALETTES[item.colorIndex % DISC_PALETTES.length];

        // Generate 8 polygonal pieces for each disc
        for (let j = 0; j < 8; j++) {
          const col = j % 4;
          const row = Math.floor(j / 4);
          const colOffset = (col - 1.5) * (discWidth / 4) + (Math.random() - 0.5) * 10;
          const rowOffset = (row === 0 ? 16 : 4) + (Math.random() - 0.5) * 4;
          const isLeft = col < 2;

          generated.push({
            id: `shard-${item.id}-${j}`,
            colOffset,
            bottom: discBottom + rowOffset,
            width: 18 + Math.random() * 10,
            height: 12 + Math.random() * 8,
            color: j % 2 === 0 ? palette.body : palette.top,
            vx: isLeft ? -(50 + Math.random() * 120) : 50 + Math.random() * 120,
            vy: -(60 + Math.random() * 90),
            rot: (Math.random() - 0.5) * 540,
            clipPath: SHARD_SHAPES[j % SHARD_SHAPES.length],
          });
        }
      });
      setShards(generated);
    } else if (!isShattering) {
      setShards([]);
    }
  }, [isShattering, stack]);

  const maxCapacity = 6;
  const isFull = stack.length >= maxCapacity;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-300/80 shadow-xs flex flex-col justify-between relative overflow-hidden select-none">
      {/* Dynamic Keyframes for Hanoi Falling Cylinder & Shattering Pieces */}
      <style>{`
        @keyframes cylinderHanoiDrop {
          0% {
            transform: translateX(-50%) translateY(-270px) scale(0.95);
            opacity: 0.85;
          }
          52% {
            transform: translateX(-50%) translateY(0) scale(1.02);
            opacity: 1;
          }
          70% {
            transform: translateX(-50%) translateY(-14px) scale(0.98);
          }
          84% {
            transform: translateX(-50%) translateY(0) scale(1.01);
          }
          92% {
            transform: translateX(-50%) translateY(-3px);
          }
          100% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes shardExplosion {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          35% {
            transform: translate(calc(var(--sh-vx) * 0.45), calc(var(--sh-vy) * 0.65)) rotate(calc(var(--sh-rot) * 0.45)) scale(1.05);
            opacity: 0.95;
          }
          100% {
            transform: translate(var(--sh-vx), calc(var(--sh-vy) + 240px)) rotate(var(--sh-rot)) scale(0.35);
            opacity: 0;
          }
        }

        .animate-cylinder-drop {
          animation: cylinderHanoiDrop 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-shard {
          animation: shardExplosion 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-red-600 font-bold block mb-0.5">
            TOWER OF HANOI STACK
          </span>
          <h4 className="font-sans font-black text-sm text-slate-950 uppercase tracking-tight">
            CUSTOM STACK TOWER
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-700">
            {stack.length}/{maxCapacity} BLOCKS
          </span>
          <button
            type="button"
            onClick={onReset}
            title="Break stack into pieces"
            className="font-mono text-[10px] font-bold text-slate-600 hover:text-red-600 uppercase flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-200"
          >
            <RotateCcw className="w-3 h-3" />
            RESET TOWER
          </button>
        </div>
      </div>

      {/* Stage: Hanoi Pole & Stacking Cylinders Canvas */}
      <div className="relative w-full h-[270px] bg-gradient-to-b from-slate-50 via-white to-slate-100/70 rounded-lg border border-slate-200/80 overflow-hidden my-3 flex items-end justify-center">
        {/* Background Level Guidelines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-6 px-4 opacity-30">
          {[6, 5, 4, 3, 2, 1].map((lvl) => (
            <div key={lvl} className="w-full border-b border-dashed border-slate-400/60 flex justify-between items-end">
              <span className="font-mono text-[8px] text-slate-400 select-none">LVL {lvl}</span>
              <span className="font-mono text-[8px] text-slate-400 select-none">{lvl * 15}%</span>
            </div>
          ))}
        </div>

        {/* ===================================================================
            1. THE CENTRAL HANOI POLE
           =================================================================== */}
        <div
          className="absolute z-10 w-3 rounded-t-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border border-slate-400/60 shadow-sm"
          style={{
            left: '50%',
            bottom: '18px',
            height: '215px',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Metallic Tip Cap */}
          <div className="absolute -top-1.5 -left-[2px] w-4 h-4 rounded-full bg-gradient-to-b from-white via-slate-200 to-slate-400 border border-slate-400 shadow-xs" />
        </div>

        {/* ===================================================================
            2. THE BASE PLATE / PEDESTAL
           =================================================================== */}
        <div
          className="absolute z-0 w-52 h-[18px] rounded-b-xl bg-gradient-to-b from-slate-800 to-slate-950 border-t border-slate-600 shadow-md flex items-start justify-center"
          style={{
            left: '50%',
            bottom: '10px',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Top Ellipse Face of the Base Plate */}
          <div className="w-full h-3.5 rounded-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border border-slate-500/50 shadow-inner" />
        </div>

        {/* ===================================================================
            3. STACKED CYLINDERS (WHEN NOT SHATTERING)
           =================================================================== */}
        {!isShattering &&
          stack.map((item, index) => {
            const discWidth = Math.max(120, 216 - index * 16);
            const discBottom = 24 + index * 32;
            const palette = DISC_PALETTES[item.colorIndex % DISC_PALETTES.length];
            const isJustAdded = Date.now() - item.addedAt < 900;

            return (
              <div
                key={item.id}
                style={{
                  left: '50%',
                  bottom: `${discBottom}px`,
                  width: `${discWidth}px`,
                  height: '32px',
                  zIndex: 20 + index,
                }}
                className={`absolute flex flex-col items-center justify-center pointer-events-none transition-all ${
                  isJustAdded ? 'animate-cylinder-drop' : '-translate-x-1/2'
                }`}
              >
                {/* 3D Top Face Ellipse */}
                <div
                  className="absolute -top-1.5 left-0 right-0 h-3.5 rounded-full border border-white/40 shadow-xs flex items-center justify-center"
                  style={{ backgroundColor: palette.top }}
                >
                  {/* Center Pole Hole (Pole passes through) */}
                  <div className="w-3.5 h-2 rounded-full bg-slate-900/50 border border-black/30 shadow-inner" />
                </div>

                {/* Cylinder Front Face Body */}
                <div
                  className="w-full h-6 rounded-b-md shadow-md flex items-center justify-center relative overflow-hidden border-b border-black/30"
                  style={{ backgroundColor: palette.body }}
                >
                  {/* Cylindrical lighting gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/30 pointer-events-none" />

                  {/* Technology Label */}
                  <span className="font-sans font-black text-[10px] sm:text-[11px] text-white tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] truncate px-2 z-10">
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}

        {/* ===================================================================
            4. SHATTERED PIECES (DURING RESET BREAKDOWN)
           =================================================================== */}
        {isShattering &&
          shards.map((shard) => (
            <div
              key={shard.id}
              style={
                {
                  left: `calc(50% + ${shard.colOffset}px)`,
                  bottom: `${shard.bottom}px`,
                  width: `${shard.width}px`,
                  height: `${shard.height}px`,
                  backgroundColor: shard.color,
                  clipPath: shard.clipPath,
                  '--sh-vx': `${shard.vx}px`,
                  '--sh-vy': `${shard.vy}px`,
                  '--sh-rot': `${shard.rot}deg`,
                  zIndex: 40,
                } as React.CSSProperties
              }
              className="absolute animate-shard pointer-events-none border border-white/20 shadow-xs"
            />
          ))}

        {/* Empty state hint */}
        {!isShattering && stack.length === 0 && (
          <div className="absolute top-10 left-0 right-0 text-center px-4 pointer-events-none">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400 bg-white/90 border border-slate-200 px-2.5 py-1 rounded-full shadow-xs">
              POLE IS EMPTY
            </span>
          </div>
        )}
      </div>

      {/* Footer Instructions / Status */}
      <div className="pt-1 text-center">
        <p className="font-sans text-[11px] text-slate-500 leading-normal">
          {stack.length === 0
            ? 'Select any technology on the map & click "+ ADD TO STACK" to drop a block.'
            : isFull
            ? 'Tower reached max capacity! Click RESET TOWER to break it into pieces.'
            : `${maxCapacity - stack.length} more blocks can be stacked onto this tower.`}
        </p>

        {stack.length > 0 && onDiscuss && (
          <button
            type="button"
            onClick={onDiscuss}
            className="w-full mt-2.5 py-2 px-3 rounded-lg bg-slate-950 hover:bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            DISCUSS THIS STACK
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
