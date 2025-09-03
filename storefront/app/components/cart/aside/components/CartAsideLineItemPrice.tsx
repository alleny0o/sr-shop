import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';

type CartAsideLineItemPriceProps = {
  price?: MoneyV2;
};

export const CartAsideLineItemPrice = ({ price }: CartAsideLineItemPriceProps) => {
  if (!price) return null;

  return <Money data={price} className="font-inter text-sm font-normal text-primary" />;
};
