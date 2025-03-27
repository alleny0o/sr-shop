import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import VariantMediaModuleService from "../../../../modules/variant-media/service";
import { VARIANT_MEDIA_MODULE } from "../../../../modules/variant-media";
import { VariantMediaType } from "../../types";

type DeleteVariantMediasInput = {
    variant_media_ids: string[];
};

const deleteVariantMediasStep = createStep(
    'delete-variant-medias-step',
    async ({ variant_media_ids }: DeleteVariantMediasInput, { container }) => {
        const variantMediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);

        const mediaToDelete = await variantMediaModuleService.listVariantMedias({
            id: variant_media_ids
        });

        await variantMediaModuleService.deleteVariantMedias(variant_media_ids);

        return new StepResponse({
            deleted_variant_medias: mediaToDelete,
        }, {
            deleted_variant_medias: mediaToDelete,
        });
    },
    async ({ deleted_variant_medias }: { deleted_variant_medias: VariantMediaType[] }, { container }) => {
        const variantMediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);
        await variantMediaModuleService.createVariantMedias(deleted_variant_medias);
    },
);

export default deleteVariantMediasStep;