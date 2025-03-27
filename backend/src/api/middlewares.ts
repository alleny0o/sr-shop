// Purpose: Define middlewares for the API routes.
import { defineMiddlewares } from "@medusajs/medusa";
import { MedusaNextFunction, MedusaRequest, MedusaResponse, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

// schemas
import { createVariantMediasSchema, deleteFilesSchema } from "./validation-schemas";

// multer
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

// middlewares
export default defineMiddlewares({
  routes: [
    // ----- /admin/file-manager -----
    {
      matcher: "/admin/file-manager",
      method: "POST",
      middlewares: [upload.array("files") as unknown as (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => any],
    },
    {
        matcher: "/admin/file-manager",
        method: "DELETE",
        middlewares: [validateAndTransformBody(deleteFilesSchema)],
    },

    // ----- /admin/product-variant_medias -----
    {
      matcher: '/admin/product-variant_medias',
      method: 'POST',
      middlewares: [validateAndTransformBody(createVariantMediasSchema)],
    },
  ],
});
