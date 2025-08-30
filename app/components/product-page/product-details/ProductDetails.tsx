// graphql queries
import { ProductQuery, ProductFragment } from 'storefrontapi.generated';

// types
import { type MappedProductOptions } from '@shopify/hydrogen';

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
    <div className="flex flex-col space-y-8">
      {/* Product Header */}
      <div className="flex flex-col space-y-1">
        <ProductTitle title={product.title} />
        <ProductPrice price={selectedVariant?.price} compareAtPrice={selectedVariant?.compareAtPrice} />
      </div>

      {/* Product Form */}
      <ProductForm metafields={product.metafields} productOptions={productOptions} selectedVariant={selectedVariant} />

      {/* Product Description */}

      {/* More Info Accordion Tabs */}
    </div>
  );
};
