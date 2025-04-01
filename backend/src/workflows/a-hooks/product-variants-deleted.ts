// Core Flows
import { deleteProductVariantsWorkflow } from "@medusajs/medusa/core-flows";
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows";

// Services
import VariantMediaModuleService from "../../modules/variant-media/service";
import MediaTagModuleService from "../../modules/media-tag/service";

// Module Definitions
import { VARIANT_MEDIA_MODULE } from "../../modules/variant-media";
import { MEDIA_TAG_MODULE } from "../../modules/media-tag";

// Workflows
import deleteVariantMediasWorkflow from "../../workflows/variant-media/delete-variant-medias";
import deleteMediaTagWorkflow from "../media-tag/delete-media-tag";

// Framework Utils
import { LinkDefinition } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

// Registering hook for when product variants are deleted
deleteProductVariantsWorkflow.hooks.productVariantsDeleted(async ({ ids }, { container }) => {
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  /* ----- START VARIANT MEDIA ----- */
  const variantMediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);

  // Fetch variant media associated with the deleted variants
  const variant_medias = await variantMediaModuleService.listVariantMedias({ variant_id: ids });

  // Prepare IDs and link definitions for cleanup
  const variant_media_file_ids: string[] = [];
  const variant_media_ids: string[] = [];
  const variant_media_links: LinkDefinition[] = [];
  for (const vm of variant_medias) {
    variant_media_file_ids.push(vm.file_id);
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
  if (variant_media_file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: variant_media_file_ids,
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
  /* ----- END VARIANT MEDIA ----- */

  /* ----- START MEDIA TAG ----- */
  const mediaTagModuleService: MediaTagModuleService = container.resolve(MEDIA_TAG_MODULE);

  // Fetch media tags associated with the deleted variants
  const media_tags = await mediaTagModuleService.listMediaTags({ variant_id: ids });

  // Prepare IDs and link definitions for cleanup
  const media_tag_ids: string[] = [];
  const media_tag_links: LinkDefinition[] = [];
  for (const mt of media_tags) {
    media_tag_ids.push(mt.id);
    media_tag_links.push({
      [Modules.PRODUCT]: {
        product_variant_id: mt.variant_id,
      },
      [MEDIA_TAG_MODULE]: {
        media_tag_id: mt.id,
      },
    });
  }

  // delete associated media tag records if any exist
  if (media_tag_ids.length > 0) {
    await deleteMediaTagWorkflow(container).run({
      input: {
        ids: media_tag_ids,
      },
    });
  }

  // cleanup links
  if (media_tag_links.length > 0) {
    await link.dismiss(media_tag_links);
  }
  /* ----- END MEDIA TAG ----- */
});
