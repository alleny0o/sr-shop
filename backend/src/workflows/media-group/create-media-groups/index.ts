import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createMediaGroupsStep, { CreateMediaGroupStepInput } from "./steps/create-media-groups";
import createRemoteLinkStep from "./steps/create-link";

type CreateMediaGroupsWorkflowInput = {
  media_groups: CreateMediaGroupStepInput[];
};

const createVariantMediasWorkflow = createWorkflow("create-media-groups-workflow", (input: CreateMediaGroupsWorkflowInput) => {
    const { media_groups } = input;
    const { media_groups: created_groups } = createMediaGroupsStep({ media_groups });
    createRemoteLinkStep({ media_groups: created_groups });

    return new WorkflowResponse(created_groups);
  }
);

export default createVariantMediasWorkflow;