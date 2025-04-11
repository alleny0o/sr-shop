import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

// GET all variant_medias for a variant by variant id
export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const variant_id = req.params.variant_id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: linkResults } = await query.graph({
    entity: "product_variant",
    fields: ["variant_medias.*"],
    filters: {
      id: variant_id,
    },
  });

  const variant_medias_results = linkResults[0].variant_medias;

  res.json({
    variant_medias: variant_medias_results
      ?.map((vm) => {
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
      .filter(Boolean),
  });
};

import deleteVariantMediasWorkflow from "../../../../../workflows/variant-media/delete-variant-medias";
import { VARIANT_MEDIA_MODULE } from "../../../../../modules/variant-media";
import { LinkDefinition } from "@medusajs/framework/types";

// DELETE all variant_medias for a variant by variant id
export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const variant_id = req.params.variant_id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK);

  try {
    const { data: linkResults } = await query.graph({
      entity: "product_variant",
      fields: ["variant_medias.*"],
      filters: {
        id: variant_id,
      },
    });

    const variant_media_results = linkResults[0].variant_medias;
    const variant_media_ids = variant_media_results?.filter((vm) => vm !== null).map((vm) => vm.id) || [];

    await deleteVariantMediasWorkflow(req.scope).run({
      input: {
        variant_media_ids: variant_media_ids,
      },
    });

    const links: LinkDefinition[] = [];

    for (const vm_ids of variant_media_ids) {
      links.push({
        [Modules.PRODUCT]: {
          product_variant_id: variant_id,
        },
        [VARIANT_MEDIA_MODULE]: {
          variant_media_id: vm_ids,
        },
      });
    }

    await link.dismiss(links);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
