import { type MappedProductOptions } from '@shopify/hydrogen';
import type { Maybe, ProductOptionValueSwatch } from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from '../../../buttons/AddToCartButton';
import { useAside } from '../../../Aside';
import type { ProductFragment } from 'storefrontapi.generated';
import { Link, useNavigate } from 'react-router';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const { open } = useAside();

  return (
    <div className="space-y-6">
      {productOptions.map((option, index) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        // Get the selected value name for display
        const selectedValue = option.optionValues.find(v => v.selected)?.name || '';

        return (
          <div key={option.name}>
            {/* Option Header */}
            <div className="flex flex-row space-x-2 mb-3.5">
              <h3 className="text-sm font-medium text-primary font-inter">{option.name}:</h3>
              <p className="text-sm text-secondary font-inter">{selectedValue}</p>
            </div>

            {/* Option Values */}
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map(value => {
                const { name, handle, variantUriQuery, selected, available, exists, isDifferentProduct, swatch } =
                  value;

                // Determine the type for this specific value
                const isImageValue = swatch?.image?.previewImage?.url;
                const isColorValue = swatch?.color;

                const baseClasses = `
                  transition-all duration-150 ease-in-out font-inter relative cursor-pointer group
                `.trim();

                const colorClasses = `
                  ${baseClasses}
                  w-9 h-9 rounded-full border-1 flex items-center justify-center
                  ${selected ? 'border-strong hover:border-strong' : 'border-soft hover:border-strong'}
                `.trim();

                const imageClasses = `
                  ${baseClasses}
                  w-14 h-14 rounded-none border-1 overflow-hidden
                  ${selected ? 'border-strong hover:border-strong' : 'border-soft hover:border-strong'}
                `.trim();

                const defaultClasses = `
                  ${baseClasses}
                  px-3 py-2 text-sm font-light text-center font-inter
                  ${
                    selected
                      ? 'text-primary border-1 border-strong hover:border-strong'
                      : 'text-primary border-1 border-soft hover:border-strong'
                  }
                `.trim();

                // Choose classes based on value type
                const valueClasses = isImageValue ? imageClasses : isColorValue ? colorClasses : defaultClasses;

                if (isDifferentProduct) {
                  return (
                    <Link
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      className={valueClasses}
                      title={name}
                    >
                      <ProductOptionSwatch
                        swatch={swatch}
                        name={name}
                        isColor={!!isColorValue}
                        isImage={!!isImageValue}
                        available={available}
                        selected={selected}
                      />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      key={option.name + name}
                      className={valueClasses}
                      disabled={false}
                      title={name}
                      onClick={() => {
                        if (!selected && exists) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch
                        swatch={swatch}
                        name={name}
                        isColor={!!isColorValue}
                        isImage={!!isImageValue}
                        available={available}
                        selected={selected}
                      />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
  isColor = false,
  isImage = false,
  available = true,
  selected = false,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
  isColor?: boolean;
  isImage?: boolean;
  available?: boolean;
  selected?: boolean;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (isImage && image) {
    return (
      <div className="relative w-full h-full">
        <img src={image} alt={name} className="w-full h-full object-cover !rounded-none" />
        {!available && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div
              className={`w-full h-[1px] transform rotate-45 transition-colors duration-150 ${selected ? 'bg-strong' : 'bg-soft group-hover:bg-strong group-active:bg-strong'}`}
            ></div>
          </div>
        )}
      </div>
    );
  }

  if (isColor && color) {
    return (
      <div className="relative w-full h-full rounded-full flex items-center justify-center">
        <div className="w-7 h-7 rounded-full" style={{ backgroundColor: color }} aria-label={name} />
        {!available && (
          <div className="absolute inset-0 bg-white/50 rounded-full flex items-center justify-center">
            <div
              className={`w-full h-[1px] transform rotate-45 transition-colors duration-150 ${selected ? 'bg-strong' : 'bg-soft group-hover:bg-strong group-active:bg-strong'}`}
            ></div>
          </div>
        )}
      </div>
    );
  }

  // For non-color, non-image options, just return the name with overlay
  return (
    <div className="relative w-full h-full">
      <span className={`block ${!available ? 'line-through opacity-50' : ''}`}>
        {name}
      </span>
    </div>
  );
}
