// Core Flows
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

// Workflows
import createProductFormWorkflow from "../product-form/create-product-form";
import createOptionConfigWorkflow from "../option-config/create-option-config";

createProductsWorkflow.hooks.productsCreated(async ({ products }, { container }) => {
  /* ----- START PRODUCT FORM ----- */
  for (const product of products) {
    await createProductFormWorkflow(container).run({
      input: {
        product_id: product.id,
      },
    });
  }
  /* ----- END PRODUCT FORM ----- */

  /* ----- START OPTION CONFIG ----- */
  for (const product of products) {
    for (const option of product.options) {
      await createOptionConfigWorkflow(container).run({
        input: {
          product_id: product.id,
          option_id: option.id,
          option_value_ids: option.values.map((value) => value.id),
          option_title: option.title,
          is_selected: false,
        },
      })
    };
  };
  /* ----- END OPTION CONFIG ----- */
});
