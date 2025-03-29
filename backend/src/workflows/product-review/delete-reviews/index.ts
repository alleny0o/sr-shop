import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import deleteProductReviewsStep, { DeleteProductReviewsStepInput } from "./steps/delete-reviews";

type DeleteProductReviewsWorkflowInput = DeleteProductReviewsStepInput;

const deleteProductReviewsWorkflow = createWorkflow(
  "delete-product-reviews-workflow",
  (input: DeleteProductReviewsWorkflowInput) => {
    const result = deleteProductReviewsStep(input);

    return new WorkflowResponse(result);
  }
);

export default deleteProductReviewsWorkflow;
