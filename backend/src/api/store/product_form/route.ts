import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import getProductFormsWorkflow from "../../../workflows/product-form/get-product-forms";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const product_ids = req.query.ids as string[];

  const { result } = await getProductFormsWorkflow(req.scope).run({
    input: { product_ids },
  });

  const product_forms = product_ids.map((product_id) => {
    const form = result.find((f) => f.product_id === product_id);

    return {
      product_id,
      product_form: form
        ? {
            id: form.id,
            name: form.name,
            active: form.active,
            fields: form.fields.map((field) => ({
              id: field.id,
              label: field.label,
              description: field.description,
              placeholder: field.placeholder,
              input_type: field.input_type,
              max_images: field.max_images,
              max_file_size: field.max_file_size,
              image_ratios: field.image_ratios,
              required: field.required,
              options: field.options,
              image: field.image
                ? {
                    id: field.image.id,
                    file_id: field.image.file_id,
                    url: field.image.url,
                    mime_type: field.image.mime_type,
                    name: field.image.name,
                    size: field.image.size,
                  }
                : null,
            })),
          }
        : null,
    };
  });

  return res.json({ product_forms });
};
