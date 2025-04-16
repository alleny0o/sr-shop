import { retrieveCart } from "@lib/data/cart";

/**
 * Refreshes cart data from the server to ensure we have the latest inventory information
 * @param currentCartId - Optional cart ID to refresh (will use session cart ID if not provided)
 * @returns The refreshed cart data or null if not found
 */
export const refreshCart = async (currentCartId?: string): Promise<any> => {
    try {
      const freshCart = await retrieveCart(currentCartId);
      return freshCart;
    } catch (error) {
      console.error("Error refreshing cart:", error);
      return null;
    }
}