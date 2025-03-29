import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PRODUCT_REVIEW_MODULE } from "../../../../modules/product-review";
import ProductReviewModuleService from "../../../../modules/product-review/service";

export type UpdateReviewsStatusStepInput = {
  id: string;
  status: "pending" | "approved" | "rejected";
}[];

const updateReviewsStatusStep = createStep(
  "update-reviews-status-step",
  async (input: UpdateReviewsStatusStepInput, { container }) => {
    const reviewModuleService: ProductReviewModuleService = container.resolve(PRODUCT_REVIEW_MODULE);

    // Get Original Reviews Before Update
    const originalReviews = await reviewModuleService.listProductReviews({
      id: input.map((review) => review.id),
    });

    const reviews = await reviewModuleService.updateProductReviews(input);

    // Transform originalReviews to match the expected input format for updateProductReviews
    const originalReviewsFormatted = originalReviews.map((review) => ({
      id: review.id,
      status: review.status,
    }));

    return new StepResponse(reviews, originalReviewsFormatted);
  },
  async (originalReviewsFormatted, { container }) => {
    if (!originalReviewsFormatted) return;

    const reviewModuleService: ProductReviewModuleService = container.resolve(PRODUCT_REVIEW_MODULE);
    await reviewModuleService.updateProductReviews(originalReviewsFormatted);
  }
);

export default updateReviewsStatusStep;
