import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, ChevronLeft } from 'lucide-react';

export interface DialDestination {
  id: string;
  label: string;
  index: string;
  angle: number; // Angle in degrees along the quarter-circle arc (0° = left/top edge, 90° = bottom/right edge)
}

export const DIAL_DESTINATIONS: DialDestination[] = [
  { id: 'hero', label: 'HOME', index: '01', angle: 12 },
  { id: 'about', label: 'ABOUT', index: '02', angle: 23 },
  { id: 'projects', label: 'WORK', index: '03', angle: 34 },
  { id: 'services', label: 'SERVICES', index: '04', angle: 45 },
  { id: 'how-it-works', label: 'PROCESS', index: '05', angle: 56 },
  { id: 'skills', label: 'SKILLS', index: '06', angle: 67 },
  { id: 'contact', label: 'CONTACT', index: '07', angle: 78 },
];

interface CornerNavigationDialProps {
  onTransitionChange?: (isTransitioning: boolean) => void;
}

export const CornerNavigationDial: React.FC<CornerNavigationDialProps> = ({
  onTransitionChange,
}) => {
  // Navigation State Separation:
  // actualSectionId = genuine page section displayed by website
  // previewedSectionId = destination currently indicated by red needle (scrub preview)
  const [actualSectionId, setActualSectionId] = useState<string>('hero');
  const [previewedSectionId, setPreviewedSectionId] = useState<string>('hero');

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Synchronization refs for high-frequency wheel events & asynchronous timers
  const actualSectionIdRef = useRef<string>('hero');
  const previewedSectionIdRef = useRef<string>('hero');
  const isNavigatingRef = useRef<boolean>(false);
  const isScrubbingRef = useRef<boolean>(false);

  const dialRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const settleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Wheel accumulation & trackpad dampening refs
  const wheelAccumulatorRef = useRef<number>(0);
  const lastStepTimeRef = useRef<number>(0);

  // Touch gesture tracking refs
  const touchStartYRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);
  const touchMovedRef = useRef<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const isInteractive = isOpen || isHovered || isScrubbing;

  // Keep refs synchronized with state
  useEffect(() => {
    actualSectionIdRef.current = actualSectionId;
  }, [actualSectionId]);

  useEffect(() => {
    previewedSectionIdRef.current = previewedSectionId;
  }, [previewedSectionId]);

  useEffect(() => {
    isNavigatingRef.current = isNavigating;
  }, [isNavigating]);

  useEffect(() => {
    isScrubbingRef.current = isScrubbing;
  }, [isScrubbing]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    };
  }, []);

  // Detect reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) return;
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMotionChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  // Passive section tracking via IntersectionObserver on homepage
  // Updates actualSectionId and previewedSectionId ONLY when user scrolls page normally
  useEffect(() => {
    if (!isHomePage || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // If scrubbing on dial or executing committed navigation transition, ignore passive observer updates
        if (isNavigatingRef.current || isScrubbingRef.current) return;

        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topEntry = visibleEntries[0];
          if (topEntry.target.id) {
            const newId = topEntry.target.id;
            setActualSectionId(newId);
            actualSectionIdRef.current = newId;

            // Needle follows actual section when not scrubbing
            setPreviewedSectionId(newId);
            previewedSectionIdRef.current = newId;
          }
        }
      },
      {
        threshold: [0.15, 0.4, 0.7],
        rootMargin: '-15% 0px -40% 0px',
      }
    );

    DIAL_DESTINATIONS.forEach((dest) => {
      const el = document.getElementById(dest.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [isHomePage]);

  // SINGLE WHOOSH NAVIGATION COMMIT LOGIC
  // Shared by both Settle Detector (after scroll) and Direct Click
  const commitNavigation = useCallback(
    (targetId: string, _immediate?: boolean) => {
      // Clear any pending settle debounce timer
      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
        settleTimeoutRef.current = null;
      }

      setIsScrubbing(false);
      isScrubbingRef.current = false;

      // If user selected the section that is already active on homepage,
      // return dial to idle state without triggering unnecessary scroll or whoosh
      if (targetId === actualSectionIdRef.current && isHomePage) {
        setPreviewedSectionId(targetId);
        previewedSectionIdRef.current = targetId;
        setIsOpen(false);
        setIsHovered(false);
        return;
      }

      setPreviewedSectionId(targetId);
      previewedSectionIdRef.current = targetId;
      setIsNavigating(true);
      isNavigatingRef.current = true;

      // Non-homepage routes (e.g. /work/:slug, /resume) navigate back to homepage with hash anchor
      if (!isHomePage) {
        setIsOpen(false);
        setIsHovered(false);
        setIsNavigating(false);
        isNavigatingRef.current = false;
        setActualSectionId(targetId);
        actualSectionIdRef.current = targetId;
        navigate(`/#${targetId}`);
        return;
      }

      // PHASE 2 — FOCUS: Activate whoosh transition layer
      onTransitionChange?.(true);

      if (isReducedMotion) {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'auto' });
        setActualSectionId(targetId);
        actualSectionIdRef.current = targetId;
        setIsOpen(false);
        setIsHovered(false);
        setIsNavigating(false);
        isNavigatingRef.current = false;
        onTransitionChange?.(false);
        return;
      }

      // PHASE 3 — NAVIGATION: Smoothly scroll directly to target section in ONE movement
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // PHASE 4 — SETTLE: Update actual active section and restore website to normal appearance
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setActualSectionId(targetId);
        actualSectionIdRef.current = targetId;
        setIsNavigating(false);
        isNavigatingRef.current = false;
        setIsOpen(false);
        setIsHovered(false);
        onTransitionChange?.(false);
      }, 650);
    },
    [isHomePage, isReducedMotion, navigate, onTransitionChange]
  );

  // SCROLL / SCRUB HANDLER OVER DIAL:
  // Step needle sequentially through destinations and reset debounced settle detector
  const handleDialScroll = useCallback(
    (delta: number) => {
      if (isNavigatingRef.current) return;

      setIsScrubbing(true);
      isScrubbingRef.current = true;

      // Snappy reversal: reset accumulator if scroll direction reverses
      if (
        (wheelAccumulatorRef.current > 0 && delta < -3) ||
        (wheelAccumulatorRef.current < 0 && delta > 3)
      ) {
        wheelAccumulatorRef.current = 0;
      }

      wheelAccumulatorRef.current += delta;

      const THRESHOLD = 35;
      const now = Date.now();

      // Convert accumulated input into deliberate destination steps with cooldown
      if (Math.abs(wheelAccumulatorRef.current) >= THRESHOLD) {
        if (now - lastStepTimeRef.current >= 80) {
          const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
          const currentIdx = DIAL_DESTINATIONS.findIndex(
            (d) => d.id === previewedSectionIdRef.current
          );
          const safeIdx = currentIdx >= 0 ? currentIdx : 0;
          // Clamp to valid range (no wrapping or out-of-bounds positions)
          const nextIdx = Math.max(0, Math.min(DIAL_DESTINATIONS.length - 1, safeIdx + direction));

          if (nextIdx !== safeIdx) {
            const nextDest = DIAL_DESTINATIONS[nextIdx];
            previewedSectionIdRef.current = nextDest.id;
            setPreviewedSectionId(nextDest.id);
          }

          wheelAccumulatorRef.current = 0;
          lastStepTimeRef.current = now;
        }
      }

      // RESET SETTLE TIMER on every incoming wheel event:
      // Guarantees no premature navigation during continuous gestures
      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
      }

      settleTimeoutRef.current = setTimeout(() => {
        commitNavigation(previewedSectionIdRef.current);
      }, 300);
    },
    [commitNavigation]
  );

  // Attach non-passive wheel event listener to dial container to capture scroll
  // and prevent underlying website from scrolling while scrubbing dial
  useEffect(() => {
    const dialEl = dialRef.current;
    if (!dialEl) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent underlying page scrolling exclusively when pointer is over dial
      e.preventDefault();
      e.stopPropagation();

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      handleDialScroll(delta);
    };

    dialEl.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      dialEl.removeEventListener('wheel', handleWheel);
    };
  }, [handleDialScroll]);

  // Touch event listeners for mobile/tablet scrub gesture
  useEffect(() => {
    const dialEl = dialRef.current;
    if (!dialEl) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
        touchStartXRef.current = e.touches[0].clientX;
        touchMovedRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaY = e.touches[0].clientY - touchStartYRef.current;
        const deltaX = e.touches[0].clientX - touchStartXRef.current;

        // If dragging over dial, capture input and step needle
        if (Math.abs(deltaY) > 18 || Math.abs(deltaX) > 18) {
          e.preventDefault();
          touchMovedRef.current = true;
          const delta = Math.abs(deltaY) >= Math.abs(deltaX) ? -deltaY : -deltaX;
          handleDialScroll(delta > 0 ? 35 : -35);
          touchStartYRef.current = e.touches[0].clientY;
          touchStartXRef.current = e.touches[0].clientX;
        }
      }
    };

    const handleTouchEnd = () => {
      if (touchMovedRef.current) {
        // Touch drag ended: allow settle timer to commit
      }
    };

    dialEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    dialEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    dialEl.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      dialEl.removeEventListener('touchstart', handleTouchStart);
      dialEl.removeEventListener('touchmove', handleTouchMove);
      dialEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleDialScroll]);

  // Keyboard navigation & outside click dismissal
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dialRef.current && !dialRef.current.contains(e.target as Node)) {
        // Cancel uncommitted preview and revert needle to actual section
        if (settleTimeoutRef.current) {
          clearTimeout(settleTimeoutRef.current);
          settleTimeoutRef.current = null;
        }
        if (previewedSectionIdRef.current !== actualSectionIdRef.current) {
          previewedSectionIdRef.current = actualSectionIdRef.current;
          setPreviewedSectionId(actualSectionIdRef.current);
        }
        setIsScrubbing(false);
        isScrubbingRef.current = false;
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: cancel preview and return needle to actual active section
      if (e.key === 'Escape') {
        if (settleTimeoutRef.current) {
          clearTimeout(settleTimeoutRef.current);
          settleTimeoutRef.current = null;
        }
        previewedSectionIdRef.current = actualSectionIdRef.current;
        setPreviewedSectionId(actualSectionIdRef.current);
        setIsScrubbing(false);
        isScrubbingRef.current = false;
        setIsOpen(false);
        setIsHovered(false);
        return;
      }

      // Arrow Down / Arrow Right: preview next destination (does NOT navigate yet)
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setIsScrubbing(true);
        isScrubbingRef.current = true;
        if (settleTimeoutRef.current) {
          clearTimeout(settleTimeoutRef.current);
          settleTimeoutRef.current = null;
        }
        const currentIdx = DIAL_DESTINATIONS.findIndex(
          (d) => d.id === previewedSectionIdRef.current
        );
        const safeIdx = currentIdx >= 0 ? currentIdx : 0;
        const nextIdx = Math.min(DIAL_DESTINATIONS.length - 1, safeIdx + 1);
        const nextDest = DIAL_DESTINATIONS[nextIdx];
        previewedSectionIdRef.current = nextDest.id;
        setPreviewedSectionId(nextDest.id);
        return;
      }

      // Arrow Up / Arrow Left: preview previous destination (does NOT navigate yet)
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsScrubbing(true);
        isScrubbingRef.current = true;
        if (settleTimeoutRef.current) {
          clearTimeout(settleTimeoutRef.current);
          settleTimeoutRef.current = null;
        }
        const currentIdx = DIAL_DESTINATIONS.findIndex(
          (d) => d.id === previewedSectionIdRef.current
        );
        const safeIdx = currentIdx >= 0 ? currentIdx : 0;
        const prevIdx = Math.max(0, safeIdx - 1);
        const prevDest = DIAL_DESTINATIONS[prevIdx];
        previewedSectionIdRef.current = prevDest.id;
        setPreviewedSectionId(prevDest.id);
        return;
      }

      // Enter: commit currently previewed destination immediately
      if (e.key === 'Enter') {
        if (isInteractive) {
          e.preventDefault();
          commitNavigation(previewedSectionIdRef.current, true);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [commitNavigation, isInteractive]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // When pointer moves away: cancel uncommitted preview and restore actual active section
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
    if (previewedSectionIdRef.current !== actualSectionIdRef.current) {
      previewedSectionIdRef.current = actualSectionIdRef.current;
      setPreviewedSectionId(actualSectionIdRef.current);
    }
    setIsScrubbing(false);
    isScrubbingRef.current = false;

    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 250);
  };

  // Find previewed destination config for needle and UI labels
  const displayDest =
    DIAL_DESTINATIONS.find((d) => d.id === previewedSectionId) || DIAL_DESTINATIONS[0];
  const displayAngle = displayDest.angle;

  // Quarter-circle geometry parameters
  // R = 230px when interactive/expanded, R = 140px when idle
  const size = isInteractive ? 230 : 140;
  const radius = size;
  const hubRadius = isInteractive ? 40 : 28;
  const trackRadius = isInteractive ? 180 : 105;
  const outerBorderRadius = radius - 2;

  // Polar to Cartesian coordinate converter for Top-Right origin (Cx = size, Cy = 0)
  const polarToCartesian = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: size - r * Math.cos(rad),
      y: r * Math.sin(rad),
    };
  };

  // Needle pointer coordinates pointing to PREVIEWED destination
  const needleStart = polarToCartesian(displayAngle, hubRadius + 4);
  const needleEnd = polarToCartesian(displayAngle, trackRadius + 6);
  const activeNodePos = polarToCartesian(displayAngle, trackRadius);

  return (
    <>
      {/* FOCUS MODE: Soft Backdrop Blur Overlay (active when dial is interactive or scrubbing) */}
      <div
        data-testid="dial-focus-backdrop"
        onClick={() => {
          if (settleTimeoutRef.current) {
            clearTimeout(settleTimeoutRef.current);
            settleTimeoutRef.current = null;
          }
          if (previewedSectionIdRef.current !== actualSectionIdRef.current) {
            previewedSectionIdRef.current = actualSectionIdRef.current;
            setPreviewedSectionId(actualSectionIdRef.current);
          }
          setIsScrubbing(false);
          isScrubbingRef.current = false;
          setIsOpen(false);
          setIsHovered(false);
        }}
        className={`fixed inset-0 z-30 transition-all duration-400 pointer-events-auto ${
          isInteractive
            ? 'opacity-100 bg-black/20 backdrop-blur-[4px]'
            : 'opacity-0 pointer-events-none bg-transparent backdrop-blur-none'
        }`}
        aria-hidden={!isInteractive}
      />

      {/* QUARTER-CIRCLE NAVIGATION DIAL INSTRUMENT */}
      <nav
        ref={dialRef}
        role="navigation"
        aria-label="Quarter Circle Scrub Navigation Dial"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="corner-navigation-dial"
        data-interactive={isInteractive ? 'true' : 'false'}
        data-active-section={actualSectionId}
        data-preview-section={previewedSectionId}
        data-scrubbing={isScrubbing ? 'true' : 'false'}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`fixed top-0 right-0 z-50 select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isInteractive ? 'scale-[1.02]' : 'scale-100'
        }`}
      >
        {/* Quarter-Circle SVG Geometric Canvas */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          className="absolute top-0 right-0 overflow-visible drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
        >
          <defs>
            {/* Dark technical gradient fill for dial chassis */}
            <linearGradient id="chassisGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0a0b10" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#141620" stopOpacity="0.98" />
            </linearGradient>

            {/* Glowing active pointer filter */}
            <filter id="crimsonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Main Quarter-Circle Chassis Background */}
          <path
            d={`M 0 0 A ${radius} ${radius} 0 0 0 ${size} ${size} L ${size} 0 Z`}
            fill="url(#chassisGrad)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
            className="transition-colors duration-300"
          />

          {/* 2. Concentric Outer Arc Border */}
          <path
            d={`M ${size - outerBorderRadius} 0 A ${outerBorderRadius} ${outerBorderRadius} 0 0 0 ${size} ${outerBorderRadius}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
            strokeDasharray={isInteractive ? 'none' : '3 3'}
          />

          {/* 3. Concentric Radial Track Arc */}
          <path
            d={`M ${size - trackRadius} 0 A ${trackRadius} ${trackRadius} 0 0 0 ${size} ${trackRadius}`}
            fill="none"
            stroke={isInteractive ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.1)'}
            strokeWidth="1.5"
          />

          {/* 4. Fine Technical Indexing Ticks along the arc */}
          {Array.from({ length: 25 }).map((_, i) => {
            const tickAngle = 10 + i * 2.9;
            const p1 = polarToCartesian(tickAngle, trackRadius - (i % 4 === 0 ? 8 : 4));
            const p2 = polarToCartesian(tickAngle, trackRadius + (i % 4 === 0 ? 8 : 4));
            return (
              <line
                key={`tick-${i}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={i % 4 === 0 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={i % 4 === 0 ? '1.2' : '0.8'}
              />
            );
          })}

          {/* 5. Radial Pointer Needle (rotates toward currently previewed destination) */}
          <line
            x1={needleStart.x}
            y1={needleStart.y}
            x2={needleEnd.x}
            y2={needleEnd.y}
            stroke="#ef4444"
            strokeWidth="2"
            filter="url(#crimsonGlow)"
            className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />

          {/* 6. Active Pointer Node on the Track */}
          <circle
            cx={activeNodePos.x}
            cy={activeNodePos.y}
            r={isInteractive ? '5' : '3.5'}
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="1.5"
            className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />

          {/* 7. Destination Nodes & Interactive Target Sectors */}
          {DIAL_DESTINATIONS.map((dest) => {
            const pos = polarToCartesian(dest.angle, trackRadius);
            const isPreviewed = dest.id === previewedSectionId;
            const isActual = dest.id === actualSectionId;

            return (
              <g
                key={dest.id}
                onClick={(e) => {
                  e.stopPropagation();
                  // Direct click selects and commits immediately
                  commitNavigation(dest.id, true);
                }}
                className="cursor-pointer group"
                role="button"
                aria-label={`Navigate to ${dest.label}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    commitNavigation(dest.id, true);
                  }
                }}
              >
                {/* Hit area */}
                <circle cx={pos.x} cy={pos.y} r="14" fill="transparent" />

                {/* Node marker: highlighted if previewed or active */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isPreviewed ? '4' : '2.5'}
                  fill={isPreviewed ? '#ef4444' : isActual ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.45)'}
                  stroke={isPreviewed ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'}
                  strokeWidth="1"
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Expanded Arc Destination Text Labels */}
                {isInteractive && (
                  <text
                    x={polarToCartesian(dest.angle, trackRadius - 24).x}
                    y={polarToCartesian(dest.angle, trackRadius - 24).y + 3.5}
                    textAnchor="middle"
                    fill={isPreviewed ? '#ffffff' : 'rgba(203, 213, 225, 0.85)'}
                    fontSize="9.5"
                    fontFamily="ui-monospace, monospace"
                    fontWeight={isPreviewed ? '700' : '500'}
                    letterSpacing="0.08em"
                    className="select-none transition-colors duration-200 group-hover:fill-red-400"
                  >
                    {dest.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* 8. Center Corner Origin Hub */}
          <circle
            cx={size}
            cy="0"
            r={hubRadius}
            fill="#0f1118"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.5"
            onClick={() => setIsOpen((prev) => !prev)}
            className="cursor-pointer"
          />

          {/* Hub Icon / Indicator */}
          <g transform={`translate(${size - (hubRadius * 0.65)}, 5)`} className="pointer-events-none">
            <Compass className="w-4 h-4 text-slate-300 opacity-80" />
          </g>
        </svg>

        {/* COMPACT IDLE STATUS BADGE */}
        {!isInteractive && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={`Navigation dial: currently at ${displayDest.label}. Click to expand navigation menu.`}
            className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 border border-white/10 text-white font-mono text-[9.5px] font-bold tracking-wider hover:border-red-500/80 transition-all cursor-pointer shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-slate-200">{displayDest.index}</span>
            <span className="text-slate-400">·</span>
            <span className="text-white">{displayDest.label}</span>
          </button>
        )}

        {/* INTERACTIVE EXPANDED CONTROLS & STATUS BADGE */}
        {isInteractive && (
          <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1 z-10 animate-fadeIn pointer-events-none">
            {!isHomePage ? (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/90 text-white font-mono text-[9px] font-bold tracking-wider hover:bg-red-500 transition-colors shadow-md pointer-events-auto"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>RETURN TO HOME</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 font-mono text-[9px] text-slate-400 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded border border-white/10">
                <span className="text-red-400 font-bold">
                  {isScrubbing ? 'SCRUB' : 'NAV DIAL'}
                </span>
                <span>/</span>
                <span className="text-white font-bold">{displayDest.label}</span>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};
