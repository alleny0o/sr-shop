import { model } from "@medusajs/framework/utils";
import OptionConfig from "./option-config";
import OptionImage from "./option-image";

const OptionValue = model
  .define("option_value", {
    id: model.id().primaryKey(),
    option_value_id: model.text().unique(),

    color: model.text().nullable(),

    image: model.hasOne(() => OptionImage, {
      mappedBy: "option_value",
    }),
    
    option_config: model.belongsTo(() => OptionConfig, {
      mappedBy: "option_values",
    }),
  })
  .cascades({
    delete: ["image"],
  });

export default OptionValue;
