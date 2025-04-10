import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MediaGroupModuleService from "../../../../modules/media-group/service";
import { MEDIA_GROUP_MODULE } from "../../../../modules/media-group";
import { MediaGroupType } from "../../types";

export type DeleteMediaGroupsStepInput = {
  media_group_ids: string[];
};

const deleteMediaGroupsStep = createStep(
  "delete-media-groups-step",
  async ({ media_group_ids }: DeleteMediaGroupsStepInput, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);

    const mediaGroupsToDelete = await mediaGroupModuleService.listMediaGroups(
      {
        id: media_group_ids,
      },
      { relations: ["medias"] }
    );

    await mediaGroupModuleService.deleteMediaGroups(media_group_ids);

    return new StepResponse(
      {
        deleted_media_groups: mediaGroupsToDelete,
      },
      {
        deleted_media_groups: mediaGroupsToDelete,
      }
    );
  },
  async ({ deleted_media_groups }: { deleted_media_groups: MediaGroupType[] }, { container }) => {
    const mediaGroupModuleService: MediaGroupModuleService = container.resolve(MEDIA_GROUP_MODULE);
  
    const createdMediaGroups = await mediaGroupModuleService.createMediaGroups(
      deleted_media_groups.map((group) => ({
        uuid: group.uuid,
        product_id: group.product_id,
        media_tag: group.media_tag,
      }))
    );
  
    // Re-associate medias from deleted -> recreated
    const uuidToMediasMap = new Map(deleted_media_groups.map((g) => [g.uuid, g.medias]));
  
    const mediaItemsToCreate = createdMediaGroups.flatMap((group) => {
      const medias = uuidToMediasMap.get(group.uuid) ?? [];
      return medias.map((media) => ({
        ...media,
        media_group_id: group.id,
      }));
    });
  
    await mediaGroupModuleService.createMediaItems(mediaItemsToCreate.map((media) => ({
        file_id: media.file_id,
        size: media.size,
        name: media.name,
        mime_type: media.mime_type,
        is_thumbnail: media.is_thumbnail,
        url: media.url,
        media_group_id: media.media_group_id,
    })));
  }
  
);

export default deleteMediaGroupsStep;