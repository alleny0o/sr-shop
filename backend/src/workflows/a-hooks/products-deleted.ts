// Core Flows
import { deleteProductsWorkflow, deleteFilesWorkflow } from "@medusajs/medusa/core-flows";

// Services
import VariantMediaModuleService from "../../modules/variant-media/service";
import ProductReviewModuleService from "../../modules/product-review/service";
import ProductFormModuleService from "../../modules/product-form/service";
import OptionConfigModuleService from "../../modules/option-config/service";
import MediaTagModuleService from "../../modules/media-tag/service";

// Module Definitions
import { VARIANT_MEDIA_MODULE } from "../../modules/variant-media";
import { PRODUCT_REVIEW_MODULE } from "../../modules/product-review";
import { PRODUCT_FORM_MODULE } from "../../modules/product-form";
import { OPTION_CONFIG_MODULE } from "../../modules/option-config";
import { MEDIA_TAG_MODULE } from "../../modules/media-tag";

// Workflows
import deleteVariantMediasWorkflow from "../variant-media/delete-variant-medias";
import deleteProductReviewsWorkflow from "../product-review/delete-reviews";
import deleteMediaTagWorkflow from "../media-tag/delete-media-tag";

// Framework Utils
import { LinkDefinition } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

deleteProductsWorkflow.hooks.productsDeleted(async ({ ids }, { container }) => {
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  /* ----- START VARIANT MEDIA ----- */
  // This part deletes variant media associated with the deleted products.
  const variantMediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);

  const variant_medias = await variantMediaModuleService.listVariantMedias({ product_id: ids });

  // Prepare IDs and link definitions for cleanup
  const variant_media_file_ids: string[] = [];
  const variant_media_ids: string[] = [];
  const variant_media_links: LinkDefinition[] = [];
  for (const vm of variant_medias) {
    variant_media_file_ids.push(vm.file_id);
    variant_media_ids.push(vm.id);
    variant_media_links.push({
      [Modules.PRODUCT]: {
        product_variant_id: vm.product_id,
      },
      [VARIANT_MEDIA_MODULE]: {
        variant_media_id: vm.id,
      },
    });
  }

  if (variant_media_file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: variant_media_file_ids,
      },
    });
  }

  if (variant_media_ids.length > 0) {
    await deleteVariantMediasWorkflow(container).run({
      input: {
        variant_media_ids: variant_media_ids,
      },
    });
  }

  if (variant_media_links.length > 0) {
    await link.dismiss(variant_media_links);
  }
  /* ----- END VARIANT MEDIA ----- */

  /* ----- START PRODUCT REVIEW ----- */
  // This part deletes product reviews associated with the deleted products.
  const reviewModuleService: ProductReviewModuleService = container.resolve(PRODUCT_REVIEW_MODULE);
  const product_reviews = await reviewModuleService.listProductReviews({ product_id: ids });

  const review_images_file_ids: string[] = [];
  const review_ids: string[] = [];
  const review_links: LinkDefinition[] = [];

  for (const { id, product_id, images = [] } of product_reviews) {
    review_ids.push(id);

    for (const { file_id } of images) {
      review_images_file_ids.push(file_id);
    }

    review_links.push({
      [Modules.PRODUCT]: { product_id },
      [PRODUCT_REVIEW_MODULE]: { product_review_id: id },
    });
  }

  if (review_images_file_ids.length) {
    await deleteFilesWorkflow(container).run({ input: { ids: review_images_file_ids } });
  }

  if (review_ids.length) {
    await deleteProductReviewsWorkflow(container).run({ input: { ids: review_ids } });
  }
  /* ----- END PRODUCT REVIEW ----- */

  /* ----- START PRODUCT FORM ----- */
  // This part deletes product forms associated with the deleted products.
  const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);

  const product_forms = await productFormModuleService.listProductForms(
    { product_id: ids },
    { relations: ["fields", "fields.image"] }
  );

  const product_form_file_ids: string[] = [];
  const product_form_ids: string[] = [];
  const product_form_links: LinkDefinition[] = [];
  for (const product_form of product_forms) {
    if (!product_form) continue;

    product_form_ids.push(product_form.id);

    product_form_links.push({
      [Modules.PRODUCT]: {
        product_id: product_form.product_id,
      },
      [PRODUCT_FORM_MODULE]: {
        product_form_id: product_form.id,
      },
    });

    for (const product_form_field of product_form.fields) {
      if (product_form_field.image && "file_id" in product_form_field.image) {
        product_form_file_ids.push(product_form_field.image.file_id);
      }
    }
  }

  await productFormModuleService.deleteProductForms(product_form_ids);

  if (product_form_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: product_form_file_ids,
      },
    });
  }

  if (product_form_links.length > 0) {
    await link.dismiss(product_form_links);
  }
  /* ----- END PRODUCT FORM ----- */

  /* ----- START OPTION CONFIG ----- */
  const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);
  const optionConfigs = await optionConfigModuleService.listOptionConfigs(
    { product_id: ids },
    { relations: ["option_values", "option_values.image"] }
  );

  const option_config_file_ids: string[] = [];
  const option_config_ids: string[] = [];
  const option_config_links: LinkDefinition[] = [];
  for (const optionConfig of optionConfigs) {
    for (const optionValue of optionConfig.option_values) {
      if (optionValue.image && "file_id" in optionValue.image) {
        option_config_file_ids.push(optionValue.image.file_id);
      }
    }

    option_config_ids.push(optionConfig.id);

    option_config_links.push({
      [Modules.PRODUCT]: {
        product_option_id: optionConfig.product_id,
      },
      [OPTION_CONFIG_MODULE]: {
        option_config_id: optionConfig.id,
      },
    });
  }

  if (option_config_file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: option_config_file_ids,
      },
    });
  }

  await optionConfigModuleService.deleteOptionConfigs(option_config_ids);

  await link.dismiss(option_config_links);
  /* ----- END OPTION CONFIG ----- */

  /* ----- START MEDIA TAG ----- */
  const mediaTagModuleService: MediaTagModuleService = container.resolve(MEDIA_TAG_MODULE);

  const media_tags = await mediaTagModuleService.listMediaTags({ product_id: ids });
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

  if (media_tag_ids.length > 0) {
    await deleteMediaTagWorkflow(container).run({
      input: {
        ids: media_tag_ids,
      },
    });
  }

  if (media_tag_links.length > 0) {
    await link.dismiss(media_tag_links);
  }
  /* ----- END MEDIA TAG ----- */
});
