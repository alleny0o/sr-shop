import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import ProductFormModuleService from "../../../../modules/product-form/service";
import { PRODUCT_FORM_MODULE } from "../../../../modules/product-form";

export type DeleteProductFormFieldsStepInput = {
  ids: string[];
};

const deleteProductFormFieldsStep = createStep(
  "delete-product-form-fields-step",
  async (input: DeleteProductFormFieldsStepInput, { container }) => {
    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);

    const deletedFields = await productFormModuleService.listProductFormFields({ id: input.ids }, { relations: ["image"] });

    await productFormModuleService.deleteProductFormFields(input.ids);

    return new StepResponse(deletedFields, deletedFields);
  },
  async (deletedFields, { container }) => {
    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);

    if (!deletedFields || deletedFields.length === 0) return;

    const fieldsToCreate = deletedFields.map((field) => {
      return {
        uuid: field.uuid,
        label: field.label,
        description: field.description,
        placeholder: field.placeholder,
        options: field.options,
        required: field.required,
        input_type: field.input_type,
        max_file_size: field.max_file_size,
        max_images: field.max_images,
        image_ratios: field.image_ratios,
        product_form_id: field.product_form_id,
      };
    });

    const restoredFields = await productFormModuleService.createProductFormFields(fieldsToCreate);

    const restoredFieldMap = restoredFields.reduce((acc, field) => {
      acc[field.uuid] = field.id;
      return acc;
    }, {});

    const imagesToCreate = deletedFields
      .filter((field) => field.image)
      .map((field) => ({
        file_id: field.image.file_id,
        name: field.image.name,
        size: field.image.size,
        mime_type: field.image.mime_type,
        url: field.image.url,
        product_form_field_id: restoredFieldMap[field.uuid],
      }));

    if (imagesToCreate.length > 0) {
      await productFormModuleService.createFieldImages(imagesToCreate);
    }
  }
);

export default deleteProductFormFieldsStep;