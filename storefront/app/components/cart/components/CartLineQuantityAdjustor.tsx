import { OptimisticCartLine } from '@shopify/hydrogen';
import { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartLineUpdateButton } from './CartLineUpdateButton';
import { Minus, Plus } from 'lucide-react';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

type CartLineQuantityAdjustorProps = {
  line: CartLine;
};

export const CartLineQuantityAdjustor = ({ line }: CartLineQuantityAdjustorProps) => {
  if (!line || typeof line.quantity === 'undefined') return null;

  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number(Math.round(quantity) + 1);

  return (
    <div className="inline-flex items-center border border-soft rounded-md overflow-hidden bg-white">
      <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
        <button
          disabled={quantity <= 1}
          className="w-6.25 h-6.25 flex items-center justify-center text-secondary hover:text-gray-700 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
      </CartLineUpdateButton>

      <div className="px-2 py-0.25 min-w-[1rem] flex items-center justify-center">
        <span className="font-inter text-sm font-normal text-primary">{quantity}</span>
      </div>

      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <button className="w-6.25 h-6.25 flex items-center justify-center text-secondary hover:text-gray-700 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      </CartLineUpdateButton>
    </div>
  );
};
