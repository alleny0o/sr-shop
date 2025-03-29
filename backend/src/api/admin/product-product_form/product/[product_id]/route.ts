import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import getProductFormWorkflow from "../../../../../workflows/product-form/get-product-form";

// GET customization form based on product_id
export const GET = async (req: AuthenticatedMedusaRequest<{ product_id: string }>, res: MedusaResponse) => {
  const { product_id } = req.params;

  try {
    const { result } = await getProductFormWorkflow(req.scope).run({
      input: { product_id },
    });

    if (!result) {
      return res.status(404).json({ message: "No form found for the specified product" });
    }

    return res.status(200).json({ product_form: result });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
