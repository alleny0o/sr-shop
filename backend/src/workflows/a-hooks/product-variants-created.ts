// Core Flows
import { createProductVariantsWorkflow } from "@medusajs/medusa/core-flows";

// Workflows
import createMediaTagWorkflow from "../media-tag/create-media-tag";

createProductVariantsWorkflow.hooks.productVariantsCreated(async ({ product_variants }, { container }) => {
  /* ----- START MEDIA TAG ----- */
  for (const variant of product_variants) {
    if (variant.product_id) {
      await createMediaTagWorkflow(container).run({
        input: {
          product_id: variant.product_id,
          variant_id: variant.id,
          value: undefined, // You can set a default value or leave it as undefined
        },
      });
    }
  }
  /* ----- END MEDIA TAG ----- */
});
