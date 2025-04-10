import { defineLink } from '@medusajs/framework/utils';
import ProductFormModule from '../modules/product-form';
import ProductModule from '@medusajs/medusa/product';

export default defineLink(
    ProductModule.linkable.product,
    {
        linkable: ProductFormModule.linkable.productForm,
        deleteCascade: false,
    }
);