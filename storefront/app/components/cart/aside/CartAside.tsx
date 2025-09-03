// cart types
import { OptimisticCart } from '@shopify/hydrogen';
import { CartApiQueryFragment } from 'storefrontapi.generated';

// cart components
import { CartAsideEmptyState } from './components/CartAsideEmptyState';
import { CartAsideLineItem } from './components/CartAsideLineItem';
import { CartAsideCTA } from './components/CartAsideCTA';
import { CartAsideSummary } from './components/CartAsideSummary';

type CartAsideProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  linesCount: boolean;
};

export const CartAside = ({ cart, linesCount }: CartAsideProps) => {
  return (
    <div className="w-full h-full">
      {!linesCount && <CartAsideEmptyState />}

      {linesCount && (
        <div className="flex flex-col justify-between gap-10 h-full">
          <div className="flex flex-col gap-5 mx-4">
            <ul>
              {(cart?.lines?.nodes ?? []).map((line, idx) => (
                <CartAsideLineItem key={line.id} line={line} />
              ))}
            </ul>
            <CartAsideCTA text="Your items are waiting - checkout to secure them!" />
          </div>
          <CartAsideSummary cart={cart} />
        </div>
      )}
    </div>
  );
};
