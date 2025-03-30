import { defineLink } from "@medusajs/framework/utils";
import OptionUIModule from "../modules/option-ui";
import ProductModule from "@medusajs/medusa/product";

export default defineLink(
    ProductModule.linkable.productOption,
    {
        linkable: OptionUIModule.linkable.optionUi,
        deleteCascade: false,
    },
);