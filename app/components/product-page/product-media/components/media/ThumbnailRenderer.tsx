import React from 'react';
import { MediaNode } from '../../types/media';
import { getAltText, getResponsiveMediaUrl } from '../../utils/mediaUtils';

interface ThumbnailRendererProps {
  node: MediaNode;
  index: number;
  productTitle: string;
  totalMedia: number;
  hasError: boolean;
  onError: (nodeId: string) => void;
  onLoad?: () => void;                     // <-- add
}

export const ThumbnailRenderer: React.FC<ThumbnailRendererProps> = ({
  node,
  index,
  productTitle,
  hasError,
  onError,
  onLoad,
}) => {
  if (node.__typename === 'MediaImage' && node.image?.url) {
    const alt = getAltText(node, index, productTitle, 1);
    const src = getResponsiveMediaUrl(node.image.url, 200, 200);
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={onLoad}
        onError={() => onError(node.id)} 
        className="w-full h-full object-cover !rounded-none"
      />
    );
  }

  // Fallbacks for video/thumb previews if you have them, also ensure events:
  if (node.__typename === 'Video' && node.previewImage?.url) {
    return (
      <img
        src={getResponsiveMediaUrl(node.previewImage.url, 200, 200)}
        alt={getAltText(node, index, productTitle, 1)}
        loading="lazy"
        onLoad={onLoad}
        onError={() => onError(node.id)}
        className="w-full h-full object-cover !rounded-none"
      />
    );
  }

  // Generic fallback
  return (
    <div className="w-full h-full bg-gray-100" role="img" aria-label="Media thumbnail unavailable" />
  );
};
