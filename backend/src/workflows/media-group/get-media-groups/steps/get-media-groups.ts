import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaGroupModuleService from "../../../../modules/media-group/service";
import { MEDIA_GROUP_MODULE } from "../../../../modules/media-group";
import { MediaGroupType } from "../../types";

export type GetMediaGroupsStepInput = {
  product_id: string;
};

const getMediaGroupsStep = createStep("get-media-groups-step", async ({ product_id }: GetMediaGroupsStepInput, { container }) => {
  const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);

  const mediaGroups: MediaGroupType[] = await mediaGroupModuleService.listMediaGroups(
    {
      product_id: product_id,
    },
    {
      relations: ["medias"],
      order: {
        created_at: "ASC",
      },
    }
  );

  return new StepResponse(mediaGroups);
});

export default getMediaGroupsStep;
