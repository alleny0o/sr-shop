import { model } from "@medusajs/framework/utils";

const MediaTag = model.define("media_tag", {
    id: model.id().primaryKey(),
    variant_id: model.text().unique(),
    value: model.number().nullable(),
}).checks([
    (columns) => `${columns.value} >= 1 AND ${columns.value} = FLOOR(${columns.value})`
]);

export default MediaTag;