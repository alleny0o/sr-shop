import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaGroupModuleService from "../../../../modules/media-group/service";
import { MEDIA_GROUP_MODULE } from "../../../../modules/media-group";
import { MediaItemType } from "../../types";

export type DeleteMediaItemsStepInput = {
  media_item_ids: string[];
};

const deleteMediaItemsStep = createStep(
  "delete-media-items-step",
  async ({ media_item_ids }: DeleteMediaItemsStepInput, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);

    const mediaItemsToDelete = await mediaGroupModuleService.listMediaItems({
      id: media_item_ids,
    });

    await mediaGroupModuleService.deleteMediaItems(media_item_ids);

    return new StepResponse(mediaItemsToDelete, mediaItemsToDelete);
  },
  async (mediaItemsToDelete: MediaItemType[], { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);
    if (!mediaItemsToDelete) return;

    await mediaGroupModuleService.createMediaItems(
      mediaItemsToDelete.map((item) => ({
        file_id: item.file_id,
        size: item.size,
        name: item.name,
        mime_type: item.mime_type,
        is_thumbnail: item.is_thumbnail,
        url: item.url,
        media_group_id: item.media_group_id,
      }))
    );
  }
);

export default deleteMediaItemsStep;