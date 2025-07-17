// graphql queries
import { ProductQuery, ProductFragment } from 'storefrontapi.generated';

// types
import {type MappedProductOptions} from '@shopify/hydrogen';

// components
import { ProductTitle } from './components/ProductTitle';
import { ProductPrice } from './components/ProductPrice';
import { ProductForm } from './components/ProductForm';

type ProductDetailsProps = {
  product: ProductQuery['product'];
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
};

export const ProductDetails = ({ product, productOptions, selectedVariant }: ProductDetailsProps) => {
  if (!product) return null;
  return (
    <div className="flex flex-col space-y-3">
      {/* Product Header */}
      <ProductTitle title={product.title} />

      {/* Product Price */}
      <ProductPrice price={selectedVariant?.price} compareAtPrice={selectedVariant?.compareAtPrice} />
    </div>
  );
};
