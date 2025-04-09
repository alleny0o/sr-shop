import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import getProductFormsStep, { GetProductFormsStepInput } from "./steps/get-product-forms";

type GetProductFormsWorkflowInput = GetProductFormsStepInput;

const getProductFormsWorkflow = createWorkflow(
    'get-product-forms-workflow',
    (input: GetProductFormsWorkflowInput) => {
        const result = getProductFormsStep(input);
        return new WorkflowResponse(result);
    }
);

export default getProductFormsWorkflow;