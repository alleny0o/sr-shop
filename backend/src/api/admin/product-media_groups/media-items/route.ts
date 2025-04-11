import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/framework/utils";
import { z } from "zod";

// CREATE media items
import createMediaItemsWorkflow from "../../../../workflows/media-group/create-media-items";
import { createMediaItemsSchema } from "../../../validation-schemas";
type CreateRequestBody = z.infer<typeof createMediaItemsSchema>;

export const POST = async (req: AuthenticatedMedusaRequest<CreateRequestBody>, res: MedusaResponse) => {
  const result = await createMediaItemsWorkflow(req.scope).run({
    input: {
      media_items: req.validatedBody.media_items,
    },
  });

  if (!result.result[0]) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Failed to create media item");
  }

  return res.status(200).json({ media_item: result.result[0] });
};

// DELETE media items
import deleteMediaItemsWorkflow from "../../../../workflows/media-group/delete-media-items";
import { deleteMediaItemsSchema } from "../../../validation-schemas";
type DeleteRequestBody = z.infer<typeof deleteMediaItemsSchema>;

export const DELETE = async (req: AuthenticatedMedusaRequest<DeleteRequestBody>, res: MedusaResponse) => {
    const result = await deleteMediaItemsWorkflow(req.scope).run({
        input: {
            media_group_id: req.validatedBody.media_group_id,
        },
    });

    res.status(200).json({ media_items: result.result });
};