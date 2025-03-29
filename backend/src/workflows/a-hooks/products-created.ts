// Core Flows
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

// Workflows
import createProductFormWorkflow from "../product-form/create-product-form";

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
});
