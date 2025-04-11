import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateMediaGroupStep, { UpdateMediaGroupStepInput } from "./steps/update-media-group";

type UpdateMediaGroupWorkflowInput = UpdateMediaGroupStepInput;

const updateMediaGroupsWorkflow = createWorkflow("update-media-group-workflow", (input: UpdateMediaGroupWorkflowInput) => {
  const result = updateMediaGroupStep(input);

  return new WorkflowResponse(result);
});

export default updateMediaGroupsWorkflow;