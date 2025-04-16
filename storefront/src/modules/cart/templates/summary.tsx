"use client"

import { Button, Heading } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import { ErrorModal } from "components/error-modal"
import { validateCartItems } from "@lib/util/cart-validation"
import { refreshCart } from "@lib/util/cart-refresh"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

interface ModalConfig {
  isOpen: boolean
  title: string
  message: string
  buttonText: string
}

function getCheckoutStep(cart: HttpTypes.StoreCart): string {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart: initialCart }: SummaryProps): JSX.Element => {
  // State to track the most up-to-date cart
  const [cart, setCart] = useState<
    HttpTypes.StoreCart & {
      promotions: HttpTypes.StorePromotion[]
    }
  >(initialCart)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const step = getCheckoutStep(cart)
  const router = useRouter()
  const { countryCode } = useParams<{ countryCode: string }>()
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    buttonText: "Continue Shopping",
  })

  const handleCheckoutClick = async (): Promise<void> => {
    setIsLoading(true)

    try {
      // Refresh the cart to get the latest inventory data
      const freshCart = await refreshCart(cart.id)

      if (freshCart) {
        setCart(freshCart)

        // Validate cart with the fresh data
        const validationResult = validateCartItems(freshCart)

        if (!validationResult.valid) {
          // Show error modal if items are unavailable
          setModalConfig({
            isOpen: true,
            title: "Items Unavailable",
            message:
              validationResult.error ||
              "Some items in your cart are unavailable.",
            buttonText: "Continue Shopping",
          })
        } else {
          // Proceed to checkout if validation passes
          router.push(`/${countryCode}/checkout?step=${step}`)
        }
      } else {
        // Handle case where cart couldn't be refreshed
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "Unable to update cart information. Please try again.",
          buttonText: "OK",
        })
      }
    } catch (error) {
      console.error("Error during checkout process:", error)
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
        buttonText: "OK",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = (): void => {
    setModalConfig({
      ...modalConfig,
      isOpen: false,
    })
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />

      {/* Use a regular button instead of a link */}
      <Button
        className="w-full h-10"
        onClick={handleCheckoutClick}
        disabled={isLoading}
        data-testid="checkout-button"
      >
        {isLoading ? "Checking inventory..." : "Go to checkout"}
      </Button>

      {/* Reusable Error Modal */}
      <ErrorModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        buttonText={modalConfig.buttonText}
      />
    </div>
  )
}

export default Summary
