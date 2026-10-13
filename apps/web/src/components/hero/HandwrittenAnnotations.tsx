import React from 'react';

/**
 * HandwrittenAnnotations Component
 *
 * Subtle, elegant editorial handwritten notes with curved organic arrows pointing toward:
 * 1. The Dynamic Island ("Touch me")
 * 2. The Corner Navigation Dial ("Take a look around")
 *
 * Non-interactive, pointer-events-none, aria-hidden="true", respecting prefers-reduced-motion.
 */
export const HandwrittenAnnotations: React.FC = () => {
  return (
    <div
      data-testid="handwritten-annotations"
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 z-30 overflow-hidden"
    >
      {/* =========================================================================
          1. DYNAMIC ISLAND ANNOTATION (DESKTOP & TABLET >= 640px)
          - Positioned beside the capsule to the left
          - Arrow curves upward-right pointing directly toward the capsule avatar
          ========================================================================= */}
      <div
        data-testid="annotation-dynamic-island-desktop"
        className="hidden sm:flex items-center gap-1.5 absolute top-[85px] right-[calc(51%+154px)] -rotate-1 pointer-events-none select-none"
      >
        <span className="font-handwriting text-[20px] lg:text-[30px] text-slate-700/90 font-medium tracking-wide whitespace-nowrap animate-annotation-label">
          Touch me
        </span>

        {/* Hand-drawn organic curved arrow */}
        <svg
          width="44"
          height="22"
          viewBox="0 0 44 22"
          fill="none"
          className="overflow-visible shrink-0 text-slate-600/80 -ml-0.5 mt-0.5"
          aria-hidden="true"
        >
          <path
            d="M 2 16 C 14 18, 28 13, 39 5"
            pathLength="80"
            className="animate-annotation-arrow"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 32 5 L 39 5 L 38 12"
            className="animate-arrowhead"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* =========================================================================
          1B. DYNAMIC ISLAND ANNOTATION (MOBILE < 640px)
          - Positioned gracefully below the capsule on the left
          - Arrow curves upward-right pointing toward the capsule
          ========================================================================= */}
      <div
        data-testid="annotation-dynamic-island-mobile"
        className="flex sm:hidden items-center gap-1 absolute top-[68px] left-5 -rotate-1 pointer-events-none select-none"
      >
        <span className="font-handwriting text-[16px] text-slate-700/90 font-medium tracking-wide whitespace-nowrap animate-annotation-label">
          Say hello ↗
        </span>

        {/* Compact curved arrow */}
        <svg
          width="32"
          height="20"
          viewBox="0 0 32 20"
          fill="none"
          className="overflow-visible shrink-0 text-slate-600/80 ml-0.5 -mt-1"
          aria-hidden="true"
        >
          <path
            d="M 2 16 C 10 14, 18 8, 26 2"
            pathLength="80"
            className="animate-annotation-arrow"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M 19 2 L 26 2 L 25 9"
            className="animate-arrowhead"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* =========================================================================
          2. CORNER NAVIGATION DIAL ANNOTATION (DESKTOP & TABLET >= 768px)
          - Positioned directly to the left of the idle 96px dial
          - Arrow curves upward-right toward the dial's quarter-circle arc
          - Omitted on small mobile (< 768px) to prevent crowded headers & protect hero title
          ========================================================================= */}
      <div
        data-testid="annotation-nav-dial"
        className="hidden md:flex items-center gap-1.5 absolute top-[40px] right-[112px] lg:right-[118px] rotate-1 pointer-events-none select-none"
      >
        <span className="font-handwriting text-[20px] lg:text-[22px] text-slate-700/90 font-medium tracking-wide whitespace-nowrap animate-annotation-label">
          Take a look around
        </span>

        {/* Hand-drawn curved arrow sweeping toward the dial arc */}
        <svg
          width="46"
          height="24"
          viewBox="0 0 46 24"
          fill="none"
          className="overflow-visible shrink-0 text-slate-600/80 ml-1 -mt-0.5"
          aria-hidden="true"
        >
          <path
            d="M 3 19 C 16 19, 28 14, 40 5"
            pathLength="80"
            className="animate-annotation-arrow"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 32 5 L 40 5 L 38 13"
            className="animate-arrowhead"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
