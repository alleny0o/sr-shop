import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import getOptionConfigsWorkflow from "../../../workflows/option-config/get-option-configs";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const product_ids = req.query.ids as string[];

  const all_option_configs = await Promise.all(
    product_ids.map(async (product_id) => {
      const { result } = await getOptionConfigsWorkflow(req.scope).run({
        input: { product_id },
      });

      return result?.length ? result.map((config) => ({
        id: config.id,
        option_id: config.option_id,
        option_title: config.option_title,
        display_type: config.display_type,
        is_selected: config.is_selected,
        option_values: config.option_values.map((value) => ({
          id: value.id,
          option_value_id: value.option_value_id,
          color: value.color,
          image: value.image
            ? {
                id: value.image.id,
                url: value.image.url,
              }
            : null,
        })),
      })) : [];
    })
  );

  // Flatten the arrays from each product
  const flattened = all_option_configs.flat();

  return res.json({ option_configs: flattened });
};
