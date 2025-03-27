import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import deleteVariantMediasStep from './steps/delete-variant-medias';

type DeleteMediasWorkflowInput = {
    variant_media_ids: string[];
};

const deleteVariantMediasWorkflow = createWorkflow(
    'delete-variant-medias-workflow',
    (input: DeleteMediasWorkflowInput) => {
        const { variant_media_ids } = input;

        const { deleted_variant_medias } = deleteVariantMediasStep({ variant_media_ids });

        return new WorkflowResponse({
            deleted_variant_medias: deleted_variant_medias,
        });
    },
);

export default deleteVariantMediasWorkflow;