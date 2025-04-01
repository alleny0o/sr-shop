import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaTagModuleService from "../../../../modules/media-tag/service";
import { MEDIA_TAG_MODULE } from "../../../../modules/media-tag";
import { MedusaError } from "@medusajs/framework/utils";

export type CreateMediaTagStepInput = {
  variant_id: string;
  value?: number;
};

const createMediaTagStep = createStep(
  "create-media-tag-step",
  async ({ variant_id, value }: CreateMediaTagStepInput, { container }) => {
    if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "`value` must be a natural number (integer ≥ 1) if provided.");
    }

    const mediaTagModuleService: MediaTagModuleService = container.resolve(MEDIA_TAG_MODULE);

    const mediaTag = await mediaTagModuleService.createMediaTags({
      variant_id,
      value: value ?? null,
    });

    return new StepResponse(mediaTag, mediaTag);
  },
  async (mediaTag, { container }) => {
    const mediaTagModuleService: MediaTagModuleService = container.resolve(MEDIA_TAG_MODULE);

    if (!mediaTag) return;

    await mediaTagModuleService.deleteMediaTags(mediaTag.id);
  }
);

export default createMediaTagStep;