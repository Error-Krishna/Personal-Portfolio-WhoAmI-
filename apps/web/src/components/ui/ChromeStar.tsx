import React from 'react';

interface ChromeStarProps {
  className?: string;
  size?: number;
  rotation?: number;
}

export const ChromeStar: React.FC<ChromeStarProps> = ({
  className = '',
  size = 72,
  rotation = 0,
}) => {
  const starId = React.useId();
  const gradOuter = `star-grad-outer-${starId}`;
  const gradHighlight = `star-grad-hl-${starId}`;
  const gradSheen = `star-grad-sheen-${starId}`;
  const gradShade = `star-grad-shade-${starId}`;

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
      }}
      className={`relative inline-block select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Main Chrome Body Metallic Gradient */}
          <linearGradient id={gradOuter} x1="30" y1="20" x2="170" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="18%" stopColor="#d5d8e2" />
            <stop offset="35%" stopColor="#8c90a3" />
            <stop offset="48%" stopColor="#3d3e4b" />
            <stop offset="55%" stopColor="#20222a" />
            <stop offset="68%" stopColor="#8d92a8" />
            <stop offset="85%" stopColor="#e8ebf3" />
            <stop offset="100%" stopColor="#2c2d38" />
          </linearGradient>

          {/* Diagonal Specular Sheen (Lavender/Chrome Glint) */}
          <linearGradient id={gradSheen} x1="0" y1="100" x2="200" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#b4b9d2" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#9a8ef6" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#60647c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>

          {/* Core Puffy Shadow Highlight */}
          <radialGradient id={gradHighlight} cx="95" cy="90" r="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#cfd4e6" stopOpacity="0.5" />
            <stop offset="75%" stopColor="#242630" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0c0d12" stopOpacity="0.9" />
          </radialGradient>

          {/* Puffy 3D bevel shading */}
          <linearGradient id={gradShade} x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#1e2029" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#07080b" stopOpacity="0.85" />
          </linearGradient>

          <filter id={`blur-${starId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* 3D Puffy 4-Point Star Base Contour */}
        <path
          d="M 100,5 
             C 100,62 138,100 195,100 
             C 138,100 100,138 100,195 
             C 100,138 62,100 5,100 
             C 62,100 100,62 100,5 Z"
          fill={`url(#${gradOuter})`}
          stroke="#eef1f8"
          strokeWidth="1.5"
        />

        {/* Inner Volume Puffed Shading */}
        <path
          d="M 100,9 
             C 100,64 136,100 191,100 
             C 136,100 100,136 100,191 
             C 100,136 64,100 9,100 
             C 64,100 100,64 100,9 Z"
          fill={`url(#${gradHighlight})`}
          style={{ mixBlendMode: 'overlay' }}
        />

        {/* Beveled 4-facet Ridge Curves */}
        {/* Top-Right Facet */}
        <path
          d="M 100,10 C 100,65 135,100 190,100 L 100,100 Z"
          fill={`url(#${gradSheen})`}
          opacity="0.85"
        />
        {/* Bottom-Left Facet */}
        <path
          d="M 100,190 C 100,135 65,100 10,100 L 100,100 Z"
          fill={`url(#${gradSheen})`}
          opacity="0.7"
        />
        {/* Bottom-Right Deep Shadow Facet */}
        <path
          d="M 100,100 L 190,100 C 135,100 100,135 100,190 Z"
          fill={`url(#${gradShade})`}
          opacity="0.9"
        />
        {/* Top-Left Crisp Ridge */}
        <path
          d="M 100,100 L 10,100 C 65,100 100,65 100,10 Z"
          fill="#ffffff"
          opacity="0.4"
        />

        {/* Specular White Rim / Light Reflex on Edge */}
        <path
          d="M 100,12 C 100,55 125,82 165,95"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
          filter={`url(#blur-${starId})`}
        />
        <path
          d="M 100,15 C 100,58 123,80 160,92"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Central Glint Flare */}
        <circle cx="100" cy="100" r="5" fill="#ffffff" opacity="0.9" filter={`url(#blur-${starId})`} />
        <circle cx="100" cy="100" r="2.5" fill="#ffffff" />
      </svg>
    </div>
  );
};
