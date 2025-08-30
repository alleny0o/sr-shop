import React from 'react';
import { MediaNode } from '../../types/media';
import { getAltText, generateSrcSet, getResponsiveMediaUrl } from '../../utils/mediaUtils';

interface GalleryMediaRendererProps {
  node: MediaNode;
  index: number;
  productTitle: string;
  totalMedia: number;
  hasError: boolean;
  onError: (nodeId: string) => void;
  onLoad: (nodeId: string) => void;
}

const SRCSET_WIDTHS = [400, 600, 800, 1000, 1200, 1400, 1600];

export const GalleryMediaRenderer: React.FC<GalleryMediaRendererProps> = ({
  node,
  index,
  productTitle,
  totalMedia,
  hasError,
  onError,
  onLoad,
}) => {
  if (node.__typename === 'MediaImage' && node.image?.url) {
    const alt = getAltText(node, index, productTitle, totalMedia);
    const src = getResponsiveMediaUrl(node.image.url, 1200, 1200);
    const srcSet = generateSrcSet(node.image.url, SRCSET_WIDTHS);

    return (
      <img
        id={`media-${node.id}`}
        src={src}
        srcSet={srcSet}
        sizes="(max-width: 1024px) 100vw, 60vw"
        alt={alt}
        decoding="async"
        loading="lazy"
        onLoad={() => onLoad(node.id)}    
        onError={() => onError(node.id)}  
        className="w-full h-full object-cover !rounded-none"
      />
    );
  }

  if (node.__typename === 'Video' && node.sources?.length) {
    return (
      <video
        id={`media-${node.id}`}
        controls={false}
        playsInline
        preload="metadata"
        onLoadedData={() => onLoad(node.id)} 
        onError={() => onError(node.id)}
        className="w-full h-full object-cover !rounded-none"
      >
        {node.sources.map((s) => (
          <source key={s.url} src={s.url} type={s.mimeType} />
        ))}
      </video>
    );
  }

  // Fallback
  return (
    <div className="w-full h-full bg-gray-100" role="img" aria-label="Media unavailable" />
  );
};
