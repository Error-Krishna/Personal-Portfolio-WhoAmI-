import React from 'react';
import {
  Code,
  Layout,
  Cpu,
  Layers,
  Boxes,
  Network,
  TerminalSquare,
  Film,
  Video,
  Sparkles,
} from 'lucide-react';

interface TechLogoProps {
  name: string;
  size?: number;
  className?: string;
}

export const TechLogo: React.FC<TechLogoProps> = ({ name, size = 20, className = '' }) => {
  const norm = name.toLowerCase();

  // Vector SVG brand logos for high visual fidelity
  if (norm.includes('react')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="-11.5 -10.23174 23 20.46348"
        fill="currentColor"
        className={`text-[#087ea4] ${className}`}
      >
        <circle cx="0" cy="0" r="2.05" fill="#087ea4" />
        <g stroke="#087ea4" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  if (norm.includes('typescript')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#3178c6] ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#3178c6" />
        <path
          d="M11.5 8H5.5V10H7.5V17H9.5V10H11.5V8ZM18 10.5C18 9.1 16.9 8 15.5 8H12.5V17H14.5V14H15.5C16.9 14 18 12.9 18 11.5V10.5ZM14.5 12V10H15.5C16.1 10 16.5 10.4 16.5 11C16.5 11.6 16.1 12 15.5 12H14.5Z"
          fill="white"
        />
      </svg>
    );
  }

  if (norm.includes('javascript')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#f7df1e] ${className}`}
      >
        <rect width="24" height="24" rx="4" fill="#f7df1e" />
        <path
          d="M7 17.5C7.8 18 8.6 18.2 9.5 18.2C11.5 18.2 12.6 17.2 12.6 15.3V9.5H10.6V15.2C10.6 16.1 10.1 16.5 9.3 16.5C8.6 16.5 8.1 16.3 7.6 16L7 17.5ZM13.8 17.3C14.8 17.9 16 18.2 17.1 18.2C19.5 18.2 21 16.9 21 14.8C21 13 20 12.1 18.4 11.4L17.7 11.1C16.6 10.6 16.1 10.1 16.1 9.4C16.1 8.6 16.8 8 17.9 8C18.8 8 19.6 8.3 20.3 8.7L20.9 7.1C20.1 6.7 19 6.4 17.9 6.4C15.6 6.4 14.2 7.7 14.2 9.6C14.2 11.2 15.1 12.2 16.7 12.9L17.4 13.2C18.7 13.8 19.1 14.4 19.1 15.1C19.1 16 18.3 16.6 17.1 16.6C16 16.6 15 16.1 14.3 15.7L13.8 17.3Z"
          fill="#111"
        />
      </svg>
    );
  }

  if (norm.includes('tailwind')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#06b6d4] ${className}`}
      >
        <path
          d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
          fill="#06b6d4"
        />
      </svg>
    );
  }

  if (norm.includes('node')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#339933] ${className}`}
      >
        <path
          d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2Z"
          stroke="#339933"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M12 7V17M7 10L12 13L17 10" stroke="#339933" strokeWidth="2" />
      </svg>
    );
  }

  if (norm.includes('python')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#3776ab] ${className}`}
      >
        <path
          d="M11.9 2C8.5 2 8.7 3.5 8.7 3.5V5.5H12.3V6.2H5.3C5.3 6.2 2 6 2 9.5C2 13 4.9 12.8 4.9 12.8H6.5V11.2C6.5 9.4 8 9.4 8 9.4H11.6C13.2 9.4 13.2 8 13.2 8V3.5C13.2 3.5 13.4 2 11.9 2ZM10.4 3.6C10.9 3.6 11.3 4 11.3 4.5C11.3 5 10.9 5.4 10.4 5.4C9.9 5.4 9.5 5 9.5 4.5C9.5 4 9.9 3.6 10.4 3.6Z"
          fill="#3776ab"
        />
        <path
          d="M12.1 22C15.5 22 15.3 20.5 15.3 20.5V18.5H11.7V17.8H18.7C18.7 17.8 22 18 22 14.5C22 11 19.1 11.2 19.1 11.2H17.5V12.8C17.5 14.6 16 14.6 16 14.6H12.4C10.8 14.6 10.8 16 10.8 16V20.5C10.8 20.5 10.6 22 12.1 22ZM13.6 20.4C13.1 20.4 12.7 20 12.7 19.5C12.7 19 13.1 18.6 13.6 18.6C14.1 18.6 14.5 19 14.5 19.5C14.5 20 14.1 20.4 13.6 20.4Z"
          fill="#ffd43b"
        />
      </svg>
    );
  }

  if (norm.includes('mongo')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#47a248] ${className}`}
      >
        <path
          d="M12 2C11.6 3 6 8.5 6 13.5C6 17 8.5 20 11.5 21.8L12 22L12.5 21.8C15.5 20 18 17 18 13.5C18 8.5 12.4 3 12 2Z"
          fill="#47a248"
        />
        <path d="M12 2V22" stroke="#3fa037" strokeWidth="1" />
      </svg>
    );
  }

  if (norm.includes('postgres') || norm.includes('sql')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#336791] ${className}`}
      >
        <path
          d="M12 3C7 3 4 5 4 7.5V16.5C4 19 7 21 12 21C17 21 20 19 20 16.5V7.5C20 5 17 3 12 3Z"
          stroke="#336791"
          strokeWidth="2"
        />
        <path d="M4 12C4 14.5 7 16.5 12 16.5C17 16.5 20 14.5 20 12" stroke="#336791" strokeWidth="2" />
        <path d="M4 7.5C4 10 7 12 12 12C17 12 20 10 20 7.5" stroke="#336791" strokeWidth="2" />
      </svg>
    );
  }

  if (norm.includes('docker')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#2496ed] ${className}`}
      >
        <path
          d="M3 13.5C3 13.5 4.5 12 8 12C11 12 12 14 15 14C18 14 19.5 12.5 21 12.5C21.5 14.5 20 18 17 19.5C13.5 21 7.5 21 4.5 18C3.5 17 3 15.5 3 13.5Z"
          fill="#2496ed"
        />
        <rect x="5" y="9" width="2" height="2" fill="#2496ed" />
        <rect x="8" y="9" width="2" height="2" fill="#2496ed" />
        <rect x="11" y="9" width="2" height="2" fill="#2496ed" />
        <rect x="8" y="6" width="2" height="2" fill="#2496ed" />
        <rect x="11" y="6" width="2" height="2" fill="#2496ed" />
      </svg>
    );
  }

  if (norm.includes('git')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#f05032] ${className}`}
      >
        <path
          d="M21.5 10.7L13.3 2.5C12.6 1.8 11.4 1.8 10.7 2.5L8.5 4.7L11.2 7.4C11.8 7.2 12.6 7.4 13.1 7.9C13.6 8.4 13.8 9.2 13.6 9.8L16.2 12.4C16.8 12.2 17.6 12.4 18.1 12.9C18.8 13.6 18.8 14.8 18.1 15.5C17.4 16.2 16.2 16.2 15.5 15.5C15 15 14.8 14.2 15 13.6L12.5 11.1V16.8C12.7 17.1 12.8 17.5 12.8 17.9C12.8 18.9 12 19.7 11 19.7C10 19.7 9.2 18.9 9.2 17.9C9.2 17.1 9.7 16.4 10.5 16.2V10.4C9.7 10.2 9.2 9.5 9.2 8.7C9.2 8.1 9.5 7.6 9.9 7.2L7.3 4.6L2.5 9.4C1.8 10.1 1.8 11.3 2.5 12L10.7 20.2C11.4 20.9 12.6 20.9 13.3 20.2L21.5 12C22.2 11.3 22.2 10.1 21.5 10.7Z"
          fill="#f05032"
        />
      </svg>
    );
  }

  if (norm.includes('redis')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#dc382d] ${className}`}
      >
        <path
          d="M12 2L3 6.5V11L12 15.5L21 11V6.5L12 2Z"
          fill="#dc382d"
        />
        <path
          d="M3 13.5L12 18L21 13.5M3 17.5L12 22L21 17.5"
          stroke="#dc382d"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (norm.includes('go')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#00add8] ${className}`}
      >
        <path
          d="M12 3C7 3 3 7 3 12C3 17 7 21 12 21C16.5 21 20.2 17.7 20.9 13.5H12V10.5H21C21 7 17 3 12 3Z"
          fill="#00add8"
        />
      </svg>
    );
  }

  // Fallbacks to Lucide icons
  if (norm.includes('express')) return <Cpu className={`text-slate-800 ${className}`} size={size} />;
  if (norm.includes('django')) return <Layers className={`text-[#092e20] ${className}`} size={size} />;
  if (norm.includes('flask')) return <Boxes className={`text-slate-800 ${className}`} size={size} />;
  if (norm.includes('api')) return <Network className={`text-red-600 ${className}`} size={size} />;
  if (norm.includes('linux')) return <TerminalSquare className={`text-amber-600 ${className}`} size={size} />;
  if (norm.includes('html') || norm.includes('css')) return <Layout className={`text-orange-600 ${className}`} size={size} />;
  if (norm.includes('video')) return <Film className={`text-red-500 ${className}`} size={size} />;
  if (norm.includes('story')) return <Video className={`text-purple-600 ${className}`} size={size} />;
  if (norm.includes('design') || norm.includes('ux')) return <Sparkles className={`text-pink-600 ${className}`} size={size} />;

  return <Code className={`text-slate-700 ${className}`} size={size} />;
};
