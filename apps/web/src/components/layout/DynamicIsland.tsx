import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  FileText,
  Users,
  Mail,
  Github,
  Linkedin,
  Send,
  ExternalLink,
} from 'lucide-react';

interface SocialProfile {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: React.ElementType;
  accent: string;
}

const SOCIAL_PROFILES: SocialProfile[] = [
  {
    id: 'github',
    name: 'GitHub',
    handle: '@Error-Krishna',
    url: 'https://github.com/Error-Krishna',
    icon: Github,
    accent: 'text-purple-400',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: '/in/krishna2611',
    url: 'https://linkedin.com/in/krishna2611',
    icon: Linkedin,
    accent: 'text-blue-400',
  },
  {
    id: 'email',
    name: 'Email',
    handle: 'iamkrishnagoyal@gmail.com',
    url: 'mailto:iamkrishnagoyal@gmail.com',
    icon: Mail,
    accent: 'text-amber-400',
  },
  {
    id: 'connect',
    name: 'Connect',
    handle: '+91 9064700906',
    url: 'tel:+919064700906',
    icon: Send,
    accent: 'text-emerald-400',
  },
];

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'work', label: 'Work', icon: FileText },
  { id: 'about', label: 'About', icon: Users },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export const DynamicIsland: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);
  const [socialIndex, setSocialIndex] = useState<number>(0);
  const [activeNav, setActiveNav] = useState<string>('hero');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const islandRef = useRef<HTMLDivElement | null>(null);

  const isExpanded = isHovered || isMobileExpanded;

  // Handle outside clicks/taps to close mobile expanded capsule
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsMobileExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, []);

  // Automatically cycle through social profiles one by one when shrunk
  useEffect(() => {
    if (isExpanded) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setSocialIndex((prev) => (prev + 1) % SOCIAL_PROFILES.length);
        setIsTransitioning(false);
      }, 250);
    }, 2800);

    return () => clearInterval(interval);
  }, [isExpanded]);

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

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    setIsMobileExpanded(false);
    setIsHovered(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeSocial = SOCIAL_PROFILES[socialIndex];
  const ActiveSocialIcon = activeSocial.icon;

  return (
    <header className="fixed top-[17px] left-1/2 -translate-x-1/2 z-50 select-none max-w-[100vw]">
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
          if (!isExpanded) setIsMobileExpanded(true);
        }}
        className={`relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.45)] cursor-pointer ${
          isExpanded
            ? 'w-[calc(100vw-32px)] max-w-[468px] h-[86px] rounded-[43px] px-3.5 sm:px-6 py-3 sm:py-3.5'
            : 'w-auto min-w-[260px] sm:min-w-[280px] max-w-[calc(100vw-32px)] h-[46px] rounded-full px-3.5 py-1.5'
        }`}
      >
        {/* SHRUNK STATE (Compact capsule: avatar + name + rotating social profile) */}
        {!isExpanded ? (
          <div className="w-full h-full flex items-center justify-between gap-2.5 whitespace-nowrap">
            {/* Left: Avatar + Name */}
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0">
                <img
                  src="/images/image-removebg-preview.png"
                  alt="Krishna"
                  className="w-full h-full object-cover object-top grayscale"
                />
              </div>
              <span className="text-[11px] font-bold font-sans tracking-wider uppercase text-slate-100">
                KRISHNA GOYAL
              </span>
            </div>

            <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />

            {/* Right: Rotating Social Profile Ticker */}
            <a
              href={activeSocial.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/15 transition-all duration-300 text-[10px] font-sans font-medium group shrink-0 ${
                isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
              }`}
              title={`Open ${activeSocial.name}`}
            >
              <ActiveSocialIcon className={`w-3 h-3 ${activeSocial.accent} shrink-0`} />
              <span className="text-slate-300 group-hover:text-white max-w-[110px] truncate">
                {activeSocial.handle}
              </span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300 opacity-60" />
            </a>
          </div>
        ) : (
          /* HOVERED EXPANDED STATE (Exact 468 × 86 px specification) */
          <div className="w-full h-full flex flex-col justify-between animate-fadeIn">
            <div className="flex items-center justify-between h-[56px]">
              {/* Profile image + Name & Role */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="relative w-[38px] h-[38px] sm:w-[48px] sm:h-[48px] rounded-full overflow-hidden bg-white/10 border border-white/20 shadow-inner shrink-0">
                  <img
                    src="/images/image-removebg-preview.png"
                    alt="Krishna Goyal"
                    className="w-full h-full object-cover object-top grayscale"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c0d12] animate-pulse" />
                </div>
                <div className="flex flex-col text-left justify-center min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] sm:text-[13px] font-bold font-sans tracking-wider uppercase text-white leading-tight truncate">
                      KRISHNA GOYAL
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans leading-tight mt-0.5 truncate">
                    Software Engineer
                  </span>
                </div>
              </div>

              {/* Navigation controls with thin vertical separators */}
              <nav
                aria-label="Dynamic Dial Navigation"
                className="flex items-center gap-0.5 shrink-0"
              >
                {NAV_ITEMS.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      {idx > 0 && (
                        <div className="w-[1px] h-3.5 sm:h-4 bg-white/10 mx-0.5" />
                      )}
                      <div className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToSection(item.id);
                          }}
                          title={item.label}
                          aria-label={item.label}
                          className={`w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] rounded-full flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                            isActive
                              ? 'bg-white/20 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        {/* Active indicator dot/pill directly beneath active icon */}
                        <div
                          className={`w-3.5 h-[2px] rounded-full mt-0.5 transition-all ${
                            isActive ? 'bg-white opacity-90' : 'bg-transparent opacity-0'
                          }`}
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
              </nav>
            </div>

            {/* Apple Dynamic Island bottom home indicator bar */}
            <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-0.5" />
          </div>
        )}
      </div>
    </header>
  );
};
