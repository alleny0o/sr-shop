import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateOptionValueStep, { UpdateOptionValueStepInput } from "./steps/update-option-value";

type UpdateOptionValueWorkflowInput = UpdateOptionValueStepInput;

const updateOptionValueWorkflow = createWorkflow(
    'update-option-value-workflow',
    (input: UpdateOptionValueWorkflowInput) => {
        const updatedOptionValue = updateOptionValueStep(input);
        return new WorkflowResponse(updatedOptionValue);
    }
);

export default updateOptionValueWorkflow;