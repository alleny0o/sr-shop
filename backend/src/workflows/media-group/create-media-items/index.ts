import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createMediaItemsStep, { CreateMediaItemsStepInput } from "./steps/create-media-items";

type CreateMediaItemsWorkflowInput = CreateMediaItemsStepInput;

const createMediaItemsWorkflow = createWorkflow("create-media-items-workflow", (input: CreateMediaItemsWorkflowInput) => {
  const createdMediaItems = createMediaItemsStep(input);

  return new WorkflowResponse(createdMediaItems);
});

export default createMediaItemsWorkflow;
