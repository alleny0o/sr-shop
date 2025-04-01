import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateOptionConfigStep, { UpdateOptionConfigStepInput } from "./steps/update-option-config";

type UpdateOptionConfigWorkflowInput = UpdateOptionConfigStepInput;

const updateOptionConfigWorkflow = createWorkflow(
  "update-option-config-workflow",
  (input: UpdateOptionConfigWorkflowInput) => {
    const updatedOptionConfig = updateOptionConfigStep(input);
    return new WorkflowResponse(updatedOptionConfig);
  }
);

export default updateOptionConfigWorkflow;