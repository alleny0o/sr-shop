import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import deleteMediaItemsStep, { DeleteMediaItemsStepInput } from "./steps/delete-media-items";

type DeleteMediaItemsWorkflowInput = DeleteMediaItemsStepInput;

const deleteMediaItemsWorkflow = createWorkflow("delete-media-items-workflow", (input: DeleteMediaItemsWorkflowInput) => {
  const { media_group_id } = input;

  const result = deleteMediaItemsStep({ media_group_id });

  return new WorkflowResponse(result);
});

export default deleteMediaItemsWorkflow;
