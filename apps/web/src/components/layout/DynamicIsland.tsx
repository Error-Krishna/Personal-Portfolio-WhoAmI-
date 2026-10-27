import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Phone, Twitter, Instagram, ExternalLink, X } from 'lucide-react';
import { siteConfig } from '../../lib/config/site-config.js';

export interface SocialProfile {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: React.ElementType;
  accent: string;
}

export const getConfiguredSocials = (): SocialProfile[] => {
  const links = siteConfig.links || {};
  const socials: SocialProfile[] = [];

  if (links.github) {
    const handle = links.github.replace(/^https?:\/\/(www\.)?github\.com\//i, '@');
    socials.push({
      id: 'github',
      name: 'GitHub',
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      url: links.github,
      icon: Github,
      accent: 'text-purple-400',
    });
  }

  if (links.linkedin) {
    const handle = links.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//i, '');
    socials.push({
      id: 'linkedin',
      name: 'LinkedIn',
      handle: handle.startsWith('in/') ? handle : `in/${handle}`,
      url: links.linkedin,
      icon: Linkedin,
      accent: 'text-blue-400',
    });
  }

  if (links.email) {
    const email = links.email.replace(/^mailto:/i, '');
    socials.push({
      id: 'email',
      name: 'Email',
      handle: email,
      url: links.email.startsWith('mailto:') ? links.email : `mailto:${links.email}`,
      icon: Mail,
      accent: 'text-amber-400',
    });
  }

  if (links.phone) {
    const phone = links.phone.replace(/^tel:/i, '');
    socials.push({
      id: 'phone',
      name: 'Connect',
      handle: phone,
      url: links.phone.startsWith('tel:') ? links.phone : `tel:${links.phone}`,
      icon: Phone,
      accent: 'text-emerald-400',
    });
  }

  if (links.twitter) {
    const handle = links.twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//i, '@');
    socials.push({
      id: 'twitter',
      name: 'X',
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      url: links.twitter,
      icon: Twitter,
      accent: 'text-sky-400',
    });
  }

  if (links.instagram) {
    const handle = links.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '@');
    socials.push({
      id: 'instagram',
      name: 'Instagram',
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      url: links.instagram,
      icon: Instagram,
      accent: 'text-pink-400',
    });
  }

  return socials;
};

export const DynamicIsland: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);
  const [socialIndex, setSocialIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Intent detection and hysteresis timers
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const islandRef = useRef<HTMLDivElement | null>(null);

  const socials = getConfiguredSocials();
  const isExpanded = isHovered || isMobileExpanded;

  // Handle outside clicks/taps to close expanded capsule
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsMobileExpanded(false);
        setIsHovered(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        setIsHovered(false);
        setIsMobileExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Automatically cycle through social handles one by one when collapsed
  useEffect(() => {
    if (isExpanded || socials.length <= 1) return;

    let transitionTimer: NodeJS.Timeout | null = null;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      transitionTimer = setTimeout(() => {
        setSocialIndex((prev) => (prev + 1) % socials.length);
        setIsTransitioning(false);
      }, 300);
    }, 2800);

    return () => {
      clearInterval(interval);
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
    };
  }, [isExpanded, socials.length]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Hover intent detection: Require intentional dwell (120ms) before opening
  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
    }
    enterTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 120);
  };

  // Leave hysteresis: Give 260ms grace period so moving to links doesn't trigger jittery collapse
  const handleMouseLeave = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 260);
  };

  const toggleMobileExpanded = () => {
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setIsMobileExpanded((prev) => !prev);
  };

  const activeSocial = socials[socialIndex] || socials[0];
  const ActiveSocialIcon = activeSocial?.icon;

  if (socials.length === 0) {
    return null;
  }

  const displayName = siteConfig.personal.displayName || 'KRISHNA GOYAL';
  const roleTitle = siteConfig.personal.title || 'Full-Stack Developer';

  return (
    <header
      role="banner"
      className="fixed top-[max(12px,env(safe-area-inset-top))] sm:top-[16px] left-1/2 -translate-x-1/2 z-50 select-none max-w-[100vw]"
    >
      <div
        ref={islandRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => {
          if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
          setIsHovered(true);
        }}
        onBlur={(e) => {
          if (!islandRef.current?.contains(e.relatedTarget as Node)) {
            if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
            setIsHovered(false);
            setIsMobileExpanded(false);
          }
        }}
        onClick={() => {
          if (!isExpanded) toggleMobileExpanded();
        }}
        data-testid="dynamic-island"
        data-expanded={isExpanded ? 'true' : 'false'}
        className={`relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/15 text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)] cursor-pointer ${
          isExpanded
            ? 'w-[calc(100vw-24px)] max-w-[430px] rounded-[22px] sm:rounded-[24px] px-3.5 sm:px-4.5 py-2.5 sm:py-3'
            : 'w-auto min-w-[210px] xs:min-w-[240px] sm:min-w-[280px] max-w-[calc(100vw-88px)] sm:max-w-[calc(100vw-32px)] h-[40px] sm:h-[44px] rounded-full px-2.5 sm:px-3.5 py-1'
        }`}
      >
        {/* COLLAPSED STATE: Identity + Calm Rotating Social Handle Ticker */}
        {!isExpanded ? (
          <div className="w-full h-full flex items-center justify-between gap-2 sm:gap-3 whitespace-nowrap">
            {/* Left: Avatar + Name */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="relative w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
                <img
                  src={siteConfig.assets?.heroPortrait || '/images/image-removebg-preview.png'}
                  alt="Krishna"
                  className="w-full h-full object-cover object-top grayscale"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-wider uppercase text-slate-100 max-w-[80px] xs:max-w-none truncate">
                {displayName}
              </span>
            </div>

            <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />

            {/* Right: Rotating Social Profile Ticker (stable dimensions to prevent layout shifts) */}
            <div className="w-[95px] xs:w-[110px] sm:w-[135px] shrink-0 flex items-center justify-end overflow-hidden">
              {activeSocial && (
                <a
                  href={activeSocial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-testid="collapsed-social-ticker"
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-all duration-300 text-[9px] sm:text-[10px] font-sans font-medium group shrink-0 ${
                    isTransitioning ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
                  }`}
                  title={`Open ${activeSocial.name} profile`}
                  aria-label={`${activeSocial.name}: ${activeSocial.handle}`}
                >
                  {ActiveSocialIcon && (
                    <ActiveSocialIcon
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${activeSocial.accent} shrink-0`}
                    />
                  )}
                  <span className="text-slate-300 group-hover:text-white max-w-[65px] xs:max-w-[78px] sm:max-w-[90px] truncate">
                    {activeSocial.handle}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300 opacity-60 shrink-0" />
                </a>
              )}
            </div>
          </div>
        ) : (
          /* EXPANDED STATE: Compact, Refined Navigation & Social Capsule */
          <div
            data-testid="expanded-social-panel"
            className="w-full flex flex-col gap-2.5 animate-fadeIn"
          >
            {/* Top Row: Identity Header + Status Pill + Dismiss Action */}
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
                  <img
                    src={siteConfig.assets?.heroPortrait || '/images/image-removebg-preview.png'}
                    alt="Krishna Goyal"
                    className="w-full h-full object-cover object-top grayscale"
                  />
                  <span
                    title="Available for freelance & product engineering"
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#0c0d12] animate-pulse"
                  />
                </div>

                <div className="flex flex-col text-left justify-center min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] sm:text-[12px] font-bold font-sans tracking-wider uppercase text-white leading-tight truncate">
                      {displayName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[8.5px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      AVAILABLE FOR PROJECTS
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans leading-tight mt-0.5 truncate">
                    {roleTitle}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
                  if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
                  setIsMobileExpanded(false);
                  setIsHovered(false);
                }}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors shrink-0"
                aria-label="Close social panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Row: Compact Arranged Profile Links */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 flex-wrap">
              {socials.map((profile) => {
                const ProfileIcon = profile.icon;
                return (
                  <a
                    key={profile.id}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title={`Visit ${profile.name} (${profile.handle})`}
                    aria-label={`${profile.name}: ${profile.handle}`}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-[10.5px] text-slate-200 hover:text-white transition-all group shrink-0"
                  >
                    <ProfileIcon className={`w-3 h-3 ${profile.accent} shrink-0`} />
                    <span className="font-medium font-sans max-w-[80px] sm:max-w-[95px] truncate">
                      {profile.handle}
                    </span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0" />
                  </a>
                );
              })}
            </div>

            {/* Subtle bottom indicator with tap-to-close */}
            <div
              onClick={() => {
                if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
                if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
                setIsMobileExpanded(false);
                setIsHovered(false);
              }}
              title="Tap to close"
              className="w-10 h-1 bg-white/20 hover:bg-white/40 rounded-full mx-auto cursor-pointer transition-colors"
            />
          </div>
        )}
      </div>
    </header>
  );
};
