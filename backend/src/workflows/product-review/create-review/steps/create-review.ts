import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PRODUCT_REVIEW_MODULE } from "../../../../modules/product-review";
import ProductReviewModuleService from "../../../../modules/product-review/service";

export type ProductReviewImage = {
    file_id: string;
    name: string;
    size: number;
    mime_type: string;
    url: string;
};

export type CreateReviewStepInput = {
    title?: string;
    content: string;
    rating: number;
    recommend: boolean;
    product_id: string;
    customer_id?: string;
    first_name: string;
    last_name: string;
    status?: "pending" | "approved" | "rejected";
    images?: ProductReviewImage[];
};

const createReviewStep = createStep(
    "create-review-step",
    async (input: CreateReviewStepInput, { container }) => {
        const reviewModuleService: ProductReviewModuleService = container.resolve(PRODUCT_REVIEW_MODULE);

        const review = await reviewModuleService.createProductReviews({
            title: input.title,
            content: input.content,
            rating: input.rating,
            recommend: input.recommend,
            product_id: input.product_id,
            customer_id: input.customer_id,
            first_name: input.first_name,
            last_name: input.last_name,
            status: input.status,
        });

        if (input.images && input.images.length > 0) {
            const imagesPayload = input.images.map((image) => ({
                file_id: image.file_id,
                name: image.name,
                size: image.size,
                mime_type: image.mime_type,
                url: image.url,
                product_review_id: review.id,
            }));
            await reviewModuleService.createProductReviewImages(imagesPayload);
        };

        return new StepResponse(review, review.id);
    },
    async (reviewId, { container }) => {
        if (!reviewId) return;

        const reviewModuleService: ProductReviewModuleService = container.resolve(PRODUCT_REVIEW_MODULE);

        await reviewModuleService.deleteProductReviews(reviewId);
    },
);

export default createReviewStep;