import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import ProductFormModuleService from "../../../../modules/product-form/service";
import { PRODUCT_FORM_MODULE } from "../../../../modules/product-form";
import { ProductFormField } from "../../types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export type CreateProductFormFieldsStepInput = {
  fields: ProductFormField[];
  product_id: string;
};

const createProductFormFieldsStep = createStep(
  "create-product-form-fields-step",
  async (input: CreateProductFormFieldsStepInput, { container }) => {
    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data: products } = await query.graph({
      entity: "product",
      fields: ["product_form.*"],
      filters: {
        id: input.product_id,
      },
    });

    const productFormId = products[0].product_form?.id;

    const createdFieldsId: string[] = [];
    for (const field of input.fields) {
      const newField = await productFormModuleService.createProductFormFields({
        uuid: field.uuid,
        label: field.label || null,
        description: field.description || null,
        placeholder: field.placeholder || null,
        options: field.options || null,
        required: field.required,
        input_type: field.input_type,
        max_file_size: field.max_file_size || null,
        max_images: field.max_images || null,
        image_ratios: field.image_ratios || null,
        product_form_id: productFormId, // associate with the product form
      });

      createdFieldsId.push(newField.id);

      if (field.image) {
        await productFormModuleService.createFieldImages({
          file_id: field.image.file_id,
          name: field.image.name,
          size: field.image.size,
          mime_type: field.image.mime_type,
          url: field.image.url,
          product_form_field_id: newField.id,
        });
      }
    }

    const createdFields = await productFormModuleService.listProductFormFields({
      id: createdFieldsId,
    });

    return new StepResponse(createdFields, createdFieldsId);
  },
  async (createdFieldsId, { container }) => {
    if (!createdFieldsId || createdFieldsId.length === 0) return;

    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);

    await productFormModuleService.deleteProductFormFields(createdFieldsId);
  }
);

export default createProductFormFieldsStep;