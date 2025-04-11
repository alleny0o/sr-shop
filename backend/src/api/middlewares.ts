import { defineMiddlewares } from "@medusajs/medusa";
import {
  authenticate,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";

// schemas
import {
  createProductFormFieldsSchema,
  createReviewSchema,
  createVariantMediasSchema,
  deleteFilesSchema,
  deleteOptionValueSchema,
  deleteProductFormFieldsSchema,
  updateMediaTagSchema,
  updateOptionConfigSchema,
  updateOptionValueSchema,
  updateProductFormFieldsSchema,
  updateProductFormSchema,
  updateReviewsStatusSchema,
} from "./validation-schemas";

import { createFindParams } from "@medusajs/medusa/api/utils/validators";
const GetAdminReviewsSchema = createFindParams();

// multer
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

// middlewares
export default defineMiddlewares({
  routes: [
    /* ADMIN MIDDLEWARES */
    // ----- /admin/file-manager -----
    {
      matcher: "/admin/file-manager",
      method: "POST",
      middlewares: [
        upload.array("files") as unknown as (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => any,
      ],
    },
    {
      matcher: "/admin/file-manager",
      method: "DELETE",
      middlewares: [validateAndTransformBody(deleteFilesSchema)],
    },

    // ----- /admin/product_variant-medias -----
    {
      matcher: "/admin/product_variant-medias",
      method: "POST",
      middlewares: [validateAndTransformBody(createVariantMediasSchema)],
    },

    // ----- /admin/product-review -----
    {
      matcher: "/admin/product-review",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetAdminReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "content",
            "rating",
            "product_id",
            "customer_id",
            "status",
            "first_name",
            "last_name",
            "created_at",
            "updated_at",
            "product.*",
          ],
        }),
      ],
    },
    // ----- /admin/product-product_form -----
    {
      matcher: "/admin/product-product_form/form",
      method: "PUT",
      middlewares: [validateAndTransformBody(updateProductFormSchema)],
    },
    {
      matcher: "/admin/product-product_form/fields",
      method: "POST",
      middlewares: [validateAndTransformBody(createProductFormFieldsSchema)],
    },
    {
      matcher: "/admin/product-product_form/fields",
      method: "DELETE",
      middlewares: [validateAndTransformBody(deleteProductFormFieldsSchema)],
    },
    {
      matcher: "/admin/product-product_form/fields",
      method: "PUT",
      middlewares: [validateAndTransformBody(updateProductFormFieldsSchema)],
    },
    // ----- /admin/product-option_config -----
    {
      matcher: "/admin/product-option_config/option-config",
      method: "PUT",
      middlewares: [validateAndTransformBody(updateOptionConfigSchema)],
    },
    {
      matcher: "/admin/product-option_config/option-values",
      method: "PUT",
      middlewares: [validateAndTransformBody(updateOptionValueSchema)],
    },
    {
      matcher: "/admin/product-option_config/option-values",
      method: "DELETE",
      middlewares: [validateAndTransformBody(deleteOptionValueSchema)],
    },
    // ----- /admin/variant-media_tag -----
    {
      matcher: "/admin/variant-media_tag",
      method: "PUT",
      middlewares: [validateAndTransformBody(updateMediaTagSchema)],
    },

    /* STORE MIDDLEWARES */
    // ----- /store/product-review -----
    {
      matcher: "/store/product-review",
      method: ["POST"],
      middlewares: [authenticate("customer", ["session", "bearer"]), validateAndTransformBody(createReviewSchema)],
    },
    // ----- /store/product-review/status -----
    {
      matcher: "/store/product-review/status",
      method: ["POST"],
      middlewares: [validateAndTransformBody(updateReviewsStatusSchema)],
    },
  ],
});
