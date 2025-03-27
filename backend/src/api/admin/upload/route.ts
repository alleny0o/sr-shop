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

    res.status(200).send({ files: result });
};