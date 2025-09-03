import React, { useMemo } from 'react';

interface DotIndicatorProps {
  totalMedia: number;
  currentIndex: number;
}

export const DotIndicator: React.FC<DotIndicatorProps> = ({ totalMedia, currentIndex }) => {
  if (totalMedia <= 1) return null;

  const maxVisibleDots = 5;

  const dotConfig = useMemo(() => {
    if (totalMedia <= maxVisibleDots) {
      return {
        indices: Array.from({ length: totalMedia }, (_, i) => i),
        startIndex: 0,
        endIndex: totalMedia - 1,
      };
    }

    // Calculate sliding window
    const halfVisible = Math.floor(maxVisibleDots / 2);
    let startIndex = Math.max(0, currentIndex - halfVisible);
    let endIndex = Math.min(totalMedia - 1, startIndex + maxVisibleDots - 1);

    // Adjust start if we're near the end
    if (endIndex === totalMedia - 1) {
      startIndex = Math.max(0, endIndex - maxVisibleDots + 1);
    }

    const indices = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => startIndex + i);
    
    return {
      indices,
      startIndex,
      endIndex,
    };
  }, [totalMedia, currentIndex]);

  const getDotSize = (index: number) => {
    if (totalMedia <= maxVisibleDots) return 'w-2 h-2';
    
    const { startIndex, endIndex } = dotConfig;
    const isFirst = index === startIndex;
    const isLast = index === endIndex;
    
    // Edge dots are smaller to indicate continuation
    if (currentIndex > 1 && currentIndex < totalMedia - 2) {
      return (isFirst || isLast) ? 'w-1.5 h-1.5' : 'w-2 h-2';
    }
    
    // First two positions: make last dot smaller
    if (currentIndex <= 1) {
      return isLast ? 'w-1.5 h-1.5' : 'w-2 h-2';
    }
    
    // Last two positions: make first dot smaller
    if (currentIndex >= totalMedia - 2) {
      return isFirst ? 'w-1.5 h-1.5' : 'w-2 h-2';
    }
    
    return 'w-2 h-2';
  };

  return (
    <div className="flex justify-center mt-3">
      <div className="flex items-center gap-2">
        {dotConfig.indices.map(index => (
          <div
            key={index}
            className={`${getDotSize(index)} rounded-full transition-all duration-300 ease-out ${
              index === currentIndex 
                ? 'bg-neutral-900' 
                : 'bg-neutral-300'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
};