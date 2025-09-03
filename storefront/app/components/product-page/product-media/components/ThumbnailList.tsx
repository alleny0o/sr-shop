import React, { useCallback, useMemo } from 'react';
import { ThumbnailButton } from './ThumbnailButton';
import { ProductQuery } from 'storefrontapi.generated';

interface ThumbnailListProps {
  mediaToShow: NonNullable<ProductQuery['product']>['media']['edges'];
  currentIndex: number;
  productTitle: string;
  mediaLoadErrors: Set<string>;
  onSelectIndex: (index: number) => void;
  onMediaError: (nodeId: string) => void;
}

export const ThumbnailList = React.memo<ThumbnailListProps>(({
  mediaToShow,
  currentIndex,
  productTitle,
  mediaLoadErrors,
  onSelectIndex,
  onMediaError,
}) => {
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectIndex(index);
    }
  }, [onSelectIndex]);

  // Memoized container style
  const containerStyle = useMemo(() => ({
    WebkitOverflowScrolling: 'touch' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
  }), []);

  return (
    <div className="w-16 flex-shrink-0">
      <div
        className="flex flex-col gap-2 max-h-[450px] overflow-y-auto scrollbar-hide p-px"
        style={containerStyle}
        role="tablist"
        aria-label="Product media thumbnails"
      >
        {mediaToShow.map(({ node }, index) => (
          <ThumbnailButton
            key={node.id}
            node={node}
            index={index}
            isSelected={index === currentIndex}
            productTitle={productTitle}
            totalMedia={mediaToShow.length}
            hasError={mediaLoadErrors.has(node.id)}
            onClick={() => onSelectIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onMediaError={onMediaError}
          />
        ))}
      </div>
    </div>
  );
});

ThumbnailList.displayName = 'ThumbnailList';