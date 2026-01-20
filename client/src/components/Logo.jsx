import React from 'react';
import './Logo.css';

const Logo = ({ onClick, size = 56 }) => {
  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="logo-container"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label="Frolic"
      title="Frolic"
    >
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#433D8B" />
          </linearGradient>
          <radialGradient id="halo" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#433D8B" stopOpacity="0"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Halo */}
        <circle cx="60" cy="48" r="42" fill="url(#halo)" opacity="0.9" filter="url(#glow)" />

        {/* Abstract F / mark */}
        <path d="M30 30 H72 V42 H46 V54 H72 V78 H30 V66 H58 V54 H30 Z" fill="url(#fg)" filter="url(#glow)" />

        {/* Accent stroke */}
        <path d="M30 30 H72 V42 H46 V54 H72 V78 H30" stroke="#E8F6FF" strokeOpacity="0.06" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <span className="logo-text">Frolic</span>
    </div>
  );
};

export default Logo;