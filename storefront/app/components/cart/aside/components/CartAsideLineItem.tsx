import { Image, type OptimisticCartLine } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import { Link } from 'react-router';
import { useAside } from '~/components/aside';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import React from 'react';
import { CartLineRemoveButton } from '../../components/CartLineRemoveButton';
import { CartAsideLineItemPrice } from './CartAsideLineItemPrice';
import { CartLineQuantityAdjustor } from '../../components/CartLineQuantityAdjustor';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export const CartAsideLineItem = ({ line }: { line: CartLine }) => {
  const { id, merchandise, attributes } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();

  // Check if there's personalization data
  const personalizationType = attributes?.find(attr => attr.key === '_Type')?.value;
  const personalizationText = attributes?.find(attr => attr.key === '_Text')?.value;
  const personalizationImage = attributes?.find(attr => attr.key === '_Image')?.value;

  const hasPersonalization = !!(personalizationType && (personalizationText || personalizationImage));

  const liClasses = 'flex flex-col gap-5 py-5 border-b border-soft';

  return (
    <li className={liClasses}>
      {/* Rest of your component remains the same */}
      <div className="flex flex-row gap-4">
        {/* Product Image */}
        <Link prefetch="intent" to={lineItemUrl} onClick={close} className="block">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-none overflow-hidden">
            {image && (
              <Image
                alt={title}
                aspectRatio="1/1"
                data={image}
                className="object-cover w-full h-full"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Product Title & Remove Option */}
            <div className="flex items-center justify-between">
              <h3 className="font-source-serif-4 text-sm font-normal text-primary truncate">{product.title}</h3>
              {line.cost?.totalAmount && <CartAsideLineItemPrice price={line.cost.totalAmount} />}
            </div>

            {/* Product Selected Options */}
            <div className="flex flex-row gap-1 items-center">
              {selectedOptions.map((option, index) => (
                <React.Fragment key={`${product.id}-${option.name}`}>
                  <p className="font-inter text-xs text-secondary">{option.value}</p>
                  {index < selectedOptions.length - 1 && <span className="font-inter text-xs text-secondary">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Quantity & Price Controls */}
          <div className="flex items-center justify-between">
            <CartLineQuantityAdjustor line={line} />
            <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
          </div>
        </div>
      </div>

      {/* Personalization Details - Only show if there's personalization */}
      {hasPersonalization && (
        <div className={`flex flex-col ${personalizationType === 'image' ? 'gap-2' : 'gap-0.5'}`}>
          <p className="font-source-serif-4 text-sm text-primary">Personalization</p>

          {/* Text Personalization */}
          {personalizationType === 'text' && personalizationText && (
            <div className="flex flex-col gap-1">
              <p className="font-inter text-xs text-secondary">Text: {personalizationText}</p>
            </div>
          )}

          {/* Other Personalization */}
          {personalizationType === 'other' && personalizationText && (
            <div className="flex flex-col gap-1">
              <p className="font-inter text-xs text-secondary">Other Request: {personalizationText}</p>
            </div>
          )}

          {/* Image Personalization */}
          {personalizationType === 'image' && personalizationImage && (
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-1 items-center">
                <p className="font-inter text-xs text-secondary">Image:</p>
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-bronze-light">
                  <Image
                    alt="Personalization"
                    src={personalizationImage}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
};
