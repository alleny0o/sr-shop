import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionConfigModuleService from "../../../../modules/option-config/service";
import { OPTION_CONFIG_MODULE } from "../../../../modules/option-config";

export type DeleteOptionValueStepInput = {
    id: string;
};

const deleteOptionValueStep = createStep(
    'delete-option-value-step',
    async (input: DeleteOptionValueStepInput, { container }) => {
        const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);  
        const optionValue = await optionConfigModuleService.retrieveOptionValue(input.id);
        await optionConfigModuleService.deleteOptionValues(input.id);

        return new StepResponse(optionValue, optionValue);
    },
    async (optionValue, { container }) => {
        const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);   
        if (!optionValue) return;
        await optionConfigModuleService.createOptionValues({
            option_value_id: optionValue.option_value_id,
            color: optionValue.color,
            option_config_id: optionValue.option_config_id,
        });
    },
);

export default deleteOptionValueStep;