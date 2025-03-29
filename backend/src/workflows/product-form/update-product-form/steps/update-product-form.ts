import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import ProductFormModuleService from "../../../../modules/product-form/service";
import { PRODUCT_FORM_MODULE } from "../../../../modules/product-form";

export type UpdateProductFormStepInput = {
  id: string;
  name?: string;
  active: boolean;
};

const updateProductFormStep = createStep(
  "update-product-form-step",
  async (input: UpdateProductFormStepInput, { container }) => {
    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);

    const productForm = await productFormModuleService.retrieveProductForm(input.id);

    const updatedProductForm = await productFormModuleService.updateProductForms({
      id: input.id,
      name: input.name,
      active: input.active,
    });

    return new StepResponse(updatedProductForm, productForm);
  },
  async (productForm, { container }) => {
    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);

    if (!productForm) return;

    await productFormModuleService.updateProductForms({
      id: productForm.id,
      name: productForm.name,
      active: productForm.active,
    });
  }
);

export default updateProductFormStep;