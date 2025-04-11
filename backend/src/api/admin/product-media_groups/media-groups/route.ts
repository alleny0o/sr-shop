import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { z } from "zod";

// CREATE media group
import createMediaGroupsWorkflow from "../../../../workflows/media-group/create-media-groups";
import { createMediaGroupsSchema } from "../../../validation-schemas";
type CreateRequestBody = z.infer<typeof createMediaGroupsSchema>;

export const POST = async (req: AuthenticatedMedusaRequest<CreateRequestBody>, res: MedusaResponse) => {
  const { result } = await createMediaGroupsWorkflow(req.scope).run({
    input: {
      media_groups: req.validatedBody.media_groups.map((group) => ({
        uuid: group.uuid,
        product_id: group.product_id,
        media_tag: group.media_tag,
      })),
    },
  });

  res.status(200).json({ media_groups: result });
};

// UPDATE media group
import updateMediaGroupsWorkflow from "../../../../workflows/media-group/update-media-group";
import { updateMediaGroupsSchema } from "../../../validation-schemas";
type UpdateRequestBody = z.infer<typeof updateMediaGroupsSchema>;

export const PUT = async (req: AuthenticatedMedusaRequest<UpdateRequestBody>, res: MedusaResponse) => {
  const result = await updateMediaGroupsWorkflow(req.scope).run({
    input: {
      media_groups: req.validatedBody.media_groups.map((group) => ({
        id: group.id,
        media_tag: group.media_tag,
      })),
    },
  });

  res.status(200).json({ media_groups: result.result });
};
