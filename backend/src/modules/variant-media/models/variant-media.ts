import { model } from "@medusajs/framework/utils";

const VariantMedia = model.define("variant_media", {
    id: model.id().primaryKey(),
    product_id: model.text(),
    variant_id: model.text(),
    file_id: model.text().unique(),
    size: model.number(),
    name: model.text(),
    mime_type: model.text(),
    is_thumbnail: model.boolean().default(false),
    url: model.text(),
});

export default VariantMedia;