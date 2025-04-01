import { model } from "@medusajs/framework/utils";
import OptionValue from "./option-value";

const OptionConfig = model.define('option_config', {
    id: model.id().primaryKey(),
    product_id: model.text(),
    option_id: model.text().unique(),
    option_title: model.text(),
    is_selected: model.boolean(),
    display_type: model.enum(["buttons", "dropdown", "colors", "images"]).default("buttons"),
    option_values: model.hasMany(() => OptionValue, {
        mappedBy: "option_config",
    }),
}).cascades({
    delete: ["option_values"],
});

export default OptionConfig;