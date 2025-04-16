"use server"

import { sdk } from "@/lib/config"
import { VariantMedia } from "@/types/global"

// GETS more variant data for specified variant ids
type GetEnrichedVariantData = {
  variant_id: string
  availability_status: "available" | "out_of_stock" | "discontinued" | undefined
  inventory_quantity?: number
  options: any[]
  medias: VariantMedia[]
}

// Define the availability status type to use for type assertions
type AvailabilityStatus = "available" | "out_of_stock" | "discontinued"

export const getEnrichedVariantData = async (
  product_id: string,
  variant_ids: string[]
): Promise<GetEnrichedVariantData[]> => {
  // Step 1: Try to retrieve the product
  let product
  try {
    const res = await sdk.store.product.retrieve(product_id, {
      fields: "+variants.inventory_quantity,*variants.id,*variants.options",
    })
    product = res.product
  } catch (error) {
    console.log(
      `⚠️ Product ${product_id} not found. Marking all associated variants as discontinued.`
    )

    // EXAMPLE: If product_id="prod_123" was deleted and it has variants with variant_ids=["var_456", "var_789"]
    // This will return: [
    //   { variant_id: "var_456", availability_status: "discontinued", ... },
    //   { variant_id: "var_789", availability_status: "discontinued", ... }
    // ]
    return variant_ids.map((id) => ({
      variant_id: id,
      availability_status: "discontinued" as AvailabilityStatus,
      inventory_quantity: 0,
      options: [],
      medias: [],
    }))
  }

  const variants =
    product.variants?.filter((v) => variant_ids.includes(v.id)) || []

  // Check which variants weren't found (might be deleted)
  const foundVariantIds = variants.map((v) => v.id)
  const missingVariantIds = variant_ids.filter(
    (id) => !foundVariantIds.includes(id)
  )

  // Create entries for missing variants
  const missingVariants = missingVariantIds.map((id) => ({
    variant_id: id,
    availability_status: "discontinued" as AvailabilityStatus,
    inventory_quantity: 0,
    options: [],
    medias: [],
  }))

  // Rest of the function to get media, etc.
  const variantIdParams = new URLSearchParams()
  variant_ids.forEach((id) => variantIdParams.append("ids[]", id))

  const variantMediasEndpoint = `/store/variant_medias/trimmed?${variantIdParams.toString()}`
  let variant_medias: {
    variant_id: string
    variant_medias: VariantMedia[] | null
  }[] = []

  try {
    const res = await sdk.client.fetch<{
      variant_medias: {
        variant_id: string
        variant_medias: VariantMedia[] | null
      }[]
    }>(variantMediasEndpoint, {
      method: "GET",
      cache: "force-cache",
    })
    variant_medias = res.variant_medias || []
  } catch (error) {
    console.log(`⚠️ Failed to fetch variant medias for product ${product_id}`)
  }

  // Step 6: Create a map of variant IDs to media data
  const mediaMap = Object.fromEntries(
    variant_medias.map((v) => [v.variant_id, v.variant_medias || []])
  )

  const availableVariants = variants.map((v) => ({
    variant_id: v.id,
    availability_status: (!v.inventory_quantity || v.inventory_quantity <= 0
      ? "out_of_stock"
      : "available") as AvailabilityStatus,
    inventory_quantity: v.inventory_quantity || undefined,
    options: v.options || [],
    medias: mediaMap[v.id] || [],
  }))

  return [...availableVariants, ...missingVariants]
}