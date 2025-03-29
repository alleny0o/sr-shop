import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";

// CREATE product form fields
import createProductFormFieldsWorkflow from "../../../../workflows/product-form/create-product-form-fields";
import { createProductFormFieldsSchema } from "../../../validation-schemas";

type CreateRequestBody = z.infer<typeof createProductFormFieldsSchema>;

export const POST = async (req: AuthenticatedMedusaRequest<CreateRequestBody>, res: MedusaResponse) => {
  const { fields, product_id } = req.validatedBody;

  const { result } = await createProductFormFieldsWorkflow(req.scope).run({
    input: {
      fields,
      product_id,
    },
  });

  res.status(200).json({ product_form_fields: result });
};

// DELETE product form fields
import { deleteProductFormFieldsSchema } from "../../../validation-schemas";
import deleteProductFormFieldsWorkflow from "../../../../workflows/product-form/delete-product-form-fields";

type DeleteRequestBody = z.infer<typeof deleteProductFormFieldsSchema>;

export const DELETE = async (req: AuthenticatedMedusaRequest<DeleteRequestBody>, res: MedusaResponse) => {
  const { field_ids } = req.validatedBody;

  const { result } = await deleteProductFormFieldsWorkflow(req.scope).run({
    input: {
      ids: field_ids,
    },
  });

  res.status(200).json({ deleted_product_form_fields: result });
};

// UPDATE product form fields
import { updateProductFormFieldsSchema } from "../../../validation-schemas";
import updateProductFormFieldsWorkflow from "../../../../workflows/product-form/update-product-form-fields";

type UpdateRequestBody = z.infer<typeof updateProductFormFieldsSchema>;

export const PUT = async (req: AuthenticatedMedusaRequest<UpdateRequestBody>, res: MedusaResponse) => {
  const { fields } = req.validatedBody;

  const { result } = await updateProductFormFieldsWorkflow(req.scope).run({
    input: {
      fields,
    },
  });

  res.status(200).json({ updated_product_form_fields: result });
};
