import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartLayout } from '../../CartMain';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useRef } from 'react';
import { FetcherWithComponents } from 'react-router';

type CartAsideFooterProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartAsideFooter({ cart, layout }: CartAsideFooterProps) {
  return (
    <div aria-labelledby="cart-summary" className={`flex flex-col gap-3 p-4 border-t border-soft`}>
      <dl className="flex justify-between items-center font-inter text-base">
        <dt className="font-source-serif-4">Estimated Total</dt>
        <dd>{cart.cost?.totalAmount?.amount ? <Money data={cart.cost?.totalAmount} /> : '-'}</dd>
      </dl>
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl?: string }) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex items-center justify-center bg-primary text-white hover:-translate-y-px transition-transform duration-200 font-inter text-base">
      <a href={checkoutUrl} target="_self" className="flex justify-center items-center h-full w-full p-3 uppercase">
        <p>Checkout</p>
      </a>
    </div>
  );
}

function CartDiscounts({ discountCodes }: { discountCodes?: CartApiQueryFragment['discountCodes'] }) {
  const codes: string[] = discountCodes?.filter(discount => discount.applicable)?.map(({ code }) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({ discountCodes, children }: { discountCodes?: string[]; children: React.ReactNode }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({ giftCardCodes }: { giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined }) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] = giftCardCodes?.map(({ lastCharacters }) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Applied Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button onSubmit={() => removeAppliedCode}>Remove</button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateGiftCardForm giftCardCodes={appliedGiftCardCodes.current} saveAppliedCode={saveAppliedCode}>
        <div>
          <input type="text" name="giftCardCode" placeholder="Gift card code" ref={giftCardCodeInput} />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
