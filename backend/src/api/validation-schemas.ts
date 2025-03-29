import { z } from "zod";

/* ADMIN SCHEMAS */
// ----- /admin/file-manager DELETE -----
export const deleteFilesSchema = z.object({
  file_ids: z.array(z.string()),
});

// ----- /admin/product-variant_medias POST -----
export const createVariantMediasSchema = z.object({
  variant_medias: z.array(
    z.object({
      file_id: z.string(),
      product_id: z.string(),
      variant_id: z.string(),
      name: z.string(),
      size: z.number(),
      mime_type: z.string(),
      is_thumbnail: z.boolean(),
      url: z.string(),
    })
  ),
});

/* STORE SCHEMAS */
// ----- /store/product-review POST -----
export const createReviewSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  rating: z.preprocess((val) => {
    if (val && typeof val === "string") {
      return parseInt(val);
    }
    return val;
  }, z.number().min(1).max(5)),
  recommend: z.boolean(),
  product_id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  images: z
    .array(
      z.object({
        file_id: z.string(),
        name: z.string(),
        size: z.number(),
        mime_type: z.string(),
        url: z.string(),
      })
    )
    .optional(),
});
