import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaGroupModuleService from "../../../../modules/media-group/service";
import { MEDIA_GROUP_MODULE } from "../../../../modules/media-group";

export type UpdateMediaGroupStepInput = {
  id: string;
  media_tag?: string;
};

const updateMediaGroupStep = createStep(
  "update-media-group-step",
  async (input: UpdateMediaGroupStepInput, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);

    const mediaGroup = await mediaGroupModuleService.retrieveMediaGroup(input.id);

    const updatedMediaGroup = await mediaGroupModuleService.updateMediaGroups({
      id: input.id,
      media_tag: input.media_tag,
    });

    return new StepResponse(updatedMediaGroup, mediaGroup);
  },
  async (mediaGroup, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);

    if (!mediaGroup) return;

    await mediaGroupModuleService.updateMediaGroups({
      id: mediaGroup.id,
      media_tag: mediaGroup.media_tag,
    });
  }
);

export default updateMediaGroupStep;