import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/framework/utils";

// GET media groups for a product by product_id
import getMediaGroupsWorkflow from "../../../../../workflows/media-group/get-media-groups";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { product_id } = req.params;

  try {
    const result = await getMediaGroupsWorkflow(req.scope).run({
      input: {
        product_id,
      },
    });

    if (!result) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "No media groups found for the provided product_id");
    }

    res.status(200).json({ media_groups: result.result });
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error;
    }

    throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `An unexpected error occurred: ${error.message}`);
  }
};