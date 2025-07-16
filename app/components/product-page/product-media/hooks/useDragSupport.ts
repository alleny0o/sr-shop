import React, { useRef, useCallback, useState } from 'react';

interface DragConfig {
  enabled: boolean;
  threshold?: number;
  // For mobile scroll navigation
  scrollRef?: React.RefObject<HTMLDivElement>;
  mediaCount?: number;
  // For desktop state-based navigation
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const useDragSupport = (config: DragConfig) => {
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const hasMovedRef = useRef(false);
  const hasTriggeredRef = useRef(false);
  const threshold = config.threshold || 50;

  // Get current index from actual scroll position
  const getCurrentScrollIndex = useCallback(() => {
    if (!config.scrollRef?.current || !config.mediaCount) return 0;

    const scrollEl = config.scrollRef.current;
    const scrollLeft = scrollEl.scrollLeft;
    const itemWidth = scrollEl.clientWidth;
    return Math.round(scrollLeft / itemWidth);
  }, [config.scrollRef, config.mediaCount]);

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      // Mobile: Use scroll navigation if scrollRef provided
      if (config.scrollRef?.current && config.mediaCount) {
        const currentIndex = getCurrentScrollIndex();
        const newIndex =
          direction === 'left' ? Math.min(currentIndex + 1, config.mediaCount - 1) : Math.max(currentIndex - 1, 0);

        config.scrollRef.current.scrollTo({
          left: newIndex * config.scrollRef.current.clientWidth,
          behavior: 'smooth',
        });
      }
      // Desktop: Use callback navigation
      else {
        if (direction === 'left' && config.onSwipeLeft) {
          config.onSwipeLeft();
        } else if (direction === 'right' && config.onSwipeRight) {
          config.onSwipeRight();
        }
      }
    },
    [config.scrollRef, config.mediaCount, config.onSwipeLeft, config.onSwipeRight, getCurrentScrollIndex],
  );

  // Mouse event handlers only
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!config.enabled) return;

      e.preventDefault();
      setIsDragging(true);
      hasMovedRef.current = false;
      startXRef.current = e.clientX;
      hasTriggeredRef.current = false;
    },
    [config.enabled],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!config.enabled || !isDragging) return;

      const deltaX = e.clientX - startXRef.current;

      if (Math.abs(deltaX) > 5) {
        hasMovedRef.current = true;
      }

      if (!hasTriggeredRef.current && Math.abs(deltaX) >= threshold) {
        hasTriggeredRef.current = true;
        const direction = deltaX > 0 ? 'right' : 'left';
        handleSwipe(direction);
      }
    },
    [config.enabled, isDragging, threshold, handleSwipe],
  );

  const handleMouseUp = useCallback(() => {
    if (!config.enabled) return;
    setIsDragging(false);
  }, [config.enabled]);

  // Global mouse events for when mouse leaves the element
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!config.enabled || !isDragging) return;

      const deltaX = e.clientX - startXRef.current;

      if (Math.abs(deltaX) > 5) {
        hasMovedRef.current = true;
      }

      if (!hasTriggeredRef.current && Math.abs(deltaX) >= threshold) {
        hasTriggeredRef.current = true;
        const direction = deltaX > 0 ? 'right' : 'left';
        handleSwipe(direction);
      }
    },
    [config.enabled, isDragging, threshold, handleSwipe],
  );

  const handleGlobalMouseUp = useCallback(() => {
    if (!config.enabled) return;
    setIsDragging(false);
  }, [config.enabled]);

  React.useEffect(() => {
    if (!config.enabled || !isDragging) return;

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [config.enabled, isDragging, handleGlobalMouseMove, handleGlobalMouseUp]);

  if (!config.enabled) {
    return {
      isDragging: false,
      hasMovedRef: { current: false },
      onMouseDown: undefined,
      onMouseMove: undefined,
      onMouseUp: undefined,
    };
  }

  return {
    isDragging,
    hasMovedRef,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
  };
};
