import React, { useCallback, useMemo } from 'react';
import { useCarousel } from '../hooks/useCarousel';
import { useDragSupport } from '../hooks/useDragSupport';
import { ThumbnailList } from './ThumbnailList';
import { DesktopSlide } from './DesktopSlide';
import { NavigationArrows } from './NavigationArrows';
import { ProductQuery } from 'storefrontapi.generated';

interface DesktopCarouselProps {
  mediaToShow: NonNullable<ProductQuery['product']>['media']['edges'];
  productTitle: string;
  mediaLoadErrors: Set<string>;
  onMediaError: (nodeId: string) => void;
  onMediaLoad: (nodeId: string) => void;
  onOpenModal: (index: number) => void;
}

export const DesktopCarousel = React.memo<DesktopCarouselProps>(({
  mediaToShow,
  productTitle,
  mediaLoadErrors,
  onMediaError,
  onMediaLoad,
  onOpenModal,
}) => {
  // Desktop carousel state
  const carousel = useCarousel({
    mediaCount: mediaToShow.length,
    autoReset: true,
  });

  // Desktop drag support
  const dragSupport = useDragSupport({
    enabled: true,
    onSwipeLeft: carousel.goToNext,
    onSwipeRight: carousel.goToPrevious,
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

  // Memoized container style
  const containerStyle = useMemo(() => ({
    cursor: dragSupport.isDragging ? 'grabbing' as const : 'grab' as const,
    aspectRatio: '1',
    WebkitUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const,
  }), [dragSupport.isDragging]);

  // Memoized transform style
  const transformStyle = useMemo(() => ({
    transform: `translateX(-${carousel.currentIndex * 100}%)`,
    willChange: 'transform' as const,
  }), [carousel.currentIndex]);

  return (
    <div className="hidden lg:flex gap-4 w-full">
      {/* Thumbnails */}
      {carousel.hasMultipleItems && (
        <ThumbnailList
          mediaToShow={mediaToShow}
          currentIndex={carousel.currentIndex}
          productTitle={productTitle}
          mediaLoadErrors={mediaLoadErrors}
          onSelectIndex={carousel.goToIndex}
          onMediaError={onMediaError}
        />
      )}

      {/* Main Media Container */}
      <div className="flex-1 relative">
        <div
          className="aspect-square overflow-hidden relative select-none"
          style={containerStyle}
          onMouseDown={dragSupport.onMouseDown}
          onMouseMove={dragSupport.onMouseMove}
          onMouseUp={dragSupport.onMouseUp}
          onClick={handleClick}
        >
          <div
            className="flex h-full relative transition-transform duration-500 ease-out"
            style={transformStyle}
          >
            {mediaToShow.map(({ node }, index) => (
              <DesktopSlide
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

          {/* Navigation Arrows */}
          {carousel.hasMultipleItems && (
            <NavigationArrows
              canGoToPrevious={carousel.canGoToPrevious}
              canGoToNext={carousel.canGoToNext}
              onPrevious={carousel.goToPrevious}
              onNext={carousel.goToNext}
            />
          )}
        </div>
      </div>
    </div>
  );
});

DesktopCarousel.displayName = 'DesktopCarousel';