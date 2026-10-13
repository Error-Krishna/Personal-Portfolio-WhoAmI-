import React, { useEffect, useRef, useState } from 'react';
import {
  getPublishedTestimonials,
  type TestimonialItem,
} from '../../lib/config/site-config.js';

const getInitials = (name: string): string => {
  if (!name) return 'CL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getCompanyInitials = (name: string): string => {
  if (!name) return 'CO';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
};

export const TestimonialsSection: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const testimonials: TestimonialItem[] = getPublishedTestimonials().slice(0, 4);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let flipTimer: ReturnType<typeof setTimeout> | null = null;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      setIsFlipped(true);
      return;
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches) {
        setIsFlipped(true);
      }
    };

    if (typeof IntersectionObserver === 'undefined') {
      setIsFlipped(true);
      return;
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMotionChange);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          observer.disconnect(); // Trigger only once per page session
          // Let the back of the cards show for ~1 second, then smoothly flip together
          flipTimer = setTimeout(() => {
            setIsFlipped(true);
          }, 1000);
        }
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (flipTimer) {
        clearTimeout(flipTimer);
      }
      observer.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      aria-label="Client Testimonials"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-10 lg:px-12 py-20 lg:py-28 border-t border-slate-300/80"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* Editorial Label */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            CLIENT FEEDBACK / 01—04
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        {/* Headline & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-14 lg:mb-20 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92]">
              WHAT PEOPLE SAY<span className="text-red-600">.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 pb-1">
            <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
              Good work is built on good collaboration.
            </p>
          </div>
        </div>

        {/* Coordinated 4-Card Grid with Synchronized Slow 3D Flip (Dark Theme) */}
        <div
          data-testid="testimonial-cards-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.map((item, index) => {
            const cardNumber = `0${index + 1}`;
            const initials = getInitials(item.clientName);
            const companyInitials = getCompanyInitials(item.companyName);

            return (
              <div
                key={item.id || cardNumber}
                className="w-full [perspective:1200px]"
                data-testid={`testimonial-card-${index}`}
              >
                <div
                  className={`relative w-full h-[380px] sm:h-[400px] lg:h-[420px] rounded-2xl [transform-style:preserve-3d] ${
                    isReducedMotion
                      ? 'transition-none'
                      : 'transition-transform duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)]'
                  } ${
                    isFlipped
                      ? '[transform:rotateY(180deg)]'
                      : '[transform:rotateY(0deg)]'
                  }`}
                  data-flipped={isFlipped ? 'true' : 'false'}
                >
                  {/* BACK FACE (Dark Theme) — Initial state showing company / product logo */}
                  <div
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(0deg)] z-10 bg-[#0f1117] text-white rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
                    aria-hidden={isFlipped ? true : undefined}
                    data-testid={`card-back-${index}`}
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-mono font-bold text-sm text-red-500 tracking-wider">
                        {cardNumber}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">
                        CLIENT FEEDBACK
                      </span>
                    </div>

                    {/* Center: Client Logo Focus */}
                    <div className="my-auto flex flex-col items-center justify-center text-center px-2 py-4">
                      {item.companyLogo ? (
                        <img
                          src={item.companyLogo}
                          alt={item.companyName}
                          className="max-h-12 max-w-[160px] object-contain mb-3"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center font-hero font-black text-2xl text-white mb-3 tracking-tighter shadow-inner select-none">
                          {companyInitials}
                        </div>
                      )}

                      <h3 className="font-sans font-black text-xl sm:text-2xl text-white tracking-tight leading-snug">
                        {item.companyName}
                      </h3>

                      {item.productName && (
                        <p className="font-mono text-xs text-slate-400 uppercase tracking-wider mt-1.5">
                          {item.productName}
                        </p>
                      )}
                    </div>

                    {/* Bottom Status */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="text-[10px] uppercase tracking-wider">
                        A NOTE FROM CLIENT
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>
                  </div>

                  {/* FRONT FACE (Dark Theme) — Revealed testimonial content with light text */}
                  <div
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] z-20 bg-[#0f1117] text-white rounded-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.18)] p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
                    aria-hidden={!isFlipped ? true : undefined}
                    data-testid={`card-front-${index}`}
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-mono font-bold text-sm text-red-500 tracking-wider">
                        {cardNumber}
                      </span>
                      <span
                        className="font-hero font-black text-2xl text-white/25 leading-none select-none"
                        aria-hidden="true"
                      >
                        “
                      </span>
                    </div>

                    {/* Middle: Testimonial Quote */}
                    <div className="my-auto py-2">
                      <blockquote className="font-sans text-xs sm:text-[13px] lg:text-[13.5px] text-slate-200 leading-relaxed italic">
                        &ldquo;{item.testimonial}&rdquo;
                      </blockquote>
                    </div>

                    {/* Bottom: Client Profile */}
                    <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                      {item.profileImage ? (
                        <img
                          src={item.profileImage}
                          alt={item.clientName}
                          className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0 select-none">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="font-sans font-bold text-sm text-white truncate">
                          {item.clientName}
                        </h4>
                        <p className="font-sans text-xs text-slate-300 truncate">
                          {item.clientRole}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider truncate">
                          {item.companyName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
