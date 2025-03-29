import { defineLink } from "@medusajs/framework/utils";
import ProductReviewModule from "../modules/product-review";
import CustomerModule from "@medusajs/medusa/customer";

export default defineLink(
  {
    linkable: ProductReviewModule.linkable.productReview,
    field: "customer_id",
    isList: false,
  },
  CustomerModule.linkable.customer,
  {
    readOnly: true,
  }
);
