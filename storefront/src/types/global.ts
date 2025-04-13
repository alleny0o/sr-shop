import { HttpTypes, StorePrice } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

// Types For My Extensions
export type VariantMedia = {
  id: string
  url: string
  mime_type: string
  is_thumbnail: boolean
  name: string
}

export type MediaTag = {
  id: string
  product_id: string
  variant_id: string
  value: number | null
}

export type ProductForm = {
  id: string
  name: string
  active: boolean
  fields: ProductFormField[]
}

export type ProductFormField = {
  id: string
  label: string
  description: string
  placeholder: string
  input_type: string
  max_images: number | null
  max_file_size: number | null
  image_ratios: string[] | null
  required: boolean
  options: string[] | null
  image: ProductFormFieldImage | null
}

export type ProductFormFieldImage = {
  id: string
  file_id: string
  url: string
  mime_type: string
  name: string
  size: number
}

export type OptionConfig = {
  id: string
  option_id: string
  option_title: string
  display_type: string
  is_selected: boolean
  option_values: OptionConfigValue[]
}

export type OptionConfigValue = {
  id: string
  option_value_id: string
  color: string | null
  image: OptionConfigValueImage | null
}

export type OptionConfigValueImage = {
  id: string
  url: string
}

export type EnrichedVariant = HttpTypes.StoreProductVariant & {
  medias?: VariantMedia[] | null;
  media_tag?: MediaTag | null;
  availability_status?: "discontinued" | "available" | "out_of_stock";
};

export type EnrichedOption = Omit<HttpTypes.StoreProductOption, 'values'> & {
  values: EnrichedOptionValue[];
  is_selected?: boolean;
  display_type?: string;
};

export type EnrichedOptionValue = HttpTypes.StoreProductOptionValue & {
  config?: OptionConfigValue | null;
}

export type EnrichedProduct = Omit<HttpTypes.StoreProduct, 'variants' | 'options'> & {
  product_form?: ProductForm | null;
  variants: EnrichedVariant[] | null; 
  options: EnrichedOption[] | null;
};

export type StoreCartLineItemWithUnavailable = HttpTypes.StoreCartLineItem & {
  _unavailable?: boolean
};