import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/framework/utils";

// GET option configs for a product by product_id
import getOptionConfigsWorkflow from "../../../../../workflows/option-config/get-option-configs";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { product_id } = req.params;

  try {
    const result = await getOptionConfigsWorkflow(req.scope).run({
      input: {
        product_id,
      },
    });

    if (!result) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "No option configs found for the provided product_id");
    }

    res.status(200).json({ option_configs: result.result });
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error;
    }

    throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `An unexpected error occurred: ${error.message}`);
  }
};
