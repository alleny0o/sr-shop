import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaTagModuleService from "../../../../modules/media-tag/service";
import { MEDIA_TAG_MODULE } from "../../../../modules/media-tag";

export type DeleteMediaTagsStepInput = {
    ids: string[];
};

const deleteMediaTagsStep = createStep(
    "delete-media-tags-step",
    async ({ ids }: DeleteMediaTagsStepInput, { container }) => {
        if (!ids || ids.length === 0) {
            throw new Error("No media tag IDs provided for deletion.");
        }

        const mediaTagModuleService: MediaTagModuleService = container.resolve(MEDIA_TAG_MODULE);

        const mediaTags = await mediaTagModuleService.listMediaTags({
            id: ids,
        });

        await mediaTagModuleService.deleteMediaTags(ids);

        return new StepResponse(mediaTags, mediaTags); // No return value needed for deletion
    },
    async (mediaTags, { container }) => {
        const mediaTagModuleService: MediaTagModuleService = container.resolve(MEDIA_TAG_MODULE);

        if (!mediaTags || mediaTags.length === 0) return;

        // If the deletion fails, we can attempt to restore the deleted media tags
        for (const mediaTag of mediaTags) {
            await mediaTagModuleService.createMediaTags({
                variant_id: mediaTag.variant_id,
                value: mediaTag.value ?? null,
            });
        }
    },
);

export default deleteMediaTagsStep;