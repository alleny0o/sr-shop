import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionConfigModuleService from "../../../../modules/option-config/service";
import { OPTION_CONFIG_MODULE } from "../../../../modules/option-config";

type CreateOptionConfigStepInput = {
    product_id: string;
    option_id: string;
    option_title: string;
    is_selected: boolean;
};

const createOptionConfigStep = createStep(
    'create-option-config-step',
    async (input: CreateOptionConfigStepInput, { container }) => {
        const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);

        const optionConfig = await optionConfigModuleService.createOptionConfigs({
            product_id: input.product_id,
            option_id: input.option_id,
            option_title: input.option_title,
            display_type: "buttons",
            is_selected: input.is_selected,
        });

        return new StepResponse(optionConfig, optionConfig);
    },
    async (optionConfig, { container }) => {
        const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);

        if (!optionConfig) return;

        await optionConfigModuleService.deleteOptionConfigs(optionConfig.id);
    },
);

export default createOptionConfigStep;