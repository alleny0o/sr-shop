import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import VariantMediaModuleService from "../../../../modules/variant-media/service";
import { VARIANT_MEDIA_MODULE } from "../../../../modules/variant-media";
import { VariantMediaType } from "../../types";

export type CreateVariantMediaInput = {
    file_id: string;
    product_id: string;
    variant_id: string;
    size: number;
    name: string;
    mime_type: string;
    is_thumbnail: boolean;
    url: string;
};

export type CreateVariantMediasStepInput = {    
    variant_medias: CreateVariantMediaInput[];
};

const createVariantMediasStep = createStep(
    'create-variant-medias-step',
    async ({ variant_medias }: CreateVariantMediasStepInput, { container }) => {
        const variantMediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);
        const createdMedias: VariantMediaType[] = await variantMediaModuleService.createVariantMedias(variant_medias);

        return new StepResponse({
            variant_medias: createdMedias,
        }, {
            variant_medias: createdMedias,
        });
    },
    async ({ variant_medias }: { variant_medias: VariantMediaType[] }, { container}) => {
        const variantMediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);
        await variantMediaModuleService.deleteVariantMedias(variant_medias.map((vm) => vm.id));
    },
)

export default createVariantMediasStep;
