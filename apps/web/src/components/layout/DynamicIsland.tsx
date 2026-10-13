import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Twitter,
  Instagram,
  ExternalLink,
  X,
} from 'lucide-react';
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
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const islandRef = useRef<HTMLDivElement | null>(null);

  const socials = getConfiguredSocials();
  const isExpanded = isHovered || isMobileExpanded;

  // Handle outside clicks/taps to close expanded capsule
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsMobileExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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

  // Clean up hover debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  const toggleMobileExpanded = () => {
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
      className="fixed top-[max(12px,env(safe-area-inset-top))] sm:top-[17px] left-1/2 -translate-x-1/2 z-50 select-none max-w-[100vw]"
    >
      <div
        ref={islandRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsHovered(true)}
        onBlur={(e) => {
          if (!islandRef.current?.contains(e.relatedTarget as Node)) {
            setIsHovered(false);
            setIsMobileExpanded(false);
          }
        }}
        onClick={() => {
          if (!isExpanded) toggleMobileExpanded();
        }}
        data-testid="dynamic-island"
        data-expanded={isExpanded ? 'true' : 'false'}
        className={`relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] cursor-pointer ${
          isExpanded
            ? 'w-[calc(100vw-24px)] sm:w-[calc(100vw-32px)] max-w-[580px] min-h-[86px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-[28px] sm:rounded-[43px] px-3.5 sm:px-6 py-3 sm:py-3.5'
            : 'w-auto min-w-[210px] xs:min-w-[240px] sm:min-w-[290px] max-w-[calc(100vw-88px)] sm:max-w-[calc(100vw-32px)] h-[42px] sm:h-[46px] rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5'
        }`}
      >
        {/* COLLAPSED STATE: Identity + Calm Rotating Social Handle Ticker */}
        {!isExpanded ? (
          <div className="w-full h-full flex items-center justify-between gap-2 sm:gap-3 whitespace-nowrap">
            {/* Left: Avatar + Name */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
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
            <div className="w-[95px] xs:w-[110px] sm:w-[140px] shrink-0 flex items-center justify-end overflow-hidden">
              {activeSocial && (
                <a
                  href={activeSocial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-testid="collapsed-social-ticker"
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-all duration-300 text-[9px] sm:text-[10px] font-sans font-medium group shrink-0 ${
                    isTransitioning
                      ? 'opacity-0 translate-x-2'
                      : 'opacity-100 translate-x-0'
                  }`}
                  title={`Open ${activeSocial.name} profile`}
                  aria-label={`${activeSocial.name}: ${activeSocial.handle}`}
                >
                  {ActiveSocialIcon && (
                    <ActiveSocialIcon
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${activeSocial.accent} shrink-0`}
                    />
                  )}
                  <span className="text-slate-300 group-hover:text-white max-w-[65px] xs:max-w-[78px] sm:max-w-[95px] truncate">
                    {activeSocial.handle}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300 opacity-60 shrink-0" />
                </a>
              )}
            </div>
          </div>
        ) : (
          /* EXPANDED STATE: Full Social Identity Panel */
          <div
            data-testid="expanded-social-panel"
            className="w-full h-full flex flex-col justify-between animate-fadeIn"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              {/* Left: Portrait + Name + Role + Availability */}
              <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="relative w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full overflow-hidden bg-white/10 border border-white/20 shadow-inner shrink-0">
                    <img
                      src={siteConfig.assets?.heroPortrait || '/images/image-removebg-preview.png'}
                      alt="Krishna Goyal"
                      className="w-full h-full object-cover object-top grayscale"
                    />
                    <span
                      title="Available for freelance & product engineering"
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c0d12] animate-pulse"
                    />
                  </div>

                  <div className="flex flex-col text-left justify-center min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] sm:text-[13px] font-bold font-sans tracking-wider uppercase text-white leading-tight truncate">
                        {displayName}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans leading-tight mt-0.5 truncate">
                      {roleTitle}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400/90 tracking-wider uppercase mt-0.5 truncate">
                      AVAILABLE FOR PROJECTS
                    </span>
                  </div>
                </div>

                {/* Mobile-only close button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileExpanded(false);
                    setIsHovered(false);
                  }}
                  className="sm:hidden p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                  aria-label="Close social panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right: All Configured Social Profiles */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-start sm:justify-end">
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
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-xs text-slate-200 hover:text-white transition-all group shrink-0"
                    >
                      <ProfileIcon className={`w-3.5 h-3.5 ${profile.accent} shrink-0`} />
                      <span className="text-[10.5px] font-medium font-sans max-w-[85px] sm:max-w-[100px] truncate">
                        {profile.handle}
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Subtle bottom indicator with tap-to-close */}
            <div
              onClick={() => {
                setIsMobileExpanded(false);
                setIsHovered(false);
              }}
              title="Tap to close"
              className="w-12 h-1 bg-white/20 hover:bg-white/40 rounded-full mx-auto mt-2 cursor-pointer transition-colors"
            />
          </div>
        )}
      </div>
    </header>
  );
};
