import { model } from "@medusajs/framework/utils";
import OptionValue from "./option-value";

const OptionUI = model.define('option_ui', {
    id: model.id().primaryKey(),
    product_id: model.text(),
    option_id: model.text().unique(),
    option_title: model.text(),
    display_type: model.enum(["buttons", "dropdown", "colors", "images"]).default("buttons"),
    option_values: model.hasMany(() => OptionValue, {
        mappedBy: "option_ui",
    }),
}).cascades({
    delete: ["option_values"],
});

export default OptionUI;