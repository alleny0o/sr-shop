import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import { z } from "zod";

// GET original option values
export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const ids = req.query.ids as string[];

  if (!ids || ids.length === 0) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "No ids provided");
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: linkResults } = await query.graph({
    entity: "product_option_value",
    fields: ["*"],
    filters: {
      id: ids,
    },
  });

  const resultMap = new Map(linkResults.map((result) => [result.id, result]));

  const sortedResults = ids.map((id) => resultMap.get(id)).filter(Boolean);

  res.status(200).json({ real_option_values: sortedResults });
};

// PUT option value
import { updateOptionValueSchema } from "../../../validation-schemas";
import updateOptionValueWorkflow from "../../../../workflows/option-config/update-option-value";

type PutRequestBody = z.infer<typeof updateOptionValueSchema>;

export const PUT = async (req: AuthenticatedMedusaRequest<PutRequestBody>, res: MedusaResponse) => {
  const { id, option_value_id, color, image } = req.validatedBody;

  const result = await updateOptionValueWorkflow(req.scope).run({
    input: {
      id,
      option_value_id,
      color,
      image,
    },
  });

  res.status(200).json({ option_value: result.result });
};

// DELETE option value
import { deleteOptionValueSchema } from "../../../validation-schemas";
import deleteOptionValueWorkflow from "../../../../workflows/option-config/delete-option-value";

type DeleteRequestBody = z.infer<typeof deleteOptionValueSchema>;

export const DELETE = async (req: AuthenticatedMedusaRequest<DeleteRequestBody>, res: MedusaResponse) => {
  const { id } = req.validatedBody;

  const result = await deleteOptionValueWorkflow(req.scope).run({
    input: {
      id,
    },
  });

  res.status(200).json({ option_value: result.result });
};
