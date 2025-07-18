// icons
import { Edit3 } from 'lucide-react';
import { ProductQuery } from 'storefrontapi.generated';

// utils
import { getMetaFieldAsBoolean } from '~/utils/metafields';

type CustomizationFormProps = {
  product: NonNullable<ProductQuery['product']>;
};

export const PersonalizationButton = (props: CustomizationFormProps) => {
  const { product } = props;

  const has_customization = getMetaFieldAsBoolean(product, 'has_customization');
  const customization_required = getMetaFieldAsBoolean(product, 'customization_required');

  if (!has_customization) return null;

  return (
    <div>
      <button className="w-full max-w-[500px] border border-soft rounded-none group hover:border-strong cursor-pointer">
        <div className="flex flex-row justify-between items-center bg-pastel-yellow-medium p-2.5 group-hover:bg-pastel-yellow-dark">
          <h3 className="font-inter text-sm font-medium text-primary">
            Add Your Personalization ({customization_required ? 'Required' : 'Optional'})
          </h3>
          <Edit3 size={16} className="text-primary/70 group-hover:text-primary group-hover:scale-110" />
        </div>
      </button>
    </div>
  );
};
