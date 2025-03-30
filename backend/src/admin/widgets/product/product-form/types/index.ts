export type CompleteImage = Exclude<Image, { temp_url: string } | undefined>;

export type Image =
  | {
      id?: string;
      file_id: string;
      name: string;
      size: number;
      mime_type: string;
      url: string;
    }
  | {
      temp_url: string;
      file: File;
    };

export type Field = {
    id?: string;
    uuid: string;
    label?: string;
    description?: string;
    placeholder?: string;
    options?: string[];
    required: boolean;
    input_type: "text" | "textarea" | "dropdown" | "images";

    // for images input type
    max_file_size?: number;
    max_images?: number; 
    image_ratios?: string[]; 

    image: Image | undefined;
};

export type Form = {
    id: string;
    product_id: string;
    name?: string;
    active: boolean;
    fields: Field[];
};

// real types for the product form
import { InferTypeOf } from "@medusajs/framework/types";

import ProductForm from "../../../../../modules/product-form/models/product-form";
import ProductFormField from "../../../../../modules/product-form/models/product-form-field";
import FieldImage from "../../../../../modules/product-form/models/field-image";

export type ProductFormType = InferTypeOf<typeof ProductForm>;
export type ProductFormFieldType = InferTypeOf<typeof ProductFormField>;
export type FieldImageType = InferTypeOf<typeof FieldImage>;
