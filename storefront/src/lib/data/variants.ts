"use server"

import { sdk } from "@lib/config"
import { VariantMedia } from "types/global"

// GETS more variant data for specified variant ids
export const getEnrichedVariantData = async (
  product_id: string,
  variant_ids: string[]
) => {
  // Fetch variant inventory + options
  const { product } = await sdk.store.product.retrieve(product_id, {
    fields: `+variants.inventory_quantity,*variants.id,*variants.options`,
  })

  const variants = product.variants?.filter((v) => variant_ids.includes(v.id)) || []

  // Fetch variant media
  const variantIdParams = new URLSearchParams()
  variant_ids.forEach((id) => variantIdParams.append("ids[]", id))

  const variantMediasEndpoint = `/store/variant_medias/trimmed?${variantIdParams.toString()}`

  const { variant_medias } = await sdk.client.fetch<{
    variant_medias: { variant_id: string; variant_medias: VariantMedia[] | null }[]
  }>(variantMediasEndpoint, {
    method: "GET",
    cache: "force-cache",
  })

  const mediaMap = Object.fromEntries(
    variant_medias.map((v) => [v.variant_id, v.variant_medias ?? []])
  )

  // Combine everything
  return variants.map((v) => ({
    variant_id: v.id,
    inventory_quantity: v.inventory_quantity,
    options: v.options,
    medias: mediaMap[v.id] || [],
  }))
}
