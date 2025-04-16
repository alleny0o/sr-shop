"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { useProductOptionsStore } from "providers/product-options"
import { HttpTypes } from "@medusajs/types"
import { Button, Divider } from "@medusajs/ui"
import OptionSelect from "@modules/product/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { EnrichedProduct, EnrichedVariant } from "types/global"

type ProductActionsProps = {
  product: EnrichedProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (variantOptions: EnrichedVariant["options"]) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const {
    options,
    setOption,
    setAllOptions,
    selectedVariant,
    setSelectedVariant,
    resetOptions,
    dontChange,
    setDontChange,
  } = useProductOptionsStore()

  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  useEffect(() => {
    if (Object.keys(options).length > 0 && dontChange) {
      setDontChange(false)
      return
    }

    resetOptions()

    if (product.options && product.options.length > 0) {
      const newOptions: Record<string, string> = {}

      product.options.forEach((option) => {
        if (option.is_selected && option.values.length > 0) {
          newOptions[option.id] = option.values[0].value
        }
      })

      setAllOptions(newOptions)
    }

    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setAllOptions(variantOptions ?? {})
      setSelectedVariant(product.variants[0])
    }
  }, [
    product.variants,
    product.id,
    resetOptions,
    setAllOptions,
    setSelectedVariant,
  ])

  // Update selected variant based on current options
  useEffect(() => {
    if (!product.variants || product.variants.length === 0) return

    const matching = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })

    setSelectedVariant(matching)
  }, [product.variants, options, setSelectedVariant])

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const inStock = useMemo(() => {
    if ((selectedVariant && selectedVariant.calculated_price && selectedVariant.manage_inventory && selectedVariant?.inventory_quantity) || 0 > 0)
      return true
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    setDontChange(true)
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <Divider />
      <div className="flex flex-col" ref={actionsRef}>
        <div className="py-[54px]">
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOption}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant
            ? "Add to cart"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>

        {/* <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOption}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        /> */}
      </div>
    </>
  )
}
