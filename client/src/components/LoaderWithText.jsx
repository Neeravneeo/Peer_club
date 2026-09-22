import React from 'react';
import { AnimatedLoader } from './AnimatedLoader';

/**
 * LoaderWithText - AnimatedLoader paired with Craft.do typography labels
 * @param {Object} props
 * @param {string} [props.text='Loading...'] - Primary message
 * @param {string} [props.subtext] - Secondary descriptive hint
 * @param {number} [props.size=48] - Loader size
 * @param {'rotate' | 'pulse' | 'breathe' | 'color-shift'} [props.variant='rotate'] - Animation variant
 * @param {'brand' | 'mint' | 'marigold' | 'periwinkle' | 'ink'} [props.color='brand'] - Palette
 * @param {'vertical' | 'horizontal'} [props.direction='vertical'] - Layout orientation
 * @param {boolean} [props.glow=false] - Soft glow effect
 * @param {string} [props.className=''] - Container class
 */
export function LoaderWithText({
  text = 'Loading...',
  subtext,
  size = 48,
  variant = 'rotate',
  color = 'brand',
  direction = 'vertical',
  glow = false,
  className = '',
}) {
  const isVertical = direction === 'vertical';

  return (
    <div
      className={`flex items-center justify-center ${
        isVertical ? 'flex-col text-center gap-3.5 py-6' : 'flex-row text-left gap-3'
      } ${className}`}
    >
      <AnimatedLoader
        size={size}
        variant={variant}
        color={color}
        label={text}
        glow={glow}
      />
      <div>
        <p className="text-sm font-medium text-[var(--color-ink,#030302)] leading-snug">
          {text}
        </p>
        {subtext && (
          <p className="text-xs text-[var(--color-graphite,#41413f)] mt-0.5 leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoaderWithText;
