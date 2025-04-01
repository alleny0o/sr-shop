import MediaTagModule from '../modules/media-tag';
import ProductModule from '@medusajs/medusa/product';
import { defineLink } from '@medusajs/framework/utils';

export default defineLink(
    ProductModule.linkable.productVariant,
    {
        linkable: MediaTagModule.linkable.mediaTag,
        deleteCascade: false,
    },
);