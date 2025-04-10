import { model } from "@medusajs/framework/utils";
import MediaGroup from "./media-group";

const Media = model.define("media", {
    id: model.id().primaryKey(),
    file_id: model.text().unique(),
    size: model.number(),
    name: model.text(),
    mime_type: model.text(),
    is_thumbnail: model.boolean().default(false),
    url: model.text(),

    media_group: model.belongsTo(() => MediaGroup, {
        mappedBy: "medias",
    }),
});

export default Media;