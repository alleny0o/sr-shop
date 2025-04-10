import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import deleteMediaGroupsStep, { DeleteMediaGroupsStepInput } from "./steps/delete-media-groups";

type DeleteMediaGroupsWorkflowInput = DeleteMediaGroupsStepInput;

const deleteMediaGroupsWorkflow = createWorkflow("delete-media-groups-workflow", (input: DeleteMediaGroupsWorkflowInput) => {
  const { media_group_ids } = input;

  const { deleted_media_groups } = deleteMediaGroupsStep({ media_group_ids });

  return new WorkflowResponse({
    deleted_media_groups: deleted_media_groups,
  });
});

export default deleteMediaGroupsWorkflow;