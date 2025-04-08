// Widget Configuration
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// Widget Props
import { DetailWidgetProps, AdminProductVariant } from "@medusajs/framework/types";

// React & State Management
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// JS SDK
import { sdk } from "../../../lib/config";

// Local Types
import { MediaTag } from "./types";

// Custom Components
import { SectionWrapper } from "../../../components/section-wrapper";
import { SectionLoader } from "../../../components/section-loader";
import { SectionText } from "../../../components/section-text";
import { MediaTagDrawer } from "./drawers/media-tag-drawer";

const MediaTagWidget = ({ data }: DetailWidgetProps<AdminProductVariant>) => {
  // Media Tag State
  const [mediaTag, setMediaTag] = useState<MediaTag | null>(null);

  const [open, setOpen] = useState(false);

  // Fetch Media Tag
  const {
    data: mediaTagData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["media-tag", data.id],
    queryFn: () => {
      return sdk.client.fetch<{ media_tag: MediaTag }>(`/admin/variant-media_tag/variant/${data.id}`);
    },
    refetchOnMount: "always",
  });

  // Update Media Tag State Once Data is Fetched
  useEffect(() => {
    if (mediaTagData?.media_tag) {
      setMediaTag(mediaTagData.media_tag);
    }
  }, [mediaTagData]);

  // Loading Page State
  if (isLoading) {
    return (
      <SectionWrapper heading="Media Tag">
        <SectionLoader height={50} />
      </SectionWrapper>
    );
  }

  // Error Page State
  if (error || !data.product_id || !mediaTagData) {
    console.error(error);
    console.error(error?.message);
    return (
      <SectionWrapper heading="Media Tag">
        <SectionText message="ERROR: Failed to load media tag." height={50} />
      </SectionWrapper>
    );
  }

  return (
    <>
      {mediaTag ? (
        <SectionWrapper heading="Media Tag" component={<MediaTagDrawer id={mediaTag.id} variant_id={data.id} value={mediaTag.value} open={open} setOpen={setOpen} />}>
          <div className="px-6 py-3">
            <span className="text-sm text-gray-500">Value:</span>
            <p className="mt-1 text-base text-gray-900 font-medium">{mediaTag?.value ?? "N/A"}</p>
          </div>
        </SectionWrapper>
      ) : (
        <SectionWrapper heading="Media Tag">
          <SectionText message="No media tag available." height={50} />
        </SectionWrapper>
      )}
    </>
  );
};

export const config = defineWidgetConfig({
  zone: "product_variant.details.side.before",
});

export default MediaTagWidget;
