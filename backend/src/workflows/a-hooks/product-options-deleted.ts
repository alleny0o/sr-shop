// Core Flows
import { deleteFilesWorkflow, deleteProductOptionsWorkflow } from "@medusajs/medusa/core-flows";

// Services
import OptionConfigModuleService from "../../modules/option-config/service";

// Module Definitions
import { OPTION_CONFIG_MODULE } from "../../modules/option-config";

// Framework Utils
import { LinkDefinition } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

deleteProductOptionsWorkflow.hooks.productOptionsDeleted(async ({ ids }, { container }) => {
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  /* ----- START OPTION CONFIG ----- */
  const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);
  const optionConfigs = await optionConfigModuleService.listOptionConfigs(
    { option_id: ids },
    { relations: ["option_values", "option_values.image"] }
  );

  const option_config_file_ids: string[] = [];
  const option_config_ids: string[] = [];
  const option_config_links: LinkDefinition[] = [];
  for (const optionConfig of optionConfigs) {
    option_config_ids.push(optionConfig.id);
    for (const optionValue of optionConfig.option_values) {
      if (optionValue.image && "file_id" in optionValue.image) {
        option_config_file_ids.push(optionValue.image.file_id);
      }
    }
    option_config_links.push({
      [Modules.PRODUCT]: {
        product_option_id: optionConfig.option_id,
      },
      [OPTION_CONFIG_MODULE]: {
        option_config_id: optionConfig.id,
      },
    });
  }

  if (option_config_file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: option_config_file_ids,
      },
    });
  }

  await optionConfigModuleService.deleteOptionConfigs(option_config_ids);

  await link.dismiss(option_config_links);
  /* ----- END OPTION CONFIG ----- */
});
