"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { HttpTypes } from "@medusajs/types";
import { useParams } from "next/navigation";

// Import server actions
import { retrieveCart, getOrSetCart } from "@/actions/cart";

type CartContextType = {
  cart?: HttpTypes.StoreCart;
  setCart: React.Dispatch<React.SetStateAction<HttpTypes.StoreCart | undefined>>;
  refreshCart: () => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart>();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const countryCode = params.country as string;

  // Define the refreshCart function with useCallback
  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const cartData = await retrieveCart();
      setCart(cartData || undefined);
    } catch (error) {
      console.error("Error refreshing cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cart on mount using an effect
  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        // First try to retrieve existing cart
        let cartData = await retrieveCart();

        // If no cart exists, create one with the country code
        if (!cartData && countryCode) {
          cartData = await getOrSetCart(countryCode);
        }

        if (isMounted && cartData) {
          setCart(cartData);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCart();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [countryCode]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        refreshCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
