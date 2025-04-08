import { z } from "zod";
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// UPDATE media tag
import updateMediaTagWorkflow from "../../../workflows/media-tag/update-media-tag";
import { updateMediaTagSchema } from "../../validation-schemas";

type UpdateRequestBody = z.infer<typeof updateMediaTagSchema>;

export const PUT = async (req: AuthenticatedMedusaRequest<UpdateRequestBody>, res: MedusaResponse) => {
  const { id, value } = req.validatedBody;

  const result  = await updateMediaTagWorkflow(req.scope).run({
    input: {
      id: id,
      value: value ?? undefined,
    },
  });

  res.status(200).json({ media_tag: result.result });
};
