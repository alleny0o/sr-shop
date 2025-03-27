import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreateVariantMediaInput } from "./create-variant-medias";
import { VARIANT_MEDIA_MODULE } from "../../../../modules/variant-media";
import { LinkDefinition } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export type CreateLinkStepInput = {
  variant_medias: (CreateVariantMediaInput & { id: string })[];
};

const createRemoteLinkStep = createStep(
  "create-variant-medias-remote-link-step",
  async ({ variant_medias }: CreateLinkStepInput, { container }) => {
    const link = container.resolve(ContainerRegistrationKeys.LINK);
    const links: LinkDefinition[] = [];

    for (const vm of variant_medias) {
      links.push({
        [Modules.PRODUCT]: {
          product_variant_id: vm.variant_id,
        },
        [VARIANT_MEDIA_MODULE]: {
          variant_media_id: vm.id,
        },
      });
    }

    await link.create(links);

    return new StepResponse(links, links);
  },
  async (links: LinkDefinition[], { container }) => {
    const link = container.resolve(ContainerRegistrationKeys.LINK);
    await link.dismiss(links);
  }
);

export default createRemoteLinkStep;
