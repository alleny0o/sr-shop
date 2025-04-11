import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const variant_ids = req.query.ids as string[];
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const variant_medias = await Promise.all(
    variant_ids.map(async (variant_id) => {
      const { data: linkResults } = await query.graph({
        entity: "product_variant",
        fields: ["variant_medias.*"],
        filters: { id: variant_id },
      });

      const medias = linkResults[0]?.variant_medias || [];

      // Prefer thumbnail, fallback to first media, else null
      const selectedMedia = medias.find((m) => m?.is_thumbnail) || medias[0] || null;

      return {
        variant_id,
        variant_medias: selectedMedia
          ? [
              {
                id: selectedMedia.id,
                url: selectedMedia.url,
                mime_type: selectedMedia.mime_type,
                is_thumbnail: selectedMedia.is_thumbnail,
                name: selectedMedia.name,
              },
            ]
          : null,
      };
    })
  );

  res.json({ variant_medias });
};
