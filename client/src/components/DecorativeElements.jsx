import React from 'react';

/**
 * Torn Paper Edge SVG Element
 * Creates an organic, tactile paper-edge texture for the Craft Docs scrapbook aesthetic
 */
export const TornPaperEdge = ({ className = '', color = '#fff3e7', flip = false }) => (
  <svg
    viewBox="0 0 1200 40"
    preserveAspectRatio="none"
    className={`w-full h-6 pointer-events-none select-none ${flip ? 'rotate-180' : ''} ${className}`}
  >
    <path
      d="M0,0 L0,20 Q40,32 80,18 T160,25 T240,15 T320,28 T400,16 T480,24 T560,14 T640,26 T720,18 T800,28 T880,16 T960,25 T1040,15 T1120,27 T1200,18 L1200,0 Z"
      fill={color}
    />
  </svg>
);

/**
 * Scrapbook Torn Paper Badge / Card Backing
 */
export const TornPaperBackdrop = ({ className = '', color = 'bg-craft-mint/20' }) => (
  <div
    className={`absolute -inset-1.5 rounded-3xl -rotate-1 ${color} pointer-events-none -z-10 transition-transform group-hover:rotate-0 ${className}`}
  />
);

/**
 * Dot Grid Pattern Background
 */
export const DotGridPattern = ({ className = '', opacity = 'opacity-30' }) => (
  <div
    className={`absolute inset-0 pointer-events-none select-none ${opacity} ${className}`}
    style={{
      backgroundImage: 'radial-gradient(circle, var(--color-ash) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }}
  />
);

/**
 * Organic Soft Pastel Blob Backgrounds
 */
export const PastelBlob = ({
  color = '#9bd8a9',
  className = 'w-72 h-72 top-10 left-10',
  opacity = 0.15,
}) => (
  <div
    className={`absolute rounded-full blur-[60px] pointer-events-none select-none -z-0 ${className}`}
    style={{ backgroundColor: color, opacity }}
  />
);

/**
 * Hand-Drawn Wavy Underline SVG
 */
export const HandDrawnUnderline = ({ className = 'w-32 h-3', color = '#9bd8a9' }) => (
  <svg
    viewBox="0 0 160 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path
      d="M3 11C35 4 75 14 105 8C125 4 145 10 157 7"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Hand-Drawn Arrow SVG with Papaya Accent
 */
export const HandDrawnArrow = ({ className = 'w-12 h-8', color = 'var(--color-papaya)' }) => (
  <svg
    viewBox="0 0 60 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block pointer-events-none select-none ${className}`}
  >
    <path
      d="M6 24 C 20 8, 38 10, 52 20 M 42 12 L 53 21 L 40 28"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default {
  TornPaperEdge,
  TornPaperBackdrop,
  DotGridPattern,
  PastelBlob,
  HandDrawnUnderline,
  HandDrawnArrow,
};

