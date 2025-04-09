"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/shop/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { MediaTag, OptionConfig, ProductForm, VariantMedia } from "types/global"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
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

  const { products, count } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[];
    count: number;
  }>("/store/products", {
    method: "GET",
    query: {
      limit,
      offset,
      region_id: region.id,
      fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      ...queryParams,
    },
    headers,
    next,
    cache: "force-cache",
  });

  const productIds = products.map((p) => p.id);
  const variantIds = products.flatMap((p) => p.variants?.map((v) => v.id) || []);

  const productIdParams = new URLSearchParams();
  productIds.forEach((id) => productIdParams.append("ids[]", id));

  const variantIdParams = new URLSearchParams();
  variantIds.forEach((id) => variantIdParams.append("ids[]", id));

  const [
    { product_forms },
    { product_option_configs },
    { variant_medias },
    { media_tags },
  ] = await Promise.all([
    sdk.client.fetch<{ product_forms: { product_id: string; product_form: ProductForm | null }[] }>(
      `/store/product_form?${productIdParams.toString()}`,
      { method: "GET", next, cache: "force-cache" }
    ),
    sdk.client.fetch<{ product_option_configs: { product_id: string; option_configs: OptionConfig[] | null }[] }>(
      `/store/option_configs?${productIdParams.toString()}`,
      { method: "GET", next, cache: "force-cache" }
    ),
    sdk.client.fetch<{ variant_medias: { variant_id: string; variant_medias: VariantMedia[] | null }[] }>(
      `/store/variant_medias?${variantIdParams.toString()}`,
      { method: "GET", next, cache: "force-cache" }
    ),
    sdk.client.fetch<{ media_tags: { variant_id: string; media_tag: MediaTag | null }[] }>(
      `/store/media_tag?${variantIdParams.toString()}`,
      { method: "GET", next, cache: "force-cache" }
    ),
  ]);

  // Create maps for faster lookup
  const productFormMap = new Map(product_forms.map(({ product_id, product_form }) => [product_id, product_form]));
  const optionConfigMap = new Map(product_option_configs.map(({ product_id, option_configs }) => [product_id, option_configs]));
  const variantMediaMap = new Map(variant_medias.map(({ variant_id, variant_medias }) => [variant_id, variant_medias]));
  const mediaTagMap = new Map(media_tags.map(({ variant_id, media_tag }) => [variant_id, media_tag]));

  // Enrich products
  products.forEach((product: HttpTypes.StoreProduct & { product_form?: ProductForm | null; option_configs?: OptionConfig[] | null }) => {
    product.product_form = productFormMap.get(product.id) ?? null;
    product.option_configs = optionConfigMap.get(product.id) ?? null;

    product.variants?.forEach((variant: HttpTypes.StoreProductVariant & { medias?: VariantMedia[] | null; media_tag?: MediaTag | null }) => {
      variant.medias = variantMediaMap.get(variant.id) ?? null;
      variant.media_tag = mediaTagMap.get(variant.id) ?? null;
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
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
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
