// cart hooks
import { useOptimisticCart } from '@shopify/hydrogen';

// cart types
import type { CartApiQueryFragment } from 'storefrontapi.generated';

// cart components
import { CartAside } from './aside/CartAside';
import { CartPage } from './page/CartPage';


export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items.
 * It is used by both the /cart route and the cart aside dialog.
 * Note: CartSummary is now handled at the parent level (Aside component)
 */
export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);

  return (
    <>
      {layout === "aside" ? (
        <CartAside cart={cart} linesCount={linesCount} />
      ) : (
        <CartPage cart={cart} linesCount={linesCount} />
      )}
    </>
  );
}
