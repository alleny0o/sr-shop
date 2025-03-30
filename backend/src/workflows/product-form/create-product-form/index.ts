import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createProductFormStep, { CreateProductFormStepInput } from "./steps/create-product-form";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import { PRODUCT_FORM_MODULE } from "../../../modules/product-form";

type CreateProductFormWorkflowInput = CreateProductFormStepInput;

const createProductFormWorkflow = createWorkflow("create-product-form-workflow", (input: CreateProductFormWorkflowInput) => {
  // check product exists
  // @ts-ignore
  useQueryGraphStep({
    entity: "product",
    fields: ["id"],
    filters: {
      id: input.product_id,
    },
    options: {
      throwIfKeyNotFound: true,
    },
  });

  const result = createProductFormStep(input);

  createRemoteLinkStep([
    {
      [Modules.PRODUCT]: {
        product_id: input.product_id,
      },
      [PRODUCT_FORM_MODULE]: {
        product_form_id: result.id,
      },
    },
  ]);

  // @ts-ignore
  return new WorkflowResponse(result);
});

export default createProductFormWorkflow;
