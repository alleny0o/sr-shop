import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { OPTION_CONFIG_MODULE } from "../../../../modules/option-config";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { LinkDefinition } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

type CreateRemoteLinkStepInput = {
    product_option_id: string;
    option_config_id: string;
};

const createRemoteLinkStep = createStep(
    'create-link-between-product-option-and-option-config-step',
    async (input: CreateRemoteLinkStepInput, { container }) => {
        const link = container.resolve(ContainerRegistrationKeys.LINK);
        const links: LinkDefinition[] = [];

        links.push({
            [Modules.PRODUCT]: {
                product_option_id: input.product_option_id,
            },
            [OPTION_CONFIG_MODULE]: {
                option_config_id: input.option_config_id,
            },
        });

        link.create(links);

        return new StepResponse(links, links);
    },
    async (links, { container }) => {
        const link = container.resolve(ContainerRegistrationKeys.LINK);

        if (!links || links.length === 0) return;

        await link.dismiss(links);
    },
);

export default createRemoteLinkStep;