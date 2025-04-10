import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaGroupModuleService from "../../../../modules/media-group/service";
import { MEDIA_GROUP_MODULE } from "../../../../modules/media-group";
import { MediaItem, MediaItemType } from "../../types";

type MediaGroupInput = {
  media_group_id: string;
  medias: MediaItem[];
};
export type CreateMediaItemsStepInput = {
  media_items: MediaGroupInput[];
};

const createMediaItemsStep = createStep(
  "create-media-items-step",
  async ({ media_items }: CreateMediaItemsStepInput, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);

    const createdMediaItems: MediaItemType[] = await mediaGroupModuleService.createMediaItems(media_items);

    return new StepResponse(createdMediaItems, createdMediaItems);
  },
  async (createdMediaItems: MediaItemType[], { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);
    if (!createdMediaItems) return;

    await mediaGroupModuleService.deleteMediaItems(createdMediaItems.map((item) => item.id));
  }
);

export default createMediaItemsStep;
