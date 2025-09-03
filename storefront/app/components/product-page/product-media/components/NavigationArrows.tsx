import React, { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationArrowsProps {
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const NavigationArrows = React.memo<NavigationArrowsProps>(({
  canGoToPrevious,
  canGoToNext,
  onPrevious,
  onNext,
}) => {
  const handlePrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onPrevious();
  }, [onPrevious]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onNext();
  }, [onNext]);

  const stopPropagation = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  // Memoized button style
  const buttonStyle = useMemo(() => ({
    borderRadius: '0',
    WebkitTapHighlightColor: 'transparent',
  }), []);

  return (
    <>
      <button
        onClick={handlePrevious}
        onMouseDown={stopPropagation}
        onTouchStart={stopPropagation}
        disabled={!canGoToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto p-2 flex items-center justify-center bg-pastel-yellow-light border border-gray-300 shadow-sm cursor-pointer transition-all duration-200 hover:translate-x-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
        style={buttonStyle}
        aria-label="Previous media"
      >
        <ChevronLeft className="w-4.5 h-4.5 text-black" />
      </button>

      <button
        onClick={handleNext}
        onMouseDown={stopPropagation}
        onTouchStart={stopPropagation}
        disabled={!canGoToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto p-2 flex items-center justify-center bg-pastel-yellow-light border border-gray-300 shadow-sm cursor-pointer transition-all duration-200 hover:translate-x-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
        style={buttonStyle}
        aria-label="Next media"
      >
        <ChevronRight className="w-4.5 h-4.5 text-black" />
      </button>
    </>
  );
});

NavigationArrows.displayName = 'NavigationArrows';