import { defineLink } from '@medusajs/framework/utils';
import MediaGroupModule from '../modules/media-group';
import ProductModule from '@medusajs/medusa/product';

export default defineLink(
    ProductModule.linkable.product,
    {
        linkable: MediaGroupModule.linkable.mediaGroup,
        isList: true,
        deleteCascade: false,
    }
);