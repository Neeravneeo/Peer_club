import { useState, useCallback } from 'react';

/**
 * useLoader - Hook to orchestrate loading state, labels, and async execution
 * @param {boolean} [initialState=false] - Initial loading state
 * @param {string} [initialText=''] - Initial loading text
 * @returns {{
 *   isLoading: boolean,
 *   loadingText: string,
 *   startLoading: (text?: string) => void,
 *   stopLoading: () => void,
 *   setLoadingText: (text: string) => void,
 *   withLoading: <T>(asyncFn: () => Promise<T>, text?: string) => Promise<T>
 * }}
 */
export function useLoader(initialState = false, initialText = '') {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingText, setLoadingText] = useState(initialText);

  const startLoading = useCallback((text = '') => {
    if (text) setLoadingText(text);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(
    async (asyncFn, text = '') => {
      if (text) setLoadingText(text);
      setIsLoading(true);
      try {
        return await asyncFn();
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    setLoadingText,
    withLoading,
  };
}

export default useLoader;
