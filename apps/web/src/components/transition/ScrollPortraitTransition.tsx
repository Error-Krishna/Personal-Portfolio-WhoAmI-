import React, { useState, useEffect, useRef, useCallback } from 'react';
import { siteConfig } from '../../lib/config/site-config.js';

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ScrollPortraitTransitionProps {
  onReadyChange?: (isReady: boolean) => void;
}

export const ScrollPortraitTransition: React.FC<ScrollPortraitTransitionProps> = ({
  onReadyChange,
}) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const [heroRect, setHeroRect] = useState<Rect | null>(null);
  const [aboutRect, setAboutRect] = useState<Rect | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Measure slot positions relative to the main page container
  const measure = useCallback(() => {
    if (typeof window === 'undefined') return;

    const heroSlot = document.getElementById('hero-portrait-slot');
    const aboutSlot = document.getElementById('about-portrait-slot');
    const mainEl = document.querySelector('main');

    if (!heroSlot || !aboutSlot || !mainEl) return;

    const mainRect = mainEl.getBoundingClientRect();
    const hRect = heroSlot.getBoundingClientRect();
    const aRect = aboutSlot.getBoundingClientRect();

    if (hRect.width > 50 && aRect.width > 50) {
      setHeroRect({
        left: hRect.left - mainRect.left,
        top: hRect.top - mainRect.top,
        width: hRect.width,
        height: hRect.height,
      });

      setAboutRect({
        left: aRect.left - mainRect.left,
        top: aRect.top - mainRect.top,
        width: aRect.width,
        height: aRect.height,
      });

      setIsReady(true);
      onReadyChange?.(true);
    }
  }, [onReadyChange]);

  // Check desktop viewport and motion preferences
  useEffect(() => {
    const checkViewport = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (!desktop) {
        setIsReady(false);
        onReadyChange?.(false);
      }
    };

    checkViewport();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', onMotionChange);

    // Initial measurement after DOM render
    const timer = setTimeout(measure, 100);

    const handleResize = () => {
      checkViewport();
      measure();
    };

    window.addEventListener('resize', handleResize);

    // ResizeObserver on slots for dynamic layout adjustments
    let observer: ResizeObserver | null = null;
    const heroSlot = document.getElementById('hero-portrait-slot');
    const aboutSlot = document.getElementById('about-portrait-slot');
    if (typeof ResizeObserver !== 'undefined' && heroSlot && aboutSlot) {
      observer = new ResizeObserver(() => {
        measure();
      });
      observer.observe(heroSlot);
      observer.observe(aboutSlot);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', onMotionChange);
      if (observer) observer.disconnect();
    };
  }, [measure, onReadyChange]);

  // Continuous animation loop linked to scroll position
  useEffect(() => {
    if (!isDesktop || isReducedMotion) return;

    const onScroll = () => {
      const heroEl = document.getElementById('hero');
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;

      if (heroHeight <= 0) return;

      // Scroll progress across the boundary from Hero (0) to About (heroHeight)
      const rawP = Math.max(0, Math.min(1, window.scrollY / heroHeight));
      targetProgressRef.current = rawP;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Initialize progress to current scroll position immediately
    currentProgressRef.current = targetProgressRef.current;
    setProgress(targetProgressRef.current);

    let isRunning = true;
    const animate = () => {
      if (!isRunning) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        // Smooth lerp: creates physical inertia, dampening sudden scroll jumps
        currentProgressRef.current += diff * 0.12;
        setProgress(currentProgressRef.current);
      } else if (currentProgressRef.current !== targetProgressRef.current) {
        currentProgressRef.current = targetProgressRef.current;
        setProgress(currentProgressRef.current);
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isDesktop, isReducedMotion]);

  // If not desktop, reduced motion, or not measured yet, do not render transition card
  if (!isDesktop || isReducedMotion || !isReady || !heroRect || !aboutRect) {
    return null;
  }

  // Smooth cubic easing
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const eased = easeInOutCubic(progress);

  // Interpolated physical card geometry
  const cardX = heroRect.left + (aboutRect.left - heroRect.left) * eased;
  const cardY = heroRect.top + (aboutRect.top - heroRect.top) * eased;
  const cardW = heroRect.width + (aboutRect.width - heroRect.width) * eased;
  const cardH = heroRect.height + (aboutRect.height - heroRect.height) * eased;
  const cardRadius = 16 + (22 - 16) * eased;
  const rotateY = 180 * eased;

  // Physical lift scale & dynamic drop shadow
  const liftScale = 1 + 0.035 * Math.sin(Math.PI * eased);
  const shadowSpread = 20 + 35 * Math.sin(Math.PI * eased);
  const shadowOpacity = 0.35 + 0.25 * Math.sin(Math.PI * eased);

  // Dynamic light occlusion (simulates shading as the card rotates away from view)
  const frontShadowOpacity = Math.max(0, Math.sin((rotateY * Math.PI) / 180) * 0.7);
  const backShadowOpacity = Math.max(0, Math.sin(((180 - rotateY) * Math.PI) / 180) * 0.7);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${cardX}px`,
        top: `${cardY}px`,
        width: `${cardW}px`,
        height: `${cardH}px`,
        perspective: '1400px',
        zIndex: 25,
        pointerEvents: 'none',
        transform: `scale(${liftScale})`,
        transformOrigin: 'center center',
      }}
      className="select-none will-change-transform"
      aria-hidden="true"
    >
      {/* 3D Rotating Flipper */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotateY}deg)`,
          borderRadius: `${cardRadius}px`,
          boxShadow: `0 20px ${shadowSpread}px rgba(0, 0, 0, ${shadowOpacity})`,
        }}
        className="relative w-full h-full"
      >
        {/* =====================================================================
            FRONT FACE (0°): Grayscale Hero Headshot Portrait
           ===================================================================== */}
        <div
          style={{
            transform: 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: `${cardRadius}px`,
          }}
          className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800/90"
        >
          {/* Vignette lighting */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black/85 z-10 pointer-events-none" />

          {/* Hero headshot */}
          <img
            src={siteConfig.assets?.heroPortrait || '/images/image-removebg-preview.png'}
            alt="Krishna Goyal"
            className="w-full h-full object-cover object-top filter grayscale contrast-125"
          />

          {/* Bottom vignette gradient */}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-10" />

          {/* Light occlusion overlay */}
          <div
            style={{ opacity: frontShadowOpacity }}
            className="absolute inset-0 bg-black/75 pointer-events-none transition-opacity"
          />
        </div>

        {/* =====================================================================
            BACK FACE (180°): Red-Lit About Me Portrait
           ===================================================================== */}
        <div
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: `${cardRadius}px`,
          }}
          className="absolute inset-0 overflow-hidden bg-black border border-slate-900"
        >
          {/* Red-Lit Portrait Photo */}
          <img
            src={siteConfig.assets?.aboutPortrait || '/images/about-portrait-red.png'}
            alt="Krishna Goyal - About Me"
            className="w-full h-full object-cover object-center filter contrast-110"
          />

          {/* Light occlusion overlay */}
          <div
            style={{ opacity: backShadowOpacity }}
            className="absolute inset-0 bg-black/75 pointer-events-none transition-opacity"
          />
        </div>
      </div>
    </div>
  );
};
