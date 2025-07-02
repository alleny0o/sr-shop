import { Suspense } from 'react';
import { Await, useAsyncValue } from 'react-router';
import { ShoppingBasket } from 'lucide-react';
import { useAside } from '~/components/Aside';
import { useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

export function CartToggle({ cart }: { cart: Promise<CartApiQueryFragment | null> }) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function CartBadge({ count }: { count: number | null }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <button
      className="relative p-1 transition-all duration-200"
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      aria-label="View cart"
    >
      <ShoppingBasket className="w-6 h-6" strokeWidth={1} />
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-brand-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
