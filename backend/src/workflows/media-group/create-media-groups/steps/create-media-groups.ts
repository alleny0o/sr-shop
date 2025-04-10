import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaGroupModuleService from "../../../../modules/media-group/service";
import { MEDIA_GROUP_MODULE } from "../../../../modules/media-group";
import { MediaGroupType } from "../../types";

export type CreateMediaGroupStepInput = {
  uuid: string;
  product_id: string;
  media_tag?: string;
};

export type CreateMediaGroupsStepInput = {
  media_groups: CreateMediaGroupStepInput[];
};

const createMediaGroupsStep = createStep(
  "create-media-groups-step",
  async ({ media_groups }: CreateMediaGroupsStepInput, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);

    const createdMediaGroups: MediaGroupType[] = await mediaGroupModuleService.createMediaGroups(
      media_groups.map((g) => ({
        uuid: g.uuid,
        product_id: g.product_id,
        media_tag: g.media_tag ?? null,
      }))
    );

    return new StepResponse({ media_groups: createdMediaGroups }, { media_groups: createdMediaGroups });
  },
  async ({ media_groups }: { media_groups: MediaGroupType[] }, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);
    if (!media_groups) return;

    await mediaGroupModuleService.deleteMediaGroups(media_groups.map((group) => group.id));
  }
);

export default createMediaGroupsStep;
