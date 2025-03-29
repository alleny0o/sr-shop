import { createStep, StepResponse } from "@medusajs/workflows-sdk";
import ProductReviewModuleService from "../../../../modules/product-review/service";
import { PRODUCT_REVIEW_MODULE } from "../../../../modules/product-review";

export type DeleteProductReviewsStepInput = {
  ids: string[];
};

const deleteProductReviewsStep = createStep(
  "delete-product-reviews-step",
  async (input: DeleteProductReviewsStepInput, { container }) => {
    const reviewModuleService: ProductReviewModuleService = container.resolve(PRODUCT_REVIEW_MODULE);

    // Get all product reviews with their associated images
    const productReviews = await reviewModuleService.listProductReviews({ ids: input.ids }, { relations: ["images"] });

    // Delete the product reviews by their IDs
    await reviewModuleService.deleteProductReviews(input.ids);

    // Collect all image IDs associated with the reviews
    const allImages = productReviews?.map((review) => review.images || []) || [];
    const allImageIds: string[] = [];

    for (const imageGroup of allImages) {
      for (const image of imageGroup) {
        allImageIds.push(image.id);
      }
    }

    // Delete the associated images if any exist
    if (allImageIds.length > 0) {
      await reviewModuleService.deleteProductReviewImages(allImageIds);
    }

    return new StepResponse(productReviews, productReviews);
  },
  async (productReviews, { container }) => {
    const reviewModuleService: ProductReviewModuleService = container.resolve(PRODUCT_REVIEW_MODULE);

    if (!productReviews || productReviews.length === 0) return;

    // Restore the deleted product reviews by recreating them
    for (const review of productReviews) {
      await reviewModuleService.createProductReviews({
        title: review.title,
        content: review.content,
        rating: review.rating,
        recommend: review.recommend,
        product_id: review.product_id,
        customer_id: review.customer_id,
        first_name: review.first_name,
        last_name: review.last_name,
        status: review.status,
      });

      for (const image of review.images) {
        await reviewModuleService.createProductReviewImages({
          file_id: image.file_id,
          name: image.name,
          size: image.size,
          mime_type: image.mime_type,
          url: image.url,
          product_review_id: review.id,
        });
      }
    }
  }
);

export default deleteProductReviewsStep;
