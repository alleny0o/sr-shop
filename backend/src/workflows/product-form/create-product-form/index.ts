import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createProductFormStep, { CreateProductFormStepInput } from "./steps/create-product-form";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

type CreateProductFormWorkflowInput = CreateProductFormStepInput;

const createProductFormWorkflow = createWorkflow(
    'create-product-form-workflow',
    (input: CreateProductFormWorkflowInput) => {
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

        const productForm = createProductFormStep(input);

        // @ts-ignore
        return new WorkflowResponse(productForm);
    }   
);

export default createProductFormWorkflow;