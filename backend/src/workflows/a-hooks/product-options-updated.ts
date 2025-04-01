// Core Flows
import { deleteFilesWorkflow, updateProductOptionsWorkflow } from "@medusajs/medusa/core-flows";

// Services
import OptionConfigModuleService from "../../modules/option-config/service";

// Module Definitions
import { OPTION_CONFIG_MODULE } from "../../modules/option-config";

// Utils
import { areValuesEqual } from "./utils";

updateProductOptionsWorkflow.hooks.productOptionsUpdated(async ({ product_options }, { container }) => {
  /* ----- START OPTION CONFIG ----- */
  const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);
  const optionConfigs = await optionConfigModuleService.listOptionConfigs(
    { option_id: product_options.map((po) => po.id) },
    { relations: ["option_values", "option_values.image"] }
  );

  for (const optionConfig of optionConfigs) {
    const associatedProductOption = product_options.find((po) => po.id === optionConfig.option_id);
    if (!associatedProductOption) continue;
    const optionValueIDs = optionConfig.option_values.map((ov) => ov.option_value_id);
    const realOptionValueIDs = associatedProductOption.values.map((ov) => ov.id);

    if (!areValuesEqual(optionValueIDs, realOptionValueIDs)) {
      const file_ids: string[] = [];
      const ids: string[] = [];
      for (const optionValue of optionConfig.option_values) {
        if (optionValue.image && "file_id" in optionValue.image) {
          file_ids.push(optionValue.image.file_id);
        }
        ids.push(optionValue.id);
      }

      if (file_ids.length > 0) {
        await deleteFilesWorkflow(container).run({
          input: {
            ids: file_ids,
          },
        });
      }

      await optionConfigModuleService.deleteOptionValues(ids);

      for (const optionValue of associatedProductOption.values) {
        await optionConfigModuleService.createOptionValues({
          option_value_id: optionValue.id,
          option_config_id: optionConfig.id,
        });
      }

      if (optionConfig.option_title !== associatedProductOption.title) {
        await optionConfigModuleService.updateOptionConfigs({
          id: optionConfig.id,
          option_title: associatedProductOption.title,
        });
      }
    }
  }
  /* ----- END OPTION CONFIG ----- */
});
