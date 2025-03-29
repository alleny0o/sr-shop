import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createProductFormFieldsStep, { CreateProductFormFieldsStepInput } from "./steps/create-product-form-fields";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

type CreateProductFormFieldsWorkflowInput = CreateProductFormFieldsStepInput;

const createProductFormFieldsWorkflow = createWorkflow(
    'create-product-form-fields-workflow',
    (input: CreateProductFormFieldsWorkflowInput) => {
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

        const result = createProductFormFieldsStep(input);

        // @ts-ignore
        return new WorkflowResponse(result);
    }
);

export default createProductFormFieldsWorkflow;