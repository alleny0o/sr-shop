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

      const medias = linkResults[0].variant_medias;

      return {
        variant_id,
        variant_medias: medias?.length
          ? medias.map((vm) => {
              if (!vm) return null;
              return {
                id: vm.id,
                file_id: vm.file_id,
                product_id: vm.product_id,
                variant_id: vm.variant_id,
                url: vm.url,
                mime_type: vm.mime_type,
                is_thumbnail: vm.is_thumbnail,
                name: vm.name,
                size: vm.size,
              };
            })
          : null,
      };
    })
  );

  res.json({ variant_medias });
};
