import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionConfigModuleService from "../../../../modules/option-config/service";
import { OPTION_CONFIG_MODULE } from "../../../../modules/option-config";   

type GetOptionConfigStepInput = {
    product_id: string;
};

const getOptionConfigStep = createStep(
    'get-option-configs-step',
    async (input: GetOptionConfigStepInput, { container }) => {
        const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);   
        
        const optionConfigs = await optionConfigModuleService.listOptionConfigs({
            product_id: input.product_id,
        }, {
            relations: ['option_values', 'option_values.image'],
            order: {
                created_at: 'ASC',
                option_values: {
                    created_at: 'ASC',
                },
            },
        });

        return new StepResponse(optionConfigs);
    },
);

export default getOptionConfigStep;