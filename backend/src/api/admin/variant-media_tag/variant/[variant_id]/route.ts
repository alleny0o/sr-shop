import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

// GET media tag for a variant by variant id
export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const variant_id = req.params.variant_id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: linkResults } = await query.graph({
    entity: "product_variant",
    fields: ["media_tag.*"],
    filters: {
      id: variant_id,
    },
  });

  const media_tag_results = linkResults[0].media_tag;

  res.json({
    media_tag: media_tag_results
      ? {
          id: media_tag_results.id,
          product_id: media_tag_results.product_id,
          variant_id: media_tag_results.variant_id,
          value: media_tag_results.value || null,
        }
      : null,
  });
};