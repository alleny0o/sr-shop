import React, { useCallback, useMemo } from 'react';
import { useCarousel } from '../hooks/useCarousel';
import { useDragSupport } from '../hooks/useDragSupport';
import { DotIndicator } from './DotIndicator';
import { MobileSlide } from './MobileSlide';
import { ProductQuery } from 'storefrontapi.generated';

interface MobileCarouselProps {
  mediaToShow: NonNullable<ProductQuery['product']>['media']['edges'];
  productTitle: string;
  mediaLoadErrors: Set<string>;
  onMediaError: (nodeId: string) => void;
  onMediaLoad: (nodeId: string) => void;
  onOpenModal: (index: number) => void;
}

export const MobileCarousel = React.memo<MobileCarouselProps>(({
  mediaToShow,
  productTitle,
  mediaLoadErrors,
  onMediaError,
  onMediaLoad,
  onOpenModal,
}) => {
  // Carousel state with auto-reset
  const carousel = useCarousel({
    mediaCount: mediaToShow.length,
    autoReset: true,
    scrollDebounceMs: 200,
  });

  // Drag support with ref
  const dragSupport = useDragSupport({
    enabled: true,
    scrollRef: carousel.scrollRef,
    mediaCount: mediaToShow.length,
    threshold: 30,
  });

  // Handle click to open modal
  const handleClick = useCallback(() => {
    const hasMoved = dragSupport.hasMovedRef.current;
    dragSupport.hasMovedRef.current = false;

    if (!hasMoved && !carousel.isScrolling) {
      onOpenModal(carousel.currentIndex);
    }
  }, [carousel.isScrolling, carousel.currentIndex, dragSupport.hasMovedRef, onOpenModal]);

  // Memoized style object
  const scrollStyle = useMemo(() => ({
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitOverflowScrolling: 'touch' as const,
    cursor: dragSupport.isDragging ? 'grabbing' as const : 'grab' as const,
    touchAction: 'pan-x pinch-zoom' as const,
    WebkitUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const,
  }), [dragSupport.isDragging]);

  return (
    <div className="lg:hidden">
      <div className="relative">
        <div
          ref={carousel.scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide select-none"
          style={scrollStyle}
          role="region"
          aria-label="Product media carousel"
          onMouseDown={dragSupport.onMouseDown}
          onMouseMove={dragSupport.onMouseMove}
          onMouseUp={dragSupport.onMouseUp}
          onClick={handleClick}
        >
          {mediaToShow.map(({ node }, index) => (
            <MobileSlide
              key={node.id}
              node={node}
              index={index}
              productTitle={productTitle}
              totalMedia={mediaToShow.length}
              hasError={mediaLoadErrors.has(node.id)}
              onError={onMediaError}
              onLoad={onMediaLoad}
            />
          ))}
        </div>
      </div>

      {/* Mobile Dot Indicator */}
      {carousel.hasMultipleItems && (
        <DotIndicator 
          totalMedia={mediaToShow.length} 
          currentIndex={carousel.currentIndex} 
        />
      )}
    </div>
  );
});

MobileCarousel.displayName = 'MobileCarousel';