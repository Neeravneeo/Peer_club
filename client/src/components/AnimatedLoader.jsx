import React from 'react';

const COLOR_VARIANTS = {
  brand: ['#b8caf5', '#9db4f0', '#7c9de8', '#6366f1', '#4f46e5', '#6366f1', '#7c9de8', '#9db4f0'],
  mint: ['#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  marigold: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  periwinkle: ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
  ink: ['#f7f7f7', '#efefef', '#e1e1e1', '#bebbba', '#41413f', '#bebbba', '#e1e1e1', '#efefef'],
};

const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * AnimatedLoader - 8-segment rotating capsule ring spinner
 * @param {Object} props
 * @param {number} [props.size=40] - Size in pixels (width & height)
 * @param {'rotate' | 'pulse' | 'breathe' | 'color-shift'} [props.variant='rotate'] - Animation variant
 * @param {'brand' | 'mint' | 'marigold' | 'periwinkle' | 'ink'} [props.color='brand'] - Palette variant
 * @param {string} [props.className=''] - Additional container classes
 * @param {string} [props.label='Loading'] - Accessibility announcement text
 * @param {boolean} [props.glow=false] - Whether to apply soft pastel glow (for AI states)
 */
export function AnimatedLoader({
  size = 40,
  variant = 'rotate',
  color = 'brand',
  className = '',
  label = 'Loading',
  glow = false,
}) {
  const palette = COLOR_VARIANTS[color] || COLOR_VARIANTS.brand;

  // Determine top-level animation class
  let variantClass = '';
  switch (variant) {
    case 'rotate':
      variantClass = 'animate-loader-rotate';
      break;
    case 'breathe':
      variantClass = 'animate-loader-breathe';
      break;
    case 'color-shift':
      variantClass = 'animate-loader-rotate animate-loader-color-shift';
      break;
    case 'pulse':
    default:
      variantClass = '';
      break;
  }

  const shadowStyle = glow
    ? { filter: 'drop-shadow(0 0 16px rgba(155, 216, 169, 0.45)) drop-shadow(0 4px 12px rgba(99, 102, 241, 0.15))' }
    : { filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.12))' };

  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`select-none pointer-events-none ${variantClass}`}
        style={shadowStyle}
      >
        {ROTATIONS.map((rotation, i) => (
          <g key={i} transform={`rotate(${rotation} 50 50)`}>
            <rect
              x="46"
              y="8"
              width="8"
              height="16"
              rx="4"
              fill={palette[i % palette.length]}
              className={variant === 'pulse' ? 'animate-segment-pulse' : ''}
              style={variant === 'pulse' ? { animationDelay: `${i * 0.1}s` } : undefined}
            />
          </g>
        ))}
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default AnimatedLoader;
