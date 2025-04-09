import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import ProductFormModuleService from "../../../../modules/product-form/service";
import { PRODUCT_FORM_MODULE } from "../../../../modules/product-form";
import { MedusaError } from "@medusajs/framework/utils";

export type GetProductFormsStepInput = {
    product_ids: string[];
};

const getProductFormsStep = createStep("get-product-forms-step", async (input: GetProductFormsStepInput, { container }) => {
    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);

    const productForms = await productFormModuleService.listProductForms(
        { product_id: input.product_ids },
        { relations: ["fields", "fields.image"] }
    );

    return new StepResponse(productForms);
});

export default getProductFormsStep;