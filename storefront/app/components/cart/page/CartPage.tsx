// cart types
import { OptimisticCart } from '@shopify/hydrogen';
import { CartApiQueryFragment } from 'storefrontapi.generated';

// cart components
import { CartPageEmptyState } from './components/CartPageEmptyState';

type CartPageProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  linesCount: boolean;
};

export const CartPage = ({ cart, linesCount }: CartPageProps) => {
  const itemCount = cart?.totalQuantity || 0;
  return (
    <div className="w-full h-full flex flex-col items-start gap-5">
      <h1 className="font-inter text-3xl">{itemCount > 0 ? `Cart (${itemCount})` : 'Cart'}</h1>

      {!linesCount && <CartPageEmptyState />}

      {linesCount && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gray-300"></div>
        </div>
      )}
    </div>
  );
};
