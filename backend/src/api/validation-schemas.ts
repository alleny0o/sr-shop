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

/* START MEDIA GROUP SCHEMAS */
export const createMediaGroupsSchema = z.object({
  media_groups: z.array(
    z.object({
      uuid: z.string(),
      product_id: z.string(),
      media_tag: z.string().optional(),
    }),
  ),
});

export const updateMediaGroupsSchema = z.object({
  media_groups: z.array(
    z.object({
      id: z.string(),
      media_tag: z.string().optional(),
    }),
  ),
});

export const deleteMediaGroupsSchema = z.object({
  media_group_ids: z.array(z.string()),
});

export const createMediaItemsSchema = z.object({
  media_items: z.object({
    media_group_id: z.string(),
    medias: z.array(
      z.object({
        file_id: z.string(),
        name: z.string(),
        size: z.number(),
        mime_type: z.string(),
        is_thumbnail: z.boolean(),
        url: z.string(),
      }),
    ),
  }),
});

export const deleteMediaItemsSchema = z.object({
  media_group_id: z.string(),
});
/* END MEDIA GROUP SCHEMAS */

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

/* START OPTION CONFIG SCHEMAS */
export const updateOptionConfigSchema = z.object({
  id: z.string(),
  option_title: z.string().optional(),
  display_type: z.any().optional(),
  is_selected: z.boolean().optional(),
});

export const updateOptionValueSchema = z.object({
  id: z.string(),
  option_value_id: z.string().optional(),
  color: z.string().optional(),
  image: z.object({
    file_id: z.string(),
    name: z.string(),
    size: z.number(),
    mime_type: z.string(),
    url: z.string(),
  }).optional(),
});

export const deleteOptionValueSchema = z.object({
  id: z.string(),
});
/* END OPTION CONFIG SCHEMAS */

/* START MEDIA TAG SCHEMAS */
export const updateMediaTagSchema = z.object({
  id: z.string(),
  value: z.number().nullable(),
});
/* END MEDIA TAG SCHEMAS */

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
