import { useState, useEffect, useCallback } from 'react';

export const useMediaErrors = (mediaCount: number) => {
  const [mediaLoadErrors, setMediaLoadErrors] = useState<Set<string>>(() => new Set());

  // Reset errors when media changes
  useEffect(() => {
    setMediaLoadErrors(new Set());
  }, [mediaCount]);

  const handleMediaError = useCallback((nodeId: string) => {
    setMediaLoadErrors(prev => {
      if (prev.has(nodeId)) return prev; // No change needed
      const newSet = new Set(prev);
      newSet.add(nodeId);
      return newSet;
    });
  }, []);

  const handleMediaLoad = useCallback((nodeId: string) => {
    setMediaLoadErrors(prev => {
      if (!prev.has(nodeId)) return prev; // No change needed
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  }, []);

  return {
    mediaLoadErrors,
    handleMediaError,
    handleMediaLoad,
  };
};
