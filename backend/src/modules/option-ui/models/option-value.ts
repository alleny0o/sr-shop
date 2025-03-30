import { model } from "@medusajs/framework/utils";
import OptionUI from "./option-ui";
import OptionImage from "./option-image";

const OptionValue = model
  .define("option_value", {
    id: model.id().primaryKey(),
    option_value_id: model.text().unique(),
    product_variant_id: model.text().nullable(),

    color: model.text().nullable(),
    image: model.hasOne(() => OptionImage, {
      mappedBy: "option_value",
    }),
    
    option_ui: model.belongsTo(() => OptionUI, {
      mappedBy: "option_values",
    }),
  })
  .cascades({
    delete: ["image"],
  });

export default OptionValue;
