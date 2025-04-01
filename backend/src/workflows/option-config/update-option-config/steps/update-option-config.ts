import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionConfigModuleService from "../../../../modules/option-config/service";
import { OPTION_CONFIG_MODULE } from "../../../../modules/option-config";
import { MedusaError } from "@medusajs/framework/utils";

export type UpdateOptionConfigStepInput = {
  id: string;
  option_title?: string;
  display_type?: "buttons" | "dropdown" | "colors" | "images";
  is_selected?: boolean;
};

const updateOptionConfigStep = createStep(
  "update-option-config-step",
  async (input: UpdateOptionConfigStepInput, { container }) => {
    const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);

    const optionConfig = await optionConfigModuleService.retrieveOptionConfig(input.id);
    if (!optionConfig) throw new MedusaError(MedusaError.Types.NOT_FOUND, `Option Config with id ${input.id} not found`);

    const updatePayload: Partial<UpdateOptionConfigStepInput> = {};
    if (input.option_title) updatePayload.option_title = input.option_title;
    if (input.display_type) updatePayload.display_type = input.display_type;
    if (input.is_selected) updatePayload.is_selected = input.is_selected;

    const newOptionConfig = await optionConfigModuleService.updateOptionConfigs({
      id: input.id,
      ...updatePayload,
    });

    return new StepResponse(newOptionConfig, optionConfig);
  },
  async (optionConfig, { container }) => {
    const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);

    if (!optionConfig) return;

    await optionConfigModuleService.updateOptionConfigs({
      id: optionConfig.id,
      option_title: optionConfig.option_title,
      display_type: optionConfig.display_type,
      is_selected: optionConfig.is_selected,
    });
  }
);

export default updateOptionConfigStep;
