// Widget Configuration
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// Widget Props
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";

// React & State Management
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// JS SDK
import { sdk } from "../../../lib/config";

// uuid
import { v4 as uuidv4 } from 'uuid';

// Local Types
import { MediaGroup, MediaItem, MediaGroupType } from "./types";

// Custom Components
import { SectionWrapper } from "../../../components/section-wrapper";
import { SectionLoader } from "../../../components/section-loader";
import { SectionText } from "../../../components/section-text";
import { MediaGroupModal } from "./modals/media-group-modal";

const MediaGroupsWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  // Media Groups State
  const [mediaGroups, setMediaGroups] = useState<MediaGroup[]>([]);

  // Fetch Media Groups
  const {
    data: mediaGroupsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["media-groups", data.id],
    queryFn: () => {
      return sdk.client.fetch<{ media_groups: MediaGroupType[] }>(`/admin/product-media_groups/product/${data.id}`);
    },
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (mediaGroupsData?.media_groups) {
      const data: MediaGroup[] = mediaGroupsData.media_groups.map((group) => ({
        id: group.id,
        uuid: group.uuid,
        product_id: group.product_id,
        media_tag: group.media_tag ?? undefined,
        medias: group.medias.map((media) => ({
          id: media.id,
          file_id: media.file_id,
          size: media.size,
          name: media.name,
          mime_type: media.mime_type,
          is_thumbnail: media.is_thumbnail,
        })) as MediaItem[],
      }));
      setMediaGroups(data);
    }
  }, [mediaGroupsData]);

  if (isLoading) {
    return (
      <SectionWrapper heading="Media Groups">
        <SectionLoader height={100} />
      </SectionWrapper>
    );
  }

  if (error || !data.id || !mediaGroupsData) {
    console.error(error);
    console.error(error?.message);

    return (
      <SectionWrapper heading="Media Groups">
        <SectionText message="ERROR: Failed to load variant medias." height={100} />
      </SectionWrapper>
    );
  }

  // since we are creating a new Media Group, we need default value.
  const newMediaGroup: MediaGroup = {
    uuid: uuidv4(),
    product_id: data.id,
    media_tag: undefined,
    medias: [],
  }

  return (
    <>
      <SectionWrapper heading="Media Groups" component={<MediaGroupModal mediaGroup={newMediaGroup} mediaGroups={mediaGroups} type="create" />}>
        {mediaGroups.length > 0 ? (
          <div>Lmao</div>
        ) : (
          <SectionText message="No media groups created yet. Click create to add you first :)" height={100} />
        )}
      </SectionWrapper>
    </>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default MediaGroupsWidget;
