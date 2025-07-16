import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({ price, compareAtPrice }: { price?: MoneyV2; compareAtPrice?: MoneyV2 | null }) {
  return (
    <div className="font-inter">
      {compareAtPrice && price ? (
        <div className="flex gap-2 items-center">
          <Money data={price} className="text-black" />
          <Money data={compareAtPrice} className="text-gray-400 line-through text-sm font-light" />
        </div>
      ) : price ? (
        <Money data={price} className="text-black font font-inter" />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
