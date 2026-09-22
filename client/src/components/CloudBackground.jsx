import React from "react";

export const CloudBackground = ({ gradientClass = "bg-gradient-to-b from-[#B8D4E3] to-[#DCE6EE]" }) => {
  const clouds = [
    { id: 1, size: 'large', top: '8%', left: '4%', duration: '25s', opacity: 0.6, halftone: true },
    { id: 2, size: 'medium', top: '16%', right: '8%', duration: '30s', opacity: 0.8, halftone: false },
    { id: 3, size: 'small', top: '56%', left: '10%', duration: '20s', opacity: 0.6, halftone: true },
    { id: 4, size: 'large', top: '68%', right: '4%', duration: '28s', opacity: 0.6, halftone: true },
    { id: 5, size: 'medium', top: '38%', left: '68%', duration: '22s', opacity: 0.8, halftone: false },
    { id: 6, size: 'small', top: '84%', left: '36%', duration: '26s', opacity: 0.6, halftone: true },
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Soft Sky Gradient */}
      <div className={`absolute inset-0 ${gradientClass}`} />

      {/* Scattered Organic Halftone Clouds */}
      {clouds.map((cloud) => (
        <Cloud key={cloud.id} {...cloud} />
      ))}
    </div>
  );
};

const Cloud = ({ size, top, left, right, duration, opacity, halftone }) => {
  const sizeClass =
    size === 'large'
      ? 'w-80 sm:w-96 h-40 sm:h-48'
      : size === 'medium'
      ? 'w-56 sm:w-64 h-28 sm:h-32'
      : 'w-36 sm:w-44 h-18 sm:h-22';

  const animClass = `animate-cloud-${duration}`;

  return (
    <div
      className={`absolute ${sizeClass} ${animClass}`}
      style={{ top, left, right, opacity }}
    >
      <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-[0_12px_24px_rgba(45,91,255,0.06)]">
        <defs>
          {halftone && (
            <pattern id={`dots-${size}-${duration}`} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.25" fill="#B8DFF0" opacity="0.6" />
            </pattern>
          )}
        </defs>

        {/* Cloud Body Outline */}
        <path
          d="M20,60 Q20,40 40,40 Q50,20 80,20 Q110,20 120,40 Q140,40 140,60 Q140,80 120,80 L40,80 Q20,80 20,60 Z"
          fill="white"
          opacity="0.95"
        />

        {/* Halftone Pattern Accent */}
        {halftone && (
          <path
            d="M20,60 Q20,40 40,40 Q50,20 80,20 Q110,20 120,40 Q140,40 140,60 Q140,80 120,80 L40,80 Q20,80 20,60 Z"
            fill={`url(#dots-${size}-${duration})`}
          />
        )}
      </svg>
    </div>
  );
};

export default CloudBackground;
