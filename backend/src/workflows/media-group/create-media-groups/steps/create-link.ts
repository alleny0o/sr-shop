import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { MEDIA_GROUP_MODULE } from "../../../../modules/media-group";
import { LinkDefinition } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { MediaGroupType } from "../../types";

export type CreateLinkStepInput = {
    media_groups: MediaGroupType[]
};

const createRemoteLinkStep = createStep(
    'create-media-groups-remote-link-step',
    async ({ media_groups }: CreateLinkStepInput, { container }) => {
        const link = container.resolve(ContainerRegistrationKeys.LINK);
        const links: LinkDefinition[] = [];

        for (const media_group of media_groups) {
            links.push({
                [Modules.PRODUCT]: {
                    media_group_id: media_group.product_id,
                },
                [MEDIA_GROUP_MODULE]: {
                    media_group_id: media_group.id,
                },
            });
        };

        await link.create(links);

        return new StepResponse(links, links);
    },
    async (links: LinkDefinition[], { container }) => {
        const link = container.resolve(ContainerRegistrationKeys.LINK);
        await link.dismiss(links);
    },
);

export default createRemoteLinkStep;