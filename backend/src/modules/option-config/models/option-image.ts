import { model } from "@medusajs/framework/utils";
import OptionValue from "./option-value";

const OptionImage = model.define('option_image', {
    id: model.id().primaryKey(),
    file_id: model.text().unique(),
    name: model.text(),
    size: model.number(),
    mime_type: model.text(),
    url: model.text(),
    option_value: model.belongsTo(() => OptionValue, {
        mappedBy: "image",
    }),
});

export default OptionImage;