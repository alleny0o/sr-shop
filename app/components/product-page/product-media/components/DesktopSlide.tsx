import React from 'react';
import { GalleryMediaRenderer } from './media/GalleryMediaRenderer';
import { MediaNode } from '../types/media';

interface DesktopSlideProps {
  node: MediaNode;
  index: number;
  productTitle: string;
  totalMedia: number;
  hasError: boolean;
  onError: (nodeId: string) => void;
  onLoad: (nodeId: string) => void;
}

export const DesktopSlide = React.memo<DesktopSlideProps>(({
  node,
  index,
  productTitle,
  totalMedia,
  hasError,
  onError,
  onLoad,
}) => {
  return (
    <div className="flex-shrink-0 h-full relative" style={{ width: '100%' }}>
      <div className="h-full">
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

DesktopSlide.displayName = 'DesktopSlide';