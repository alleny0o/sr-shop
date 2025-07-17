import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

type ProductPriceProps = {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
};

export const ProductPrice = ({ price, compareAtPrice }: ProductPriceProps) => {
  if (!price) return null;

  const hasDiscount = compareAtPrice && price;

  return (
    <div className="font-inter">
      {hasDiscount ? (
        <div className="flex gap-3 items-center">
          <Money data={price} className="text-base text-black font-light" />
          <Money data={compareAtPrice} className="text-sm text-gray-400 line-through font-light" />
        </div>
      ) : (
        <Money data={price} className="text-base text-black font-light" />
      )}
    </div>
  );
};
