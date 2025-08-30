import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ProductQuery } from 'storefrontapi.generated';
import { ModalMediaRenderer } from '../media/ModalMediaRenderer';
import { useImagePan } from '../../hooks/useImagePan';
import { CloseButton } from '~/components/buttons/CloseButton';

type ProductMediaModalProps = {
  isOpen: boolean;
  currentIndex: number;
  media: NonNullable<ProductQuery['product']>['media']['edges'];
  mediaLoadErrors: Set<string>;
  onMediaError: (nodeId: string) => void;
  onMediaLoad: (nodeId: string) => void;
  productTitle: string;
  openedFromScreenSize: 'mobile' | 'desktop';
  onClose: () => void;
};

export const ProductMediaModal: React.FC<ProductMediaModalProps> = props => {
  const { isOpen, currentIndex, media, mediaLoadErrors, onMediaError, onMediaLoad, productTitle, onClose } = props;
  const [isLoading, setIsLoading] = useState(true);

  const currentMedia = media[currentIndex];
  const isImage = currentMedia?.node.__typename === 'MediaImage';
  
  // Create ref for the image element
  const imageRef = useRef<HTMLImageElement>(null);

  // Pan functionality for images only - now with dynamic boundaries
  const imagePan = useImagePan({ 
    enabled: isImage,
    imageRef: imageRef
  });

  // Reset pan and loading state when modal opens or media changes
  useEffect(() => {
    if (isOpen) {
      imagePan.reset();
      setIsLoading(true);
    }
  }, [isOpen, currentIndex]);

  // Handle media load completion
  const handleMediaLoad = (nodeId: string) => {
    setIsLoading(false);
    onMediaLoad(nodeId);
  };

  // Handle media error
  const handleMediaError = (nodeId: string) => {
    setIsLoading(false);
    onMediaError(nodeId);
  };

  if (!isOpen || !currentMedia) return null;

  // Portal the modal to document.body to escape sticky container
  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-pastel-yellow-light flex items-center justify-center">
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-[999]">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      <div className="absolute top-4 left-6 right-6 z-[1001] flex items-center justify-between">
        <div className="px-4 py-1.5 flex items-center justify-center bg-pastel-yellow-light border border-gray-300 shadow-sm rounded-none">
          <span className="text-xs sm:text-sm md:text-base font-light text-black">
            {currentIndex + 1} / {media.length}
          </span>
        </div>

        <CloseButton onClose={onClose} />
      </div>

      {/* Image content with pan */}
      {isImage && (
        <div 
          className={`fixed top-0 w-full h-full overflow-hidden touch-none z-[500] transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div 
            className="absolute top-0 w-full h-full"
            style={{
              transform: imagePan.transform,
              cursor: imagePan.cursor
            }}
            {...imagePan.handlers}
          >
            <ModalMediaRenderer
              node={currentMedia.node}
              index={currentIndex}
              productTitle={productTitle}
              totalMedia={media.length}
              hasError={mediaLoadErrors.has(currentMedia.node.id)}
              onError={handleMediaError}
              onLoad={handleMediaLoad}
              imageRef={imageRef} // Pass the ref
            />
          </div>
        </div>
      )}

      {/* Video content (no pan) */}
      {currentMedia.node.__typename === 'Video' && (
        <div 
          className={`w-full h-full flex items-center justify-center transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <ModalMediaRenderer
            node={currentMedia.node}
            index={currentIndex}
            productTitle={productTitle}
            totalMedia={media.length}
            hasError={mediaLoadErrors.has(currentMedia.node.id)}
            onError={handleMediaError}
            onLoad={handleMediaLoad}
          />
        </div>
      )}
    </div>,
    document.body // This is the magic! Portal it to body instead of staying in the component tree
  );
};