import { model } from "@medusajs/framework/utils";
import ProductForm from "./product-form";
import FieldImage from "./field-image";

const ProductFormField = model.define("product_form_field", {
    id: model.id().primaryKey(),
    uuid: model.text().unique(),

    label: model.text().nullable(),
    description: model.text().nullable(),
    placeholder: model.text().nullable(),
    options: model.array().nullable(),
    required: model.boolean().default(false),
    input_type: model.enum(["text", "textarea", "dropdown", "images"]),

    max_file_size: model.number().nullable(),
    max_images: model.number().nullable(),
    image_ratios: model.array().nullable(),

    image: model.hasOne(() => FieldImage, {
        mappedBy: "product_form_field",
    }).nullable(),

    product_form: model.belongsTo(() => ProductForm, {
        mappedBy: "fields",
    }),
}).cascades({
    delete: ["image"],
});

export default ProductFormField;