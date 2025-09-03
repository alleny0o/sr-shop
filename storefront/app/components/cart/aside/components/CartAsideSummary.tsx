import { Money, OptimisticCart } from '@shopify/hydrogen';
import { CartApiQueryFragment } from 'storefrontapi.generated';

type CartAsideSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
};

export const CartAsideSummary = ({ cart }: CartAsideSummaryProps) => {
  return (
    <div className="font-inter text-sm text-gray-800">
      <div className="flex flex-col gap-0">
        <div className="bg-gray-300 flex flex-row justify-between items-center px-4 py-1.5">
          <span>Subtotal</span>
          {cart.cost?.subtotalAmount?.amount ? <Money data={cart.cost?.subtotalAmount} /> : '-'}
        </div>
        <div className="bg-gray-200 flex flex-row justify-between items-center px-4 py-1.5">
          <span>Shipping</span>
          <span>-</span>
        </div>
        <div className="bg-gray-100 flex flex-row justify-between items-center px-4 py-1.5">
          <span>Tax</span>
          {cart.cost?.totalTaxAmount?.amount ? <Money data={cart.cost?.totalTaxAmount} /> : '-'}
        </div>
      </div>
    </div>
  );
};
