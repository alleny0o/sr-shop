"use client"

import { Table, Text, clx, Badge } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/product/components/thumbnail"
import { useState } from "react"
import { EnrichedVariant } from "types/global"
import { useProductOptionsStore } from "stores/useProductOptionsStore"
import { isEqual } from "lodash"
import { useRouter, useParams } from "next/navigation"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem & { 
    // Add optional property for items with discontinued variants
    has_discontinued_variant?: boolean 
  }
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const router = useRouter()
  const { countryCode } = useParams()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cast the variant to our enriched type that includes availability information
  const variant = item.variant as EnrichedVariant | undefined
  
  // ======== AVAILABILITY STATUS LOGIC ========
  
  /**
   * Check for discontinuation in three ways:
   * 1. If variant has discontinued status
   * 2. If item has a has_discontinued_variant flag (for products with deleted variants)
   * 3. If item doesn't have a product reference (product was deleted)
   */
  const isDiscontinued = 
    variant?.availability_status === "discontinued" || 
    item.has_discontinued_variant === true || 
    !item.product
    
  // Item is out of stock if variant exists and has out_of_stock status
  const isOutOfStock = variant?.availability_status === "out_of_stock"
  
  // Item is available only if variant exists with available status
  const isAvailable = variant?.availability_status === "available"
  
  // Product is unavailable if it's discontinued or doesn't have a product reference
  const isProductUnavailable = isDiscontinued || !item.product
  
  // ======== PRODUCT OPTIONS STORE LOGIC ========
  const { setAllOptions, setSelectedVariant, setDontChange } =
    useProductOptionsStore()

  /**
   * Handle click on product thumbnail/title to navigate to product page
   * - Prevents navigation for unavailable products
   * - Sets up product options in the store before navigation
   */
  const handleProductClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault() // Prevent the immediate navigation
    
    // Don't navigate if product is unavailable or deleted
    if (isProductUnavailable) return
    
    // Don't proceed if variant doesn't have options
    if (!variant?.options) return

    // Create a map of option_id to value from the selected variant
    const selectedOptions: Record<string, string> = {}
    variant.options.forEach((opt) => {
      if (opt.option_id) {
        selectedOptions[opt.option_id] = opt.value
      }
    })

    // Store selected options in global state
    setAllOptions(selectedOptions)

    // Find the matching variant from the product's variants
    const matching = item.product?.variants?.find((v) => {
      // Convert variant options to the same format for comparison
      const varOptions = v.options?.reduce((acc: Record<string, string>, o) => {
        if (o.option_id) {
          acc[o.option_id] = o.value
        }
        return acc
      }, {} as Record<string, string>)
      
      // Check if all options match
      return isEqual(varOptions, selectedOptions)
    })
    
    // Store the selected variant in global state
    setSelectedVariant(matching)

    // Flag to prevent automatic option changes on product page
    setDontChange(true)

    // Navigate to product page with country code if available
    router.push(`/${countryCode}/products/${item.product_handle}`)
  }

  /**
   * Handle quantity changes for the item
   * - Updates cart item quantity via API
   * - Manages loading and error states
   */
  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // ======== INVENTORY MANAGEMENT ========
  
  /**
   * Calculate maximum selectable quantity based on:
   * 1. Actual inventory available (from enriched variant data)
   * 2. UI limit of maximum 10 items per line item
   */
  const maxQtyFromInventory = variant?.inventory_quantity || 0
  const maxQuantity = Math.min(maxQtyFromInventory, 10)

  /**
   * Generate appropriate badge based on product availability
   * Returns different badges for:
   * - Discontinued products
   * - Out of stock products
   * - Low stock products (≤ 3 items left)
   */
  const getAvailabilityBadge = () => {
    if (isDiscontinued) {
      return <Badge className="bg-red-100 text-red-700">Discontinued</Badge>
    }
    if (isOutOfStock) {
      return <Badge className="bg-amber-100 text-amber-700">Out of Stock</Badge>
    }
    if (maxQtyFromInventory <= 3 && maxQtyFromInventory > 0) {
      return <Badge className="bg-amber-50 text-amber-700">Low Stock: {maxQtyFromInventory} left</Badge>
    }
    return null
  }

  return (
    <Table.Row 
      // Apply reduced opacity to unavailable items to visually indicate status
      className={clx("w-full", {
        "opacity-60": isDiscontinued || isOutOfStock
      })} 
      data-testid="product-row"
    >
      {/* Product thumbnail cell */}
      <Table.Cell className="!pl-0 p-4 w-24">
        <div
          onClick={handleProductClick}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
            // Change cursor based on product availability
            "cursor-pointer": !isProductUnavailable,
            "cursor-not-allowed": isProductUnavailable
          })}
        >
          <Thumbnail
            thumbnail={
              // Try multiple sources for the thumbnail in order of preference
              variant?.medias?.[0]?.url ??
              item.thumbnail ??
              item.variant?.product?.images?.[0]?.url ??
              null
            }
            size="square"
            // Apply visual treatment to discontinued items
            className={clx({
              "opacity-70 grayscale": isDiscontinued
            })}
          />
        </div>
      </Table.Cell>

      {/* Product info cell */}
      <Table.Cell className="text-left">
        <div className="flex flex-col gap-1">
          <Text
            // Apply visual treatment to product title based on availability
            className={clx("txt-medium-plus", {
              "text-ui-fg-base": !isProductUnavailable,
              "text-ui-fg-subtle line-through": isDiscontinued
            })}
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
          {/* Display variant options if available */}
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
          
          {/* Display availability badge */}
          {getAvailabilityBadge()}
          
          {/* Show explanatory message for discontinued items */}
          {isDiscontinued && (
            <Text className="text-red-600 text-xs">This product is no longer available</Text>
          )}
        </div>
      </Table.Cell>

      {/* Quantity control cell - only in full view */}
      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            {/* Always show delete button */}
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            
            {/* Show quantity selector for available items, static display otherwise */}
            {isAvailable ? (
              <CartItemSelect
                value={item.quantity}
                onChange={(value) => changeQuantity(parseInt(value.target.value))}
                className="w-14 h-10 p-4"
                data-testid="product-select-button"
                disabled={isOutOfStock || isDiscontinued}
              >
                {/* Generate options for quantities up to max available (or 10) */}
                {Array.from(
                  { length: Math.max(Math.min(maxQuantity, 10), 1) }, 
                  (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  )
                )}
              </CartItemSelect>
            ) : (
              // Static quantity display for unavailable items
              <div className="w-14 h-10 flex items-center justify-center text-center">
                {item.quantity}
              </div>
            )}
            
            {/* Show loading spinner during quantity updates */}
            {updating && <Spinner />}
          </div>
          
          {/* Display any error messages */}
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {/* Unit price cell - only in full view */}
      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      {/* Total price cell */}
      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {/* In preview mode, show quantity x unit price */}
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          
          {/* Always show line item total price */}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item