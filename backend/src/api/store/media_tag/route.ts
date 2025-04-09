import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const variant_ids = req.query.ids as string[];
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: linkResults } = await query.graph({
    entity: "product_variant",
    fields: ["id", "media_tag.*"],
    filters: { id: variant_ids },
  });

  const media_tags = linkResults.map((row) => ({
    variant_id: row.id,
    media_tag: row.media_tag
      ? {
          id: row.media_tag.id,
          product_id: row.media_tag.product_id,
          variant_id: row.media_tag.variant_id,
          value: row.media_tag.value || null,
        }
      : null,
  }));

  res.json({ media_tags });
};
