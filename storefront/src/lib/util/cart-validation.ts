import { HttpTypes } from "@medusajs/types"
import { EnrichedVariant } from "types/global"

/**
 * Validates cart items to ensure they are available for checkout
 * @param cart - The cart object containing items array
 * @returns Validation result with status and error message if applicable
 */
interface ValidationResult {
  valid: boolean
  error?: string
  unavailableItems?: string[]
}

export const validateCartItems = (
  cart: HttpTypes.StoreCart
): ValidationResult => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return { valid: false, error: "Your cart is empty" }
  }

  const unavailableItems: string[] = []

  // Check each item in the cart
  for (const item of cart.items) {
    const variant = item.variant as EnrichedVariant

    if (!variant) {
      unavailableItems.push(item.title || "Unknown item")
      continue
    }

    // Check availability
    if (
      variant.availability_status === "out_of_stock" ||
      variant.availability_status === "discontinued"
    ) {
      unavailableItems.push(item.title || "Unknown item")
      continue
    }

    // Extra safety check for inventory quantity
    if (
      variant.inventory_quantity === undefined ||
      variant.inventory_quantity <= 0
    ) {
      unavailableItems.push(item.title || "Unknown item")
      continue
    }
  }

  if (unavailableItems.length > 0) {
    return {
      valid: false,
      error: "Some items in your cart are unavailable",
      unavailableItems,
    }
  }

  return { valid: true }
}
