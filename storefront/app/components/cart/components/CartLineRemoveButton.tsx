import { CartForm } from '@shopify/hydrogen';
import { getUpdateKey } from '../shared/utils/cartUtils';
import { Trash2 } from 'lucide-react';

export const CartLineRemoveButton = ({ lineIds, disabled }: { lineIds: string[]; disabled: boolean }) => {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-black hover:scale-105 transition-transform disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
      >
        <Trash2 className="w-3.75 h-3.75" strokeWidth={1.25} />
      </button>
    </CartForm>
  );
};
