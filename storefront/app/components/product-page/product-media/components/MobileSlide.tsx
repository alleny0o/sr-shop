import React, { useMemo } from 'react';
import { GalleryMediaRenderer } from './media/GalleryMediaRenderer';
import { MediaNode } from '../types/media';

interface MobileSlideProps {
  node: MediaNode;
  index: number;
  productTitle: string;
  totalMedia: number;
  hasError: boolean;
  onError: (nodeId: string) => void;
  onLoad: (nodeId: string) => void;
}

export const MobileSlide = React.memo<MobileSlideProps>(({
  node,
  index,
  productTitle,
  totalMedia,
  hasError,
  onError,
  onLoad,
}) => {
  const containerStyle = useMemo(() => ({
    aspectRatio: '1',
    minHeight: '0',
  }), []);

  return (
    <div className="flex-shrink-0 w-full snap-start relative">
      <div
        className="aspect-square"
        style={containerStyle}
      >
        <GalleryMediaRenderer
          node={node}
          index={index}
          productTitle={productTitle}
          totalMedia={totalMedia}
          hasError={hasError}
          onError={onError}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
});

MobileSlide.displayName = 'MobileSlide';