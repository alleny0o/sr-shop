import { model } from "@medusajs/framework/utils";
import ProductReviewImage from "./product-review-image";

const ProductReview = model
  .define("product_review", {
    id: model.id().primaryKey(),
    title: model.text().nullable(),
    content: model.text(),
    rating: model.float(),
    recommend: model.boolean(),
    first_name: model.text(),
    last_name: model.text(),
    status: model.enum(["pending", "approved", "rejected"]).default("pending"),
    product_id: model.text().index("IDX_REVIEW_PRODUCT_ID"),
    customer_id: model.text().nullable(),

    images: model.hasMany(() => ProductReviewImage, {
      mappedBy: "product_review",
    }),
  })
  .checks([
    {
      name: "rating_range",
      expression: (columns) => `${columns.rating} >= 1 AND ${columns.rating} <= 5`,
    },
  ])
  .cascades({
    delete: ["images"],
  });

export default ProductReview;
