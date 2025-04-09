import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import createReviewWorkflow from "../../../workflows/product-review/create-review";

import { z } from "zod";
import { createReviewSchema } from "../../validation-schemas";

type CreateRequestBody = z.infer<typeof createReviewSchema>;

export const POST = async (req: AuthenticatedMedusaRequest<CreateRequestBody>, res: MedusaResponse) => {
    const input = req.validatedBody;

    const result = await createReviewWorkflow(req.scope).run({
        input: {
            product_review: {
                title: input.title,
                content: input.content,
                rating: input.rating,
                recommend: input.recommend,
                product_id: input.product_id,
                first_name: input.first_name,
                last_name: input.last_name,
                images: input.images,
            },
        },
    })
};
