import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { updateReviewsStatusSchema } from "../../../validation-schemas";
import updateReviewsStatusWorkflow from "../../../../workflows/product-review/update-review-status";
import { z } from "zod";

export async function POST(req: MedusaRequest<z.infer<typeof updateReviewsStatusSchema>>, res: MedusaResponse) {
  const { ids, status } = req.validatedBody;

  const { result } = await updateReviewsStatusWorkflow(req.scope).run({
    input: ids.map((id) => ({ id, status })),
  });

  res.json(result);
}
