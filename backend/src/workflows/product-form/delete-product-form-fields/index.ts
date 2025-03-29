import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import deleteProductFormFieldsStep, { DeleteProductFormFieldsStepInput } from "./steps/delete-product-form-fields";

type DeleteProductFormFieldsWorkflowInput = DeleteProductFormFieldsStepInput;

const deleteProductFormFieldsWorkflow = createWorkflow(
    'delete-product-form-fields-workflow',
    (input: DeleteProductFormFieldsWorkflowInput) => {
        const result = deleteProductFormFieldsStep(input);

        return new WorkflowResponse(result);
    },
);

export default deleteProductFormFieldsWorkflow;