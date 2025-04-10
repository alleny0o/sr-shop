import { model } from "@medusajs/framework/utils";
import Media from "./media";

const MediaGroup = model.define("media_group", {
    id: model.id().primaryKey(),
    uuid: model.text().unique(),
    product_id: model.text(),
    media_tag: model.text(),
    medias: model.hasMany(() => Media, {
        mappedBy: "media_group",
    }),
}).cascades({
    delete: ["medias"],
});

export default MediaGroup;