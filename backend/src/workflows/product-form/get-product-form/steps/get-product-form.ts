import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import ProductFormModuleService from "../../../../modules/product-form/service";
import { PRODUCT_FORM_MODULE } from "../../../../modules/product-form";
import { MedusaError } from "@medusajs/framework/utils";

export type GetProductFormStepInput = {
  product_id: string;
};

const getProductFormStep = createStep("get-product-form-step", async (input: GetProductFormStepInput, { container }) => {
  const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);

  const productForms = await productFormModuleService.listProductForms(
    { product_id: input.product_id },
    { relations: ["fields", "fields.image"] }
  );

  if (!productForms.length) {
    throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No product form found for product ${input.product_id}`
      );
  };

  const productForm = productForms[0];

  return new StepResponse(productForm);
});

export default getProductFormStep;