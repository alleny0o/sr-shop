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
          <Money data={price} className="text-base sm:text-lg text-primary font-normal" />
          <Money data={compareAtPrice} className="text-sm sm:text-base text-muted line-through font-extralight" />
        </div>
      ) : (
        <Money data={price} className="text-base sm:text-lg text-primary font-normal" />
      )}
    </div>
  );
};
