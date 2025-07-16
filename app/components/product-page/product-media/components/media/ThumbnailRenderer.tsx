import React from 'react';
import { Play, ImageOff } from 'lucide-react';
import { MediaNode } from '../../types/media';
import { getResponsiveMediaUrl, generateSrcSet, getAltText } from '../../utils/mediaUtils';

interface ThumbnailRendererProps {
  node: MediaNode;
  index: number;
  productTitle: string;
  totalMedia: number;
  hasError: boolean;
  onError: (nodeId: string) => void;
}

export const ThumbnailRenderer: React.FC<ThumbnailRendererProps> = ({
  node,
  index,
  productTitle,
  totalMedia,
  hasError,
  onError,
}) => {
  const altText = getAltText(node, index, productTitle, totalMedia);

  if (node.__typename === 'MediaImage' && node.image && !hasError) {
    const srcSet = generateSrcSet(node.image.url, [100, 200, 300, 400]);
    const optimizedSrc = getResponsiveMediaUrl(node.image.url, 200, 200);

    return (
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes="64px"
        alt={altText}
        width={64}
        height={64}
        className="w-full h-full object-cover !rounded-none"
        loading="lazy"
        onError={() => onError(node.id)}
      />
    );
  }

  if (node.__typename === 'Video') {
    return node.previewImage?.url && !hasError ? (
      <div className="relative w-full h-full">
        <img
          src={node.previewImage.url}
          alt={altText}
          className="w-full h-full object-cover !rounded-none"
          loading="lazy"
          onError={() => onError(node.id)}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-5 h-5 text-white drop-shadow-sm" fill="currentColor" aria-hidden="true" />
        </div>
      </div>
    ) : (
      <div className="w-full h-full bg-black/5 flex items-center justify-center !rounded-none">
        <Play className="w-4 h-4 text-gray-600" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <ImageOff className="w-4 h-4 text-gray-400" aria-hidden="true" />
    </div>
  );
};
