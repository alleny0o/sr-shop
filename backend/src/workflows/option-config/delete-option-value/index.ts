import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import deleteOptionValueStep, { DeleteOptionValueStepInput} from "./steps/delete-option-value";

type DeleteOptionValueWorkflowInput = DeleteOptionValueStepInput;

const deleteOptionValueWorkflow = createWorkflow(
    'delete-option-value-workflow',
    (input: DeleteOptionValueWorkflowInput) => {
        const result = deleteOptionValueStep(input);
        return new WorkflowResponse(result);
    }
);

export default deleteOptionValueWorkflow;