import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaGroupModuleService from "../../../../modules/media-group/service";
import { MEDIA_GROUP_MODULE } from "../../../../modules/media-group";

export type UpdateMediaGroupStepInput = {
  media_groups: {
    id: string;
    media_tag?: string;
  }[];
};

const updateMediaGroupStep = createStep(
  "update-media-group-step",
  async (input: UpdateMediaGroupStepInput, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);

    const mediaGroups = await mediaGroupModuleService.listMediaGroups({ id: input.media_groups.map((o) => o.id) });

    const updatedMediaGroup = await mediaGroupModuleService.updateMediaGroups(
      input.media_groups.map((g) => ({
        id: g.id,
        media_tag: g.media_tag,
      }))
    );

    return new StepResponse(updatedMediaGroup, mediaGroups);
  },
  async (mediaGroups, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);

    if (!mediaGroups) return;

    await mediaGroupModuleService.updateMediaGroups(
      mediaGroups.map((g) => ({
        id: g.id,
        media_tag: g.media_tag,
      }))
    );
  }
);

export default updateMediaGroupStep;
