import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PRODUCT_REVIEW_MODULE } from "../../../../modules/product-review";
import ProductReviewModuleService from "../../../../modules/product-review/service";

export type CreateReviewStepInput = {
    title?: string;
    content: string;
    rating: number;
    product_id: string;
    customer_id?: string;
    first_name: string;
    last_name: string;
    status?: "pending" | "approved" | "rejected";
};

const createReviewStep = createStep(
    "create-review-step",
    async (input: CreateReviewStepInput, { container }) => {
        const reviewModuleService: ProductReviewModuleService = container.resolve(PRODUCT_REVIEW_MODULE);

        const review = await reviewModuleService.createProductReviews(input);
    },
);