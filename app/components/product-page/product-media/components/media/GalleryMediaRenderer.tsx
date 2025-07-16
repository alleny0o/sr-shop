import React from 'react';
import { ImageOff } from 'lucide-react';
import { MediaNode } from '../../types/media';
import { getResponsiveMediaUrl, generateSrcSet, getAltText } from '../../utils/mediaUtils';

// Constants for gallery context
const SRCSET_WIDTHS = [200, 400, 600, 800, 1000, 1200, 1400, 1600];
const DEFAULT_IMAGE_SIZE = 800;

interface GalleryMediaRendererProps {
  node: MediaNode;
  index: number;
  productTitle: string;
  totalMedia: number;
  hasError: boolean;
  onError: (nodeId: string) => void;
  onLoad: (nodeId: string) => void;
  showVideoControls?: boolean;
}

// Gallery-specific error fallback
const GalleryErrorFallback = () => (
  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
    <ImageOff className="w-8 h-8 text-gray-400" aria-hidden="true" />
    <span className="sr-only">Media unavailable</span>
  </div>
);

export const GalleryMediaRenderer: React.FC<GalleryMediaRendererProps> = ({
  node,
  index,
  productTitle,
  totalMedia,
  hasError,
  onError,
  onLoad,
  showVideoControls = true,
}) => {
  const altText = getAltText(node, index, productTitle, totalMedia);

  // Handle error state first
  if (hasError) {
    return <GalleryErrorFallback />;
  }

  // Handle image rendering
  if (node.__typename === 'MediaImage' && node.image) {
    const srcSet = generateSrcSet(node.image.url, SRCSET_WIDTHS);
    const optimizedSrc = getResponsiveMediaUrl(node.image.url, DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE);

    return (
      <div className="w-full h-full relative overflow-hidden">
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes="(max-width: 1024px) 100vw, 50vw"
          alt={altText}
          className="w-full h-full object-cover select-none"
          style={{
            borderRadius: '0',
            // Safari-specific fixes
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            // Ensure proper aspect ratio on mobile
            objectFit: 'cover',
            objectPosition: 'center',
          } as React.CSSProperties}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding={index === 0 ? 'sync' : 'async'}
          {...(index === 0 ? { fetchpriority: 'high' } : { fetchpriority: 'auto' })}
          onError={() => onError(node.id)}
          onLoad={() => onLoad(node.id)}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    );
  }

  // Handle video rendering
  if (node.__typename === 'Video') {
    const validSources = node.sources?.filter(source => source.url && source.mimeType) || [];

    if (validSources.length === 0) {
      return node.previewImage?.url ? (
        <div className="w-full h-full relative overflow-hidden">
          <img
            src={node.previewImage.url}
            alt={altText}
            className="w-full h-full object-cover select-none"
            style={{
              borderRadius: '0',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              objectFit: 'cover',
              objectPosition: 'center',
            } as React.CSSProperties}
            loading="lazy"
            onError={() => onError(node.id)}
            onLoad={() => onLoad(node.id)}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      ) : (
        <GalleryErrorFallback />
      );
    }

    return (
      <div className="w-full h-full relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={node.previewImage?.url}
          controls={showVideoControls}
          className="w-full h-full object-cover select-none"
          style={{
            borderRadius: '0',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            objectFit: 'cover',
            objectPosition: 'center',
          } as React.CSSProperties}
          onError={() => onError(node.id)}
          onLoadedData={() => onLoad(node.id)}
          aria-label={altText}
          onContextMenu={(e) => e.preventDefault()}
        >
          {validSources.map((source, sourceIndex) => (
            <source key={sourceIndex} src={source.url} type={source.mimeType} />
          ))}
        </video>
      </div>
    );
  }

  // Fallback for unknown media types
  return <GalleryErrorFallback />;
};