import { z } from "zod";

/* ADMIN SCHEMAS */
/* START FILE MANAGER SCHEMAS  */
export const deleteFilesSchema = z.object({
  file_ids: z.array(z.string()),
});
/* END FILE MANAGER SCHEMAS  */

/* START VARIANT MEDIAS SCHEMAS  */
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
/* END VARIANT MEDIAS SCHEMAS  */

/* START PRODUCT FORM SCHEMAS  */
export const updateProductFormSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  active: z.boolean(),
});

export const productFormFieldSchema = z.object({
  id: z.string().optional(),
  uuid: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  required: z.boolean(),
  input_type: z.enum(["text", "textarea", "dropdown", "images"]),

  // for images input type
  max_file_size: z.number().optional(),
  max_images: z.number().optional(),
  image_ratios: z.array(z.string()).optional(),

  image: z.object({
    id: z.string().optional(),
    file_id: z.string(),
    name: z.string(),
    size: z.number(),
    mime_type: z.string(),
    url: z.string(),
  }).optional(),
});

// Use the extracted schema
export const createProductFormFieldsSchema = z.object({
  fields: z.array(productFormFieldSchema),
  product_id: z.string(),
});

export const deleteProductFormFieldsSchema = z.object({
  field_ids: z.array(z.string()),
});

export const updateProductFormFieldsSchema = z.object({
  fields: z.array(productFormFieldSchema),
});
/* END PRODUCT FORM SCHEMAS */

/* STORE SCHEMAS */
/* START PRODUCT REVIEW SCHEMAS  */
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

export const updateReviewsStatusSchema = z.object({
  ids: z.array(z.string()),
  status: z.enum(["pending", "approved", "rejected"]),
});
/* END PRODUCT REVIEW SCHEMAS  */
