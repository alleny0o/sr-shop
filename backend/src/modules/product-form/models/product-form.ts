import { model } from "@medusajs/framework/utils";
import ProductFormField from "./product-form-field";

const ProductForm = model.define("product_form", {
  id: model.id().primaryKey(),
  product_id: model.text().unique(),
  name: model.text().nullable(),
  active: model.boolean().default(false),

  fields: model.hasMany(() => ProductFormField, {
    mappedBy: "product_form",
  }),
}).cascades({
    delete: ["fields"],
});

export default ProductForm;
