import React from 'react';
import { ImageOff } from 'lucide-react';
import { MediaNode } from '../../types/media';
import { getResponsiveMediaUrl, generateSrcSet, getAltText } from '../../utils/mediaUtils';

const MODAL_SRCSET_WIDTHS = [400, 600, 800, 1000, 1200, 1400, 1600, 2160];
const MODAL_DEFAULT_SIZE = 1600;

interface ModalMediaRendererProps {
  node: MediaNode;
  index: number;
  productTitle: string;
  totalMedia: number;
  hasError: boolean;
  onError: (nodeId: string) => void;
  onLoad: (nodeId: string) => void;
  imageRef?: React.RefObject<HTMLImageElement>;
}

// Modal-specific error fallback
const ModalErrorFallback: React.FC<{ altText: string }> = ({ altText }) => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="text-center">
      <ImageOff className="w-8 h-8 text-gray-400 mx-auto mb-2" aria-hidden="true" />
      <p className="text-gray-500">Failed to load media</p>
      <p className="text-sm text-gray-400">{altText}</p>
    </div>
  </div>
);

export const ModalMediaRenderer: React.FC<ModalMediaRendererProps> = ({
  node,
  index,
  productTitle,
  totalMedia,
  hasError,
  onError,
  onLoad,
  imageRef,
}) => {
  const altText = getAltText(node, index, productTitle, totalMedia);

  // Handle error state first
  if (hasError) {
    return <ModalErrorFallback altText={altText} />;
  }

  // Handle image rendering - FIXED VERSION
  if (node.__typename === 'MediaImage' && node.image) {
    const srcSet = generateSrcSet(node.image.url, MODAL_SRCSET_WIDTHS);
    const optimizedSrc = getResponsiveMediaUrl(node.image.url, MODAL_DEFAULT_SIZE, MODAL_DEFAULT_SIZE);

    return (
      <div className="flex items-center justify-center h-full w-full">
        <img
          ref={imageRef}
          src={optimizedSrc}
          srcSet={srcSet}
          sizes="100vw"
          alt={altText}
          className="block"
          style={{
            // Force image to always be larger than viewport in BOTH directions
            minWidth: 'max(100vw, 100vh)',
            minHeight: 'max(100vw, 100vh)',
            width: 'auto',
            height: 'auto',
            maxWidth: 'none',
            maxHeight: 'none',
            objectFit: 'cover'
          }}
          loading="lazy"
          decoding="async"
          onError={() => onError(node.id)}
          onLoad={() => onLoad(node.id)}
          draggable={false}
        />
      </div>
    );
  }

  // Handle video rendering - keep your exact working structure
  if (node.__typename === 'Video') {
    const validSources = node.sources?.filter(source => source.url && source.mimeType) || [];

    if (validSources.length === 0) {
      return node.previewImage?.url ? (
        <div className="flex items-center justify-center h-full w-full">
          <img
            src={node.previewImage.url}
            alt={altText}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
            draggable={false}
            onError={() => onError(node.id)}
            onLoad={() => onLoad(node.id)}
          />
        </div>
      ) : (
        <ModalErrorFallback altText={altText} />
      );
    }

    return (
      <div className="flex items-center justify-center h-full w-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          controls={true}
          preload="metadata"
          poster={node.previewImage?.url}
          className="object-contain w-full h-full"
          onError={() => onError(node.id)}
          onLoadedData={() => onLoad(node.id)}
          aria-label={altText}
        >
          {validSources.map((source, sourceIndex) => (
            <source key={sourceIndex} src={source.url} type={source.mimeType} />
          ))}
        </video>
      </div>
    );
  }

  // Fallback for unknown media types
  return <ModalErrorFallback altText={altText} />;
};