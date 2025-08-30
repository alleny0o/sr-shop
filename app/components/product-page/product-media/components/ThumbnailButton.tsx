import React, { useMemo } from 'react';
import { ThumbnailRenderer } from './media/ThumbnailRenderer';
import { MediaNode } from '../types/media';

interface ThumbnailButtonProps {
  node: MediaNode;
  index: number;
  isSelected: boolean;
  productTitle: string;
  totalMedia: number;
  hasError: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onMediaError: (nodeId: string) => void;
}

export const ThumbnailButton = React.memo<ThumbnailButtonProps>(({
  node,
  index,
  isSelected,
  productTitle,
  totalMedia,
  hasError,
  onClick,
  onKeyDown,
  onMediaError,
}) => {
  // Memoized button style
  const buttonStyle = useMemo(() => ({
    borderRadius: '0',
    aspectRatio: '1',
  }), []);

  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`w-full aspect-square flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-200 relative ${
        isSelected ? 'ring-1 ring-black' : 'hover:ring-1 hover:ring-gray-300'
      }`}
      style={buttonStyle}
      role="tab"
      aria-selected={isSelected}
      aria-controls={`media-${node.id}`}
    >
      <ThumbnailRenderer
        node={node}
        index={index}
        productTitle={productTitle}
        totalMedia={totalMedia}
        hasError={hasError}
        onError={onMediaError}
      />
    </button>
  );
});

ThumbnailButton.displayName = 'ThumbnailButton';