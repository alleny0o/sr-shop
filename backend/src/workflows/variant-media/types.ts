import { InferTypeOf } from "@medusajs/framework/types";
import VariantMedia from "../../modules/variant-media/models/variant-media";

export type VariantMediaType = InferTypeOf<typeof VariantMedia>;