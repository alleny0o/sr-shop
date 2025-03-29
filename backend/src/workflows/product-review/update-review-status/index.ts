import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateReviewsStatusStep from "./steps/update-review-status";

export type UpdateReviewStatusWorkflowInput = {
  id: string;
  status: "pending" | "approved" | "rejected";
}[];

const updateReviewsStatusWorkflow = createWorkflow("update-reviews-status-workflow", (input: UpdateReviewStatusWorkflowInput) => {
  const reviews = updateReviewsStatusStep(input);

  return new WorkflowResponse(reviews);
});

export default updateReviewsStatusWorkflow;
