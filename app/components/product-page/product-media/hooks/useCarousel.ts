import { useState, useRef, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseSimpleCarouselProps {
  mediaCount: number;
  autoReset?: boolean;
  scrollDebounceMs?: number;
}

export const useCarousel = ({ 
  mediaCount, 
  autoReset = true, 
  scrollDebounceMs = 150
}: UseSimpleCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Debounced scroll end
  const debouncedScrollEnd = useDebounce(() => {
    setIsScrolling(false);
  }, scrollDebounceMs);

  // Auto reset when media changes
  useEffect(() => {
    if (autoReset && mediaCount >= 0) {
      setCurrentIndex(0);
    }
  }, [mediaCount, autoReset]);

  // Handle native scroll (mobile only)
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || mediaCount <= 0) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const itemWidth = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);

    if (newIndex >= 0 && newIndex < mediaCount && newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }

    setIsScrolling(true);
    debouncedScrollEnd();
  }, [mediaCount, currentIndex, debouncedScrollEnd]);

  // Setup scroll listener (mobile only)
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Programmatic navigation (for dot clicks and arrows)
  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < mediaCount) {
        setCurrentIndex(index);

        // Scroll mobile carousel if it exists (for dot clicks)
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: index * scrollRef.current.clientWidth,
            behavior: 'smooth',
          });
        }
      }
    },
    [mediaCount],
  );

  const goToPrevious = useCallback(() => {
    const newIndex = Math.max(currentIndex - 1, 0);
    goToIndex(newIndex);
  }, [currentIndex, goToIndex]);

  const goToNext = useCallback(() => {
    const newIndex = Math.min(currentIndex + 1, mediaCount - 1);
    goToIndex(newIndex);
  }, [currentIndex, mediaCount, goToIndex]);

  // Clean selectors (computed values)
  const canGoToPrevious = currentIndex > 0;
  const canGoToNext = currentIndex < mediaCount - 1;
  const hasMultipleItems = mediaCount > 1;
  const isEmpty = mediaCount === 0;

  return {
    // State
    currentIndex,
    isScrolling,

    // Actions
    goToIndex,
    goToPrevious,
    goToNext,

    // Selectors
    canGoToPrevious,
    canGoToNext,
    hasMultipleItems,
    isEmpty,

    // Refs
    scrollRef,
  };
};