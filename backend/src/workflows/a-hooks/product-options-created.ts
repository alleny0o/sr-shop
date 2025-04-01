// Core FLows
import { createProductOptionsWorkflow } from "@medusajs/medusa/core-flows";

// Workflows
import createOptionConfigWorkflow from "../option-config/create-option-config";

createProductOptionsWorkflow.hooks.productOptionsCreated(async ({ product_options }, { container }) => {
  /* ----- START OPTION CONFIG ----- */
  for (const productOption of product_options) {
    if (productOption.product_id) {
      await createOptionConfigWorkflow(container).run({
        input: {
          product_id: productOption.product_id,
          option_id: productOption.id,
          option_value_ids: productOption.values.map((value) => value.id),
          option_title: productOption.title,
          is_selected: false,
        },
      });
    }
  }
  /* ----- END OPTION CONFIG ----- */
});
