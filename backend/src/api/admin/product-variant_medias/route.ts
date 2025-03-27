import { z } from 'zod';
import createVariantMediasWorkflow from '../../../workflows/variant-media/create-variant-medias';
import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { createVariantMediasSchema } from '../../validation-schemas';
import { CreateVariantMediaInput } from '../../../workflows/variant-media/create-variant-medias/steps/create-variant-medias';

type CreateRequestBody = z.infer<typeof createVariantMediasSchema>;

// Create New Variant Medias
export const POST = async (
    req: AuthenticatedMedusaRequest<CreateRequestBody>,
    res: MedusaResponse,
) => {
    const { result } = await createVariantMediasWorkflow(req.scope).run({
        input: {
            variant_medias: req.validatedBody.variant_medias.map((vm) => ({
                file_id: vm.file_id,
                product_id: vm.product_id,
                variant_id: vm.variant_id,
                size: vm.size,
                name: vm.name,
                mime_type: vm.mime_type,
                is_thumbnail: vm.is_thumbnail,
                url: vm.url,
            })) as CreateVariantMediaInput[],
        }
    });

    res.status(200).json({ variant_medias: result.variant_medias });
};