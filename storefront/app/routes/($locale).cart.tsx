import {type MetaFunction, useLoaderData} from 'react-router';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {
  data,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  type HeadersFunction,
} from '@shopify/remix-oxygen';
import { CartMain } from '~/components/cart/CartMain';

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;
  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];
      giftCardCodes.push(...inputs.giftCardCodes);
      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  // Clean up zero-quantity items after add/update operations
  if (action === CartForm.ACTIONS.LinesAdd || action === CartForm.ACTIONS.LinesUpdate) {
    // Get fresh cart data - this await ensures we get the real current state
    const freshCart = await cart.get();
    
    if (freshCart?.lines?.nodes) {
      const zeroQuantityLineIds = freshCart.lines.nodes
        .filter((line: any) => line.quantity === 0)
        .map((line: any) => line.id);
      
      if (zeroQuantityLineIds.length > 0) {
        console.log('Removing zero-quantity items:', zeroQuantityLineIds);
        result = await cart.removeLines(zeroQuantityLineIds);
      }
    }
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart} = context;
  const cartData = await cart.get();
  
  // Safety net: clean up any zero-quantity items on cart load
  if (cartData?.lines?.nodes) {
    const zeroQuantityLineIds = cartData.lines.nodes
      .filter((line: any) => line.quantity === 0)
      .map((line: any) => line.id);
    
    if (zeroQuantityLineIds.length > 0) {
      console.log('Cleaning zero-quantity items on load');
      const cleaned = await cart.removeLines(zeroQuantityLineIds);
      return cleaned.cart || cartData;
    }
  }
  
  return cartData;
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();

  return (
    <div className="cart bg-white min-h-screen max-w-10xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <CartMain layout="page" cart={cart} />
    </div>
  );
}