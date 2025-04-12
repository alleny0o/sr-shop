import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";

// UPDATE option config
import updateOptionConfigWorkflow from "../../../../workflows/option-config/update-option-config";
import { updateOptionConfigSchema } from "../../../validation-schemas";

type PutRequestBody = z.infer<typeof updateOptionConfigSchema>;

export const PUT = async (req: AuthenticatedMedusaRequest<PutRequestBody>, res: MedusaResponse) => {
  const { id, option_title, display_type, is_selected, is_primary_option } = req.body;
  const result = await updateOptionConfigWorkflow(req.scope).run({
    input: {
      id,
      option_title,
      display_type,
      is_selected,
      is_primary_option,
    },
  });

  res.status(200).json({ option_config: result.result });
};
