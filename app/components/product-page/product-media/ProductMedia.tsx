// react imports
import React, { useMemo, useState, useEffect } from 'react';

// lucide imports
import { AlertCircle, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';

// hooks imports
import { useCarousel } from './hooks/useCarousel';
import { useDragSupport } from './hooks/useDragSupport';
import { useMediaErrors } from './hooks/useMediaErrors';
import { useModal } from './hooks/useModal';

// component imports
import { DotIndicator } from './components/DotIndicator';
import { GalleryMediaRenderer } from './components/media/GalleryMediaRenderer';
import { ThumbnailRenderer } from './components/media/ThumbnailRenderer';
import { ProductMediaModal } from './components/modal/ProductMediaModal';

// storefrontapi.generated imports
import { ProductQuery } from 'storefrontapi.generated';

type ProductMediaProps = {
  media: NonNullable<ProductQuery['product']>['media'];
  selectedVariant?: {
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  };
  isLoading?: boolean;
  error?: string | null;
  productTitle?: string;
};

export const ProductMedia: React.FC<ProductMediaProps> = ({
  media,
  selectedVariant,
  isLoading = false,
  error = null,
  productTitle = '',
}) => {
  // Track individual media loading states - start empty, only add when actually loading
  const [loadingMedia, setLoadingMedia] = useState<Set<string>>(new Set());

  // Get media to display - variant-specific or all media (memoized for performance)
  const mediaToShow = useMemo(() => {
    if (!media?.edges) return [];

    const currentVariantValues = selectedVariant?.selectedOptions?.map(option => option.value) || [];
    const variantMedia = media.edges.filter(({ node }) => {
      const altText = node.alt || '';
      if (!altText.startsWith('#')) return false;
      const variantValue = altText.substring(1);
      return currentVariantValues.includes(variantValue);
    });

    const result = variantMedia.length > 0 ? variantMedia : media.edges;

    // Clear loading state when media changes (variant switching)
    setLoadingMedia(new Set());

    return result;
  }, [media?.edges, selectedVariant?.selectedOptions]);

  // 🎉 NEW SIMPLE SEPARATE CAROUSELS - No syncing, no conflicts!
  const mobileCarousel = useCarousel({
    mediaCount: mediaToShow.length,
    autoReset: true,
    scrollDebounceMs: 200, // Increased for better performance
  });

  const desktopCarousel = useCarousel({
    mediaCount: mediaToShow.length,
    autoReset: true,
  });

  // Simple drag support with touch events
  const mobileDrag = useDragSupport({
    enabled: true,
    scrollRef: mobileCarousel.scrollRef,
    mediaCount: mediaToShow.length,
    threshold: 30, // Increased threshold for more deliberate swipes
  });

  const desktopDrag = useDragSupport({
    enabled: true,
    onSwipeLeft: desktopCarousel.goToNext,
    onSwipeRight: desktopCarousel.goToPrevious,
    threshold: 30,
  });

  // Keep existing hooks (unchanged)
  const {
    mediaLoadErrors,
    handleMediaError,
    handleMediaLoad: originalHandleMediaLoad,
  } = useMediaErrors(mediaToShow.length);
  const modalHook = useModal({ mediaCount: mediaToShow.length });

  // Enhanced media load handler - only add to loading when actually starting to load
  const handleMediaLoadStart = (nodeId: string) => {
    setLoadingMedia(prev => new Set([...prev, nodeId]));
  };

  const handleMediaLoad = (nodeId: string) => {
    setLoadingMedia(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
    originalHandleMediaLoad(nodeId);
  };

  // Enhanced media error handler
  const handleMediaErrorWithLoading = (nodeId: string) => {
    setLoadingMedia(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
    handleMediaError(nodeId);
  };

  // Handle keyboard navigation (simplified)
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      desktopCarousel.goToIndex(index);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full aspect-square bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <span className="sr-only">Loading product media</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-pastel-green-dark mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm text-gray-600">Failed to load media</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (mobileCarousel.isEmpty) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ImageOff className="w-8 h-8 text-gray-400 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm text-gray-600">No media available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row">
        {/* 📱 MOBILE LAYOUT - Enhanced for Safari/iOS */}
        <div className="lg:hidden">
          <div className="relative">
            <div
              ref={mobileCarousel.scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide select-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
                cursor: mobileDrag.isDragging ? 'grabbing' : 'grab',
                touchAction: 'pan-x pinch-zoom', // Allow horizontal scroll and pinch zoom
                // Safari specific fixes
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
              role="region"
              aria-label="Product media carousel"
              // Mouse events for enhanced desktop interaction in mobile view
              onMouseDown={mobileDrag.onMouseDown}
              onMouseMove={mobileDrag.onMouseMove}
              onMouseUp={mobileDrag.onMouseUp}
              onClick={e => {
                const hasMoved = mobileDrag.hasMovedRef.current;
                mobileDrag.hasMovedRef.current = false;

                if (!hasMoved && !mobileCarousel.isScrolling) {
                  modalHook.handleOpen(mobileCarousel.currentIndex, 'mobile');
                }
              }}
            >
              {mediaToShow.map(({ node }, index) => (
                <div key={node.id} className="flex-shrink-0 w-full snap-start relative">
                  {/* Individual loading indicator */}
                  {loadingMedia.has(node.id) && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                  )}

                  <div
                    className={`aspect-square transition-opacity duration-200 ${
                      loadingMedia.has(node.id) ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={{
                      // Ensure proper aspect ratio on all devices
                      aspectRatio: '1',
                      minHeight: '0',
                    }}
                  >
                    <GalleryMediaRenderer
                      node={node}
                      index={index}
                      productTitle={productTitle}
                      totalMedia={mediaToShow.length}
                      hasError={mediaLoadErrors.has(node.id)}
                      onError={handleMediaErrorWithLoading}
                      onLoad={handleMediaLoad}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🎉 Mobile Dot Indicator - Clean state */}
          {mobileCarousel.hasMultipleItems && (
            <DotIndicator totalMedia={mediaToShow.length} currentIndex={mobileCarousel.currentIndex} />
          )}
        </div>

        {/* 🖥️ DESKTOP LAYOUT - Enhanced for Safari */}
        <div className="hidden lg:flex gap-4 w-full">
          {/* Thumbnails */}
          {desktopCarousel.hasMultipleItems && (
            <div className="w-16 flex-shrink-0">
              <div
                className="flex flex-col gap-2 max-h-[450px] overflow-y-auto scrollbar-hide p-px"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                role="tablist"
                aria-label="Product media thumbnails"
              >
                {mediaToShow.map(({ node }, index) => (
                  <button
                    key={node.id}
                    onClick={() => desktopCarousel.goToIndex(index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    className={`w-full aspect-square flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-200 relative ${
                      index === desktopCarousel.currentIndex ? 'ring-1 ring-black' : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                    style={{
                      borderRadius: '0',
                      aspectRatio: '1',
                    }}
                    role="tab"
                    aria-selected={index === desktopCarousel.currentIndex}
                    aria-controls={`media-${node.id}`}
                  >
                    {/* Thumbnail loading indicator */}
                    {loadingMedia.has(node.id) && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      </div>
                    )}

                    <div
                      className={`transition-opacity duration-200 ${
                        loadingMedia.has(node.id) ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <ThumbnailRenderer
                        node={node}
                        index={index}
                        productTitle={productTitle}
                        totalMedia={mediaToShow.length}
                        hasError={mediaLoadErrors.has(node.id)}
                        onError={handleMediaErrorWithLoading}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Media Container */}
          <div className="flex-1 relative">
            <div
              className="aspect-square overflow-hidden relative select-none"
              style={{
                cursor: desktopDrag.isDragging ? 'grabbing' : 'grab',
                aspectRatio: '1',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
              onMouseDown={desktopDrag.onMouseDown}
              onMouseMove={desktopDrag.onMouseMove}
              onMouseUp={desktopDrag.onMouseUp}
              onClick={e => {
                const hasMoved = desktopDrag.hasMovedRef.current;
                desktopDrag.hasMovedRef.current = false;

                if (!hasMoved && !desktopCarousel.isScrolling) {
                  modalHook.handleOpen(desktopCarousel.currentIndex, 'desktop');
                }
              }}
            >
              <div
                className="flex transition-transform duration-500 ease-out h-full relative"
                style={{
                  transform: `translateX(-${desktopCarousel.currentIndex * 100}%)`,
                  willChange: 'transform', // Optimize for animations
                }}
              >
                {mediaToShow.map(({ node }, index) => (
                  <div key={node.id} className="flex-shrink-0 h-full relative" style={{ width: '100%' }}>
                    {/* Main media loading indicator */}
                    {loadingMedia.has(node.id) && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-100">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      </div>
                    )}

                    <div
                      className={`h-full transition-opacity duration-200 ${
                        loadingMedia.has(node.id) ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <GalleryMediaRenderer
                        node={node}
                        index={index}
                        productTitle={productTitle}
                        totalMedia={mediaToShow.length}
                        hasError={mediaLoadErrors.has(node.id)}
                        onError={handleMediaErrorWithLoading}
                        onLoad={handleMediaLoad}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Navigation Arrows */}
              {desktopCarousel.hasMultipleItems && (
                <>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      desktopCarousel.goToPrevious();
                    }}
                    onMouseDown={e => e.stopPropagation()}
                    onTouchStart={e => e.stopPropagation()}
                    disabled={!desktopCarousel.canGoToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto p-2 flex items-center justify-center bg-pastel-yellow-light border border-gray-300 shadow-sm cursor-pointer transition-all duration-200 hover:translate-x-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderRadius: '0',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <ChevronLeft className="w-4.5 h-4.5 text-black" />
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      desktopCarousel.goToNext();
                    }}
                    onMouseDown={e => e.stopPropagation()}
                    onTouchStart={e => e.stopPropagation()}
                    disabled={!desktopCarousel.canGoToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto p-2 flex items-center justify-center bg-pastel-yellow-light border border-gray-300 shadow-sm cursor-pointer transition-all duration-200 hover:translate-x-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderRadius: '0',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <ChevronRight className="w-4.5 h-4.5 text-black" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ProductMediaModal
        isOpen={modalHook.isOpen}
        currentIndex={modalHook.currentIndex}
        media={mediaToShow}
        mediaLoadErrors={mediaLoadErrors}
        onMediaError={handleMediaErrorWithLoading}
        onMediaLoad={handleMediaLoad}
        productTitle={productTitle}
        onClose={modalHook.handleClose}
        openedFromScreenSize={modalHook.openedFromScreenSize}
      />
    </>
  );
};
