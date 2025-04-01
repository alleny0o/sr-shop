import VariantMediaModule from '../modules/variant-media';
import ProductModule from '@medusajs/medusa/product';
import { defineLink } from '@medusajs/framework/utils';

export default defineLink(
    ProductModule.linkable.productVariant,
    {
        linkable: VariantMediaModule.linkable.variantMedia,
        isList: true,
        deleteCascade: false,
    },
);