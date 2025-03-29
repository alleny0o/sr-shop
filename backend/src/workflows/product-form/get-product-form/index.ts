import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import getProductFormStep, { GetProductFormStepInput } from "./steps/get-product-form";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

type GetProductFormWorkflowInput = GetProductFormStepInput;

const getProductFormWorkflow = createWorkflow(
    'get-product-form-workflow',
    (input: GetProductFormWorkflowInput) => {
        // check product exists
        // @ts-ignore
        useQueryGraphStep({
            entity: "product",
            fields: ["id"],
            filters: {
                id: input.product_id,
            },
            options: {
                throwIfKeyNotFound: true, 
            },
        });

        const result = getProductFormStep(input);

        // @ts-ignore
        return new WorkflowResponse(result);
    }
);

export default getProductFormWorkflow;