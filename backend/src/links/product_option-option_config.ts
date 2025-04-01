import { defineLink } from "@medusajs/framework/utils";
import OptionUIModule from "../modules/option-config";
import ProductModule from "@medusajs/medusa/product";

export default defineLink(
    ProductModule.linkable.productOption,
    {
        linkable: OptionUIModule.linkable.optionConfig,
        deleteCascade: false,
    },
);