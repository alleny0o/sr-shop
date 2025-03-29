// Core Flows
import { deleteProductsWorkflow, deleteFilesWorkflow } from "@medusajs/medusa/core-flows";

// Services
import VariantMediaModuleService from "../../modules/variant-media/service";
import ProductReviewModuleService from "../../modules/product-review/service";
import ProductFormModuleService from "../../modules/product-form/service";

// Module Definitions
import { VARIANT_MEDIA_MODULE } from "../../modules/variant-media";
import { PRODUCT_REVIEW_MODULE } from "../../modules/product-review";
import { PRODUCT_FORM_MODULE } from "../../modules/product-form";

// Workflows
import deleteVariantMediasWorkflow from "../variant-media/delete-variant-medias";
import deleteProductReviewsWorkflow from "../product-review/delete-reviews";

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
        product_id: vm.product_id,
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
  for (const product_form of product_forms) {
    if (!product_form) continue;

    product_form_ids.push(product_form.id);

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
  /* ----- END PRODUCT FORM ----- */
});
