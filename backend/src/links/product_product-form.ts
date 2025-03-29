import { defineLink } from '@medusajs/framework/utils';
import ProductFormModule from '../modules/product-form';
import ProductModule from '@medusajs/medusa/product';

export default defineLink(
    {
        linkable: ProductModule.linkable.product,
        field: "id",
    },
    {
        linkable: ProductFormModule.linkable.productForm,
        primaryKey: "product_id",
    },
    {
        readOnly: true,
    }
);