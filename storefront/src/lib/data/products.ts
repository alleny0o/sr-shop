"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/shop/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { MediaTag, OptionConfig, ProductForm, VariantMedia, EnrichedProduct, EnrichedVariant, EnrichedOption, EnrichedOptionValue } from "types/global"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  trimmed = false,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
  trimmed: boolean
}): Promise<{
  response: { products: EnrichedProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams;
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  const { products, count }: { products: EnrichedProduct[], count: number } = await sdk.client.fetch<{
    products: EnrichedProduct[];
    count: number;
  }>("/store/products", {
    method: "GET",
    query: {
      limit,
      offset,
      region_id: region.id,
      fields: `*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags`,
      ...queryParams,
    },
    headers,
    next,
    cache: "force-cache",
  });

  // Early return if no products were found
  if (!products.length) {
    return {
      response: { 
        products: [], 
        count: 0,
      },
      nextPage: null,
      queryParams,
    }
  }

  const productIds = products.map((p) => p.id);
  const variantIds = products.flatMap((p) => p.variants?.map((v) => v.id) || []);

  // Skip additional API calls if we don't have any product IDs or variant IDs
  if (productIds.length === 0 && variantIds.length === 0) {
    return {
      response: {
        products,
        count,
      },
      nextPage: count > offset + limit ? pageParam + 1 : null,
      queryParams,
    }
  }

  const productIdParams = new URLSearchParams();
  productIds.forEach((id) => productIdParams.append("ids[]", id));

  const variantIdParams = new URLSearchParams();
  variantIds.forEach((id) => variantIdParams.append("ids[]", id));

  // Define types for our API responses
  type ProductFormsResponse = { 
    product_forms: { product_id: string; product_form: ProductForm | null }[] 
  };
  
  type VariantMediasResponse = { 
    variant_medias: { variant_id: string; variant_medias: VariantMedia[] | null }[] 
  };
  
  type MediaTagsResponse = { 
    media_tags: { variant_id: string; media_tag: MediaTag | null }[] 
  };

  // Default empty responses
  let productFormsResponse: ProductFormsResponse = { product_forms: [] };
  let variantMediasResponse: VariantMediasResponse = { variant_medias: [] };
  let mediaTagsResponse: MediaTagsResponse = { media_tags: [] };

  // Perform the API calls based on conditions
  if (productIds.length > 0) {
    productFormsResponse = await sdk.client.fetch<ProductFormsResponse>(
      `/store/product_form?${productIdParams.toString()}`,
      { method: "GET", next, cache: "force-cache" }
    );
  }

  if (variantIds.length > 0) {
    const variantMediasEndpoint = trimmed
      ? `/store/variant_medias/trimmed?${variantIdParams.toString()}`
      : `/store/variant_medias?${variantIdParams.toString()}`;
      
    // Execute these fetches in parallel if we have variant IDs
    [variantMediasResponse, mediaTagsResponse] = await Promise.all([
      sdk.client.fetch<VariantMediasResponse>(
        variantMediasEndpoint,
        { method: "GET", next, cache: "force-cache" }
      ),
      sdk.client.fetch<MediaTagsResponse>(
        `/store/media_tag?${variantIdParams.toString()}`,
        { method: "GET", next, cache: "force-cache" }
      )
    ]);
  }

  // Extract the data we need
  const { product_forms } = productFormsResponse;
  const { variant_medias } = variantMediasResponse;
  const { media_tags } = mediaTagsResponse;

  // Only fetch option configs if we have product IDs
  let option_configs: OptionConfig[] = [];
  if (productIds.length > 0) {
    const res = await sdk.client.fetch<{ option_configs: OptionConfig[] | null }>(
      `/store/option_configs?${productIdParams.toString()}`,
      { method: "GET", next, cache: "force-cache" }
    );
    option_configs = res.option_configs || [];
  }

  // Create maps for faster lookup
  const productFormMap = new Map(product_forms.map(({ product_id, product_form }) => [product_id, product_form]));
  const variantMediaMap = new Map(variant_medias.map(({ variant_id, variant_medias }) => [variant_id, variant_medias]));
  const mediaTagMap = new Map(media_tags.map(({ variant_id, media_tag }) => [variant_id, media_tag]));

  // Enrich products
  products.forEach((product: EnrichedProduct) => {
    product.product_form = productFormMap.get(product.id) ?? null;

    product.variants?.forEach((variant: EnrichedVariant) => {
      variant.medias = variantMediaMap.get(variant.id) ?? null;
      variant.media_tag = mediaTagMap.get(variant.id) ?? null;
    });

    product.options?.forEach((option: EnrichedOption) => {
      const option_config = option_configs.find((config) => config.option_id === option.id);
      option.is_selected = option_config?.is_selected ?? false;
      option.display_type = option_config?.display_type ?? "dropdown";
      option.values?.forEach((value: EnrichedOptionValue) => {
        const option_values = option_configs?.flatMap((option_config) => option_config.option_values);
        const option_value = option_values?.find((option_value) => option_value.option_value_id === value.id);
        if (option_value) {
          value.config = option_value;
        }
      });
    });
  });

  const nextPage = count > offset + limit ? pageParam + 1 : null

  return {
    response: {
      products,
      count,
    },
    nextPage,
    queryParams,
  }
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  trimmed = false,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
  trimmed: boolean
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
    trimmed,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
