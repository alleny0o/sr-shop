import { model } from "@medusajs/framework/utils";
import ProductFormField from "./product-form-field";

const FieldImage = model.define("field_image", {
    id: model.id().primaryKey(),
    file_id: model.text().unique(),
    name: model.text(),
    size: model.number(),
    mime_type: model.text(),
    url: model.text(),

    product_form_field: model.belongsTo(() => ProductFormField, {
        mappedBy: "image",
    }),
});

export default FieldImage;