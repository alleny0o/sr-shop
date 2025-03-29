import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";

// UPDATE product form
import updateProductFormWorkflow from "../../../../workflows/product-form/update-product-form";
import { updateProductFormSchema } from "../../../validation-schemas";

type PutRequestBody = z.infer<typeof updateProductFormSchema>;

export const PUT = async (req: AuthenticatedMedusaRequest<PutRequestBody>, res: MedusaResponse) => {
  const { id, name, active } = req.validatedBody;

  const { result } = await updateProductFormWorkflow(req.scope).run({
    input: {
      id,
      name,
      active,
    },
  });

  res.status(200).json({
    product_form: result,
  });
};
