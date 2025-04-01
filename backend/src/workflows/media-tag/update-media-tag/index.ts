import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateMediaTagStep, { UpdateMediaTagStepInput } from "./steps/update-media-tag";

type UpdateMediaTagWorkflowInput = UpdateMediaTagStepInput;

const updateMediaTagWorkflow = createWorkflow("update-media-tag-workflow", (input: UpdateMediaTagWorkflowInput) => {
  const result = updateMediaTagStep(input);
  return new WorkflowResponse(result);
});

export default updateMediaTagWorkflow;