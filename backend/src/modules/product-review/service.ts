import { MedusaService } from "@medusajs/framework/utils";
import ProductReview from "./models/product-review";
import ProductReviewImage from "./models/product-review-image";

class ProductReviewModuleService extends MedusaService({
  ProductReview,
  ProductReviewImage,
}) {}

export default ProductReviewModuleService;
