import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaTagModuleService from "../../../../modules/media-tag/service";
import { MEDIA_TAG_MODULE } from "../../../../modules/media-tag";

export type UpdateMediaTagStepInput = {
  id: string;
  value?: number;
};

const updateMediaTagStep = createStep(
  "update-media-tag-step",
  async ({ id, value }: UpdateMediaTagStepInput, { container }) => {
    if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
      throw new Error("`value` must be a natural number (integer ≥ 1) if provided.");
    }

    const mediaTagModuleService: MediaTagModuleService = container.resolve(MEDIA_TAG_MODULE);

    const ogMediaTags = await mediaTagModuleService.listMediaTags({
        id: id,
    });

    if (!ogMediaTags || ogMediaTags.length === 0) {
      throw new Error(`Media tag with id ${id} not found.`);
    };

    const ogMediaTag = ogMediaTags[0];

    const mediaTag = await mediaTagModuleService.updateMediaTags({
      id,
      value: value ?? null,
    });

    return new StepResponse(mediaTag, ogMediaTag);
  },
  async (mediaTag, { container }) => {
    const mediaTagModuleService: MediaTagModuleService = container.resolve(MEDIA_TAG_MODULE);

    if (!mediaTag) return;

    // If the update fails, we can attempt to restore the previous state
    await mediaTagModuleService.updateMediaTags({
      id: mediaTag.id,
      value: mediaTag.value ?? null,
    });
  }
);

export default updateMediaTagStep;