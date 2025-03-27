import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createVariantMediasStep, { CreateVariantMediaInput } from "./steps/create-variant-medias";
import createRemoteLinkStep from "./steps/create-link";
import { VariantMediaType } from "../types";

type CreateMediasWorkflowInput = {
  variant_medias: CreateVariantMediaInput[];
};

const createVariantMediasWorkflow = createWorkflow("create-variant-medias-workflow", (input: CreateMediasWorkflowInput) => {
  const { variant_medias } = input;

  const { variant_medias: created_variant_medias }: { variant_medias: VariantMediaType[] } = createVariantMediasStep({
    variant_medias,
  });

  createRemoteLinkStep({ variant_medias: created_variant_medias });

  return new WorkflowResponse({
    medias: created_variant_medias,
  });
});

export default createVariantMediasWorkflow;
