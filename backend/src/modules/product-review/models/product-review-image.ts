import { model } from "@medusajs/framework/utils";
import ProductReview from "./product-review";

const ProductReviewImage = model.define("product_review_image", {
    id: model.id().primaryKey(),
    file_id: model.text().unique(),
    name: model.text(),
    size: model.number(),
    mime_type: model.text(),
    url: model.text(),

    product_review: model.belongsTo(() => ProductReview, {
        mappedBy: "images",
    }),
});

export default ProductReviewImage;