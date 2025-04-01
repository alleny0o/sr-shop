import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createMediaTagStep, { CreateMediaTagStepInput } from "./steps/create-media-tag";
import { createRemoteLinkStep, useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import { MEDIA_TAG_MODULE } from "../../../modules/media-tag";

type CreateMediaTagWorkflowInput = CreateMediaTagStepInput;

const createMediaTagWorkflow = createWorkflow("create-media-tag-workflow", (input: CreateMediaTagWorkflowInput) => {
  // check variant exists
  // @ts-ignore
  useQueryGraphStep({
    entity: "variant",
    fields: ["id"],
    filters: {
      id: input.variant_id,
    },
    options: {
      throwIfKeyNotFound: true,
    },
  });

  const result = createMediaTagStep(input);

  createRemoteLinkStep([
    {
      [Modules.PRODUCT]: {
        product_variant_id: input.variant_id,
      },
      [MEDIA_TAG_MODULE]: {
        media_tag_id: result.id,
      },
    },
  ]);

  // @ts-ignore
  return new WorkflowResponse(result);
});

export default createMediaTagWorkflow;