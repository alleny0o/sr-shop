// react imports
import React, { useMemo, useCallback } from 'react';

// component imports
import { MobileCarousel } from './components/MobileCarousel';
import { DesktopCarousel } from './components/DesktopCarousel';
import { ProductMediaModal } from './components/modal/ProductMediaModal';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';

// hooks imports
import { useMediaErrors } from './hooks/useMediaErrors';
import { useModal } from './hooks/useModal';

// utils
import { getMediaNodes } from './utils/mediaUtils';

// storefrontapi.generated imports
import type { ProductQuery } from 'storefrontapi.generated';
import type { ProductVariant } from '@shopify/hydrogen/storefront-api-types';

// types
export interface ProductMediaProps {
  media?: NonNullable<ProductQuery['product']>['media'];
  selectedVariant?: ProductVariant;
  isLoading?: boolean;
  error?: string | null;
  productTitle?: string;
}

export const ProductMedia: React.FC<ProductMediaProps> = ({
  media,
  selectedVariant,
  isLoading = false,
  error = null,
  productTitle = '',
}) => {
  // Get media to display - memoized with stable reference
  const mediaToShow = useMemo(() => 
    getMediaNodes(selectedVariant, media),
    [selectedVariant?.id, selectedVariant?.metafields, media?.edges]
  );

  // Create a unique key for carousel remounting when media changes
  const carouselKey = useMemo(() => {
    const variantId = selectedVariant?.id || 'default';
    const mediaIds = mediaToShow.map(({ node }) => node.id).join('-');
    return `carousel-${variantId}-${mediaIds}`;
  }, [selectedVariant?.id, mediaToShow]);

  // Error handling hook
  const { mediaLoadErrors, handleMediaError, handleMediaLoad } = useMediaErrors(mediaToShow.length);
  
  // Modal hook
  const modalHook = useModal({ mediaCount: mediaToShow.length });
  
  // Stable callbacks for modal open
  const handleOpenMobile = useCallback((index: number) => {
    modalHook.handleOpen(index, 'mobile');
  }, [modalHook.handleOpen]);
  
  const handleOpenDesktop = useCallback((index: number) => {
    modalHook.handleOpen(index, 'desktop');
  }, [modalHook.handleOpen]);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Empty state
  if (mediaToShow.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Use key to force remount when media changes */}
      <div key={carouselKey} className="flex flex-row">
        {/* 📱 MOBILE LAYOUT */}
        <MobileCarousel
          mediaToShow={mediaToShow}
          productTitle={productTitle}
          mediaLoadErrors={mediaLoadErrors}
          onMediaError={handleMediaError}
          onMediaLoad={handleMediaLoad}
          onOpenModal={handleOpenMobile}
        />

        {/* 🖥️ DESKTOP LAYOUT */}
        <DesktopCarousel
          mediaToShow={mediaToShow}
          productTitle={productTitle}
          mediaLoadErrors={mediaLoadErrors}
          onMediaError={handleMediaError}
          onMediaLoad={handleMediaLoad}
          onOpenModal={handleOpenDesktop}
        />
      </div>

      {/* Modal */}
      <ProductMediaModal
        isOpen={modalHook.isOpen}
        currentIndex={modalHook.currentIndex}
        media={mediaToShow}
        mediaLoadErrors={mediaLoadErrors}
        onMediaError={handleMediaError}
        onMediaLoad={handleMediaLoad}
        productTitle={productTitle}
        onClose={modalHook.handleClose}
        openedFromScreenSize={modalHook.openedFromScreenSize}
      />
    </>
  );
};