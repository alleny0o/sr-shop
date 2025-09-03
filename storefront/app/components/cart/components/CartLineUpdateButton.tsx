import { CartForm } from '@shopify/hydrogen';
import { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import { getUpdateKey } from '../shared/utils/cartUtils';
import { useEffect, useState } from 'react';

export const CartLineUpdateButton = ({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) => {
  const lineIds = lines.map(line => line.id);

  const [updating, setUpdating] = useState<boolean>(false);

  return (
    <CartForm fetcherKey={getUpdateKey(lineIds)} route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{ lines }}>
      {fetcher => {
        useEffect(() => {
          if (fetcher.state === 'submitting' || fetcher.state === 'loading') {
            setUpdating(true);
          } else if (fetcher.state === 'idle') {
            setUpdating(false);
          }
        }, [fetcher.state]);

        if (updating) {
          return (
            <div className="relative">
              <div className="opacity-30 pointer-events-none">{children}</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          );
        }

        return children;
      }}
    </CartForm>
  );
};
