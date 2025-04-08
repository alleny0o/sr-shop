export type MediaTag = {
    id: string;
    product_id: string;
    variant_id: string;
    value: number | null;
};

export type Form = {
    value: number | null;
};

import * as z from "zod";

export const mediaTagSchema = z.object({
  value: z
    .union([
      z.number().int().positive("Must be a natural number"),
      z.null(),
    ])
    .optional(),
});

