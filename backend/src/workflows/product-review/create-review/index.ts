import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createReviewStep, { CreateReviewStepInput } from "./steps/create-review";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

type CreateReviewInput = {
  product_review: CreateReviewStepInput;
};

export const createReviewWorkflow = createWorkflow("create-review-workflow", (input: CreateReviewInput) => {
  // check product exists
  // @ts-ignore
  useQueryGraphStep({
    entity: "product",
    fields: ["id"],
    filters: {
      id: input.product_review.product_id,
    },
    options: {
      throwIfKeyNotFound: true,
    },
  });

  const review = createReviewStep(input.product_review);

  // @ts-ignore
  return new WorkflowResponse(review);
});
