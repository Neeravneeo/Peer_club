import { useState, useEffect, useCallback, useRef } from 'react';

export function useModalAnimation(isOpen, onClose) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsAnimatingOut(false);
    } else if (isRendered) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsAnimatingOut(false);
      }, 200); // 200ms matches exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen || !modalContentRef.current) return;
    const focusableElements = modalContentRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    }
  }, [isOpen]);

  return {
    isRendered,
    isAnimatingOut,
    modalContentRef,
  };
}
