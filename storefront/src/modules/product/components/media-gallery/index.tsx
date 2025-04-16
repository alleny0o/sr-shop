"use client";

import React, { useState, useEffect, useMemo } from "react";
import ImageSliderMobile from "./image-slider-mobile";
import ImageViewerDesktop from "./image-viewer-desktop";
import EmptyGallery from "./empty-gallery";
import { useProductOptionsStore } from "providers/product-options";
import { getProductDisplayMedia } from "@lib/util/product-medias";
import { EnrichedProduct } from "types/global";

type MediaGalleryProps = {
  product: EnrichedProduct;
};

const MediaGallery = ({ product }: MediaGalleryProps) => {
  const { options: selectedOptions } = useProductOptionsStore();
  const { mediaTag, medias } = useMemo(() => {
    return getProductDisplayMedia(product, selectedOptions);
  }, [product, selectedOptions]);
  

  // Adjust the state type to include numbers along with string or null.
  const [prevMediaTag, setPrevMediaTag] = useState<number | null>(null);
  const [currentMedias, setCurrentMedias] = useState(medias);

  useEffect(() => {
    // Always update if the previous media tag is null.
    if (prevMediaTag === null) {
      setPrevMediaTag(mediaTag);
      setCurrentMedias(medias);
      return;
    }

    // Determine if both media tags are numeric
    const isCurrentNumber =
      typeof mediaTag === "number" || (!isNaN(Number(mediaTag)) && mediaTag !== null);
    const isPrevNumber =
      typeof prevMediaTag === "number" || (!isNaN(Number(prevMediaTag)) && prevMediaTag !== null);

    // If both tags are numbers and, when converted, are equal, do not update.
    if (isCurrentNumber && isPrevNumber && Number(mediaTag) === Number(prevMediaTag)) {
      return;
    }

    // For any other case where the media tag has changed, update state.
    if (mediaTag !== prevMediaTag) {
      setPrevMediaTag(mediaTag);
      setCurrentMedias(medias);
    }
  }, [mediaTag, medias, prevMediaTag]);

  if (!currentMedias.length) {
    return <EmptyGallery />;
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <ImageSliderMobile medias={currentMedias} />
      <ImageViewerDesktop medias={currentMedias} />
    </div>
  );
};

export default MediaGallery;
