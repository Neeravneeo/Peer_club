import React from 'react';
import { AnimatedLoader } from './AnimatedLoader';

/**
 * ButtonLoader - Compact spinner designed specifically for button states
 * @param {Object} props
 * @param {boolean} [props.isLoading=true] - Whether to show the loader
 * @param {string} [props.loadingText] - Text to display while loading
 * @param {React.ReactNode} [props.children] - Default button content when not loading
 * @param {number} [props.size=16] - Size of spinner
 * @param {'rotate' | 'pulse' | 'breathe' | 'color-shift'} [props.variant='pulse'] - Animation variant
 * @param {'brand' | 'mint' | 'marigold' | 'periwinkle' | 'ink'} [props.color='brand'] - Palette
 * @param {string} [props.className=''] - Class for the wrapper
 */
export function ButtonLoader({
  isLoading = true,
  loadingText,
  children,
  size = 16,
  variant = 'pulse',
  color = 'brand',
  className = '',
}) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <span className={`inline-flex items-center justify-center gap-2 ${className}`}>
      <AnimatedLoader
        size={size}
        variant={variant}
        color={color}
        label={loadingText || 'Processing...'}
      />
      {loadingText && <span>{loadingText}</span>}
      {!loadingText && children}
    </span>
  );
}

export default ButtonLoader;
