import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import getMediaGroupsStep, { GetMediaGroupsStepInput } from "./steps/get-media-groups";

type GetMediaGroupsWorkflowInput = GetMediaGroupsStepInput;

const getMediaGroupsWorkflow = createWorkflow("get-media-groups-workflow", (input: GetMediaGroupsWorkflowInput) => {
  const mediaGroups = getMediaGroupsStep({ product_id: input.product_id });
  return new WorkflowResponse(mediaGroups);
});

export default getMediaGroupsWorkflow;