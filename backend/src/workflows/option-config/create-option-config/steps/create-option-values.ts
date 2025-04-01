import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionConfigModuleService from "../../../../modules/option-config/service";
import { OPTION_CONFIG_MODULE } from "../../../../modules/option-config";

type CreateOptionValueStepInput = {
  option_config_id: string;
  option_value_ids: string[];
};

const createOptionValuesStep = createStep(
  "create-option-values-step",
  async (input: CreateOptionValueStepInput, { container }) => {
    const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);

    const optionValues: { option_config_id: string; option_value_id: string }[] = [];
    for (const optionValueId of input.option_value_ids) {
      optionValues.push({
        option_config_id: input.option_config_id,
        option_value_id: optionValueId,
      });
    }

    const createdOptionValues = await optionConfigModuleService.createOptionValues(optionValues);

    return new StepResponse(createdOptionValues, createdOptionValues);
  },
  async (createdOptionValues, { container }) => {
    const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);

    if (!createdOptionValues) return;

    await optionConfigModuleService.deleteOptionValues(createdOptionValues);
  },
);

export default createOptionValuesStep;