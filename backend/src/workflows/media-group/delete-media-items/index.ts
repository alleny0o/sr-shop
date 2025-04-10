import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import deleteMediaItemsStep, { DeleteMediaItemsStepInput } from "./steps/delete-media-items";

type DeleteMediaItemsWorkflowInput = DeleteMediaItemsStepInput;

const deleteMediaItemsWorkflow = createWorkflow("delete-media-items-workflow", (input: DeleteMediaItemsWorkflowInput) => {
  const { media_item_ids } = input;

  const result = deleteMediaItemsStep({ media_item_ids });

  return new WorkflowResponse(result);
});

export default deleteMediaItemsWorkflow;
