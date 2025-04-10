import { model } from "@medusajs/framework/utils";
import MediaItem from "./media-item";

const MediaGroup = model.define("media_group", {
    id: model.id().primaryKey(),
    uuid: model.text().unique(),
    product_id: model.text(),
    media_tag: model.text().nullable(),
    medias: model.hasMany(() => MediaItem, {
        mappedBy: "media_group",
    }),
}).cascades({
    delete: ["medias"],
});

export default MediaGroup;