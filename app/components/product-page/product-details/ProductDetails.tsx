// graphql queries
import { ProductQuery } from 'storefrontapi.generated';

// components
import { ProductPrice } from '~/components/product-page/product-details/components/ProductPrice';

type ProductDetailsProps = {
  product: ProductQuery['product'];
  selectedVariant: any;
};

export const ProductDetails = ({ product, selectedVariant }: ProductDetailsProps) => {
  if (!product) return null;
  return (
    <div className="flex flex-col space-y-1">
      <div>
        <h1 className="font-inter text-3xl">{product.title}</h1>
      </div>
      <ProductPrice price={selectedVariant?.price} compareAtPrice={selectedVariant?.compareAtPrice} />
    </div>
  );
};
