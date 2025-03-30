import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { uploadFilesWorkflow, deleteFilesWorkflow } from "@medusajs/medusa/core-flows";
import { MedusaError } from "@medusajs/framework/utils";

// UPLOAD ROUTE
export const POST = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse,
) => {
    const input = req.files as Express.Multer.File[];

    if (!input?.length) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "No files provided");
    };

    const { result } = await uploadFilesWorkflow(req.scope).run({
        input: {
          files: input?.map((f) => ({
            filename: f.originalname,
            mimeType: f.mimetype,
            content: f.buffer.toString("binary"),
            access: "public",
          })),
        },
      });

    res.status(200).json({ files: result });
};

// DELETE ROUTE
import { deleteFilesSchema } from "../../validation-schemas";
import { z } from "zod";

type DeleteRequestBody = z.infer<typeof deleteFilesSchema>;

export const DELETE = async (
  req: AuthenticatedMedusaRequest<DeleteRequestBody>,
  res: MedusaResponse
) => {
  const file_ids = req.validatedBody.file_ids;

  if (!file_ids?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "No file IDs provided"
    );
  }

  await deleteFilesWorkflow(req.scope).run({
    input: {
      ids: file_ids,
    },
  });

  res.status(200).json({ success: true });
};
