// Purpose: Define middlewares for the API routes.
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
import { createReviewSchema, createVariantMediasSchema, deleteFilesSchema } from "./validation-schemas";

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

    // ----- /admin/product-variant_medias -----
    {
      matcher: "/admin/product-variant_medias",
      method: "POST",
      middlewares: [validateAndTransformBody(createVariantMediasSchema)],
    },
    // ----- /admin/product-review -----
    {
      matcher: "/admin/product-review",
      method: "GET",
      middlewares: [validateAndTransformQuery(GetAdminReviewsSchema, {
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
      })],
    },

    /* STORE MIDDLEWARES */
    // ----- /store/product-review -----
    {
      matcher: "/store/product-review",
      method: ["POST"],
      middlewares: [authenticate("customer", ["session", "bearer"]), validateAndTransformBody(createReviewSchema)],
    },
  ],
});
