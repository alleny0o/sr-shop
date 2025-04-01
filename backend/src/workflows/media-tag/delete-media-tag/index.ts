import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import deleteMediaTagsStep, { DeleteMediaTagsStepInput } from "./steps/delete-media-tags";

type DeleteMediaTagWorkflowInput = DeleteMediaTagsStepInput;

const deleteMediaTagWorkflow = createWorkflow("delete-media-tag-workflow", (input: DeleteMediaTagWorkflowInput) => {
  const result = deleteMediaTagsStep(input);
  return new WorkflowResponse(result);
});

export default deleteMediaTagWorkflow;