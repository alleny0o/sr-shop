import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import ProductFormModuleService from "../../../../modules/product-form/service";
import { PRODUCT_FORM_MODULE } from "../../../../modules/product-form";

export type CreateProductFormStepInput = {
  product_id: string;
  name?: string;
  active?: boolean;
};

const createProductFormStep = createStep(
  "create-product-form-step",
  async (input: CreateProductFormStepInput, { container }) => {
    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);
    const productForm = await productFormModuleService.createProductForms(input);
    const id = productForm.id;

    return new StepResponse(productForm, id);
  },
  async (id, { container }) => {
    if (!id) return;

    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);
    await productFormModuleService.deleteProductForms(id);
  }
);

export default createProductFormStep;