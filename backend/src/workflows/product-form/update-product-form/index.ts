import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateProductFormFieldsStep, { UpdateProductFormFieldsStepInput } from "../update-product-form-fields/steps/update-product-form-fields";

type UpdateProductFormFieldsWorkflowInput = UpdateProductFormFieldsStepInput;

const updateProductFormFieldsWorkflow = createWorkflow(
    'update-product-form-fields-workflow',
    (input: UpdateProductFormFieldsWorkflowInput) => {
        const result = updateProductFormFieldsStep(input);

        return new WorkflowResponse(result);
    },
);

export default updateProductFormFieldsWorkflow;