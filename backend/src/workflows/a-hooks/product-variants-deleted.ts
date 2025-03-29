// Core Flows
import { deleteProductVariantsWorkflow } from "@medusajs/medusa/core-flows";
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows";

// Services
import VariantMediaModuleService from "../../modules/variant-media/service";

// Module Definitions
import { VARIANT_MEDIA_MODULE } from "../../modules/variant-media";

// Workflows
import deleteVariantMediasWorkflow from "../../workflows/variant-media/delete-variant-medias";

// Framework Utils
import { LinkDefinition } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

// Registering hook for when product variants are deleted
deleteProductVariantsWorkflow.hooks.productVariantsDeleted(async ({ ids }, { container }) => {
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  /* ----- VARIANT MEDIA ----- */
  const variantMediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);

  // Fetch variant media associated with the deleted variants
  const variant_medias = await variantMediaModuleService.listVariantMedias({ variant_id: ids });

  // Prepare IDs and link definitions for cleanup
  const file_ids: string[] = [];
  const variant_media_ids: string[] = [];
  const variant_media_links: LinkDefinition[] = [];
  for (const vm of variant_medias) {
    file_ids.push(vm.file_id);
    variant_media_ids.push(vm.id);
    variant_media_links.push({
      [Modules.PRODUCT]: {
        product_variant_id: vm.variant_id,
      },
      [VARIANT_MEDIA_MODULE]: {
        variant_media_id: vm.id,
      },
    });
  }

  // delete associated files
  if (file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: file_ids,
      },
    });
  }

  // delete associated variant media records id any exist
  if (variant_media_ids.length > 0) {
    await deleteVariantMediasWorkflow(container).run({
      input: {
        variant_media_ids: variant_media_ids,
      },
    });
  }

  // cleanup links
  if (variant_media_links.length > 0) {
    await link.dismiss(variant_media_links);
  }
});
