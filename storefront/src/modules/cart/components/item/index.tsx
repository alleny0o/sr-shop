"use client"

import { Table, Text, clx } from "@medusajs/ui"
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
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const router = useRouter()
  const { countryCode } = useParams()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const variant = item.variant as EnrichedVariant | undefined

  const { setAllOptions, setSelectedVariant, setDontChange } =
    useProductOptionsStore()

  const handleProductClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault() // Prevent the immediate navigation
    if (!variant?.options) return

    // Set the selected options
    const selectedOptions: Record<string, string> = {}
    variant.options.forEach((opt) => {
      if (opt.option_id) {
        selectedOptions[opt.option_id] = opt.value
      }
    })

    setAllOptions(selectedOptions)

    // Find the matching variant and update state
    const matching = item.product?.variants?.find((v) => {
      const varOptions = v.options?.reduce((acc: Record<string, string>, o) => {
        if (o.option_id) {
          acc[o.option_id] = o.value
        }
        return acc
      }, {} as Record<string, string>)
      return isEqual(varOptions, selectedOptions)
    })
    setSelectedVariant(matching)

    setDontChange(true)

    // Perform client-side navigation, using the countryCode if it exists
    router.push(`/${countryCode ?? ""}/products/${item.product_handle}`)
  }

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

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = variant?.inventory_quantity || 0
  const maxQuantity = Math.min(maxQtyFromInventory, 10)

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <div
          onClick={handleProductClick}
          className={clx("flex cursor-pointer", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={
              variant?.medias?.[0]?.url ??
              item.thumbnail ??
              item.variant?.product?.images?.[0]?.url ??
              null
            }
            size="square"
          />
        </div>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-4"
              data-testid="product-select-button"
            >
              {/* TODO: Update this with the v2 way of managing inventory */}
              {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
                <option value={i + 1} key={i}>
                  {i + 1}
                </option>
              ))}
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
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
