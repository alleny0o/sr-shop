import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import ProductFormModuleService from "../../../../modules/product-form/service";
import { PRODUCT_FORM_MODULE } from "../../../../modules/product-form";
import { ProductFormField } from "../../types";

export type UpdateProductFormFieldsStepInput = {
  fields: ProductFormField[];
};

// Step to update product form fields, including associated images
const updateProductFormFieldsStep = createStep(
  "update-product-form-fields-step",
  async (input: UpdateProductFormFieldsStepInput, { container }) => {
    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);

    // Retrieve existing fields with their images
    const fieldsToUpdate = await productFormModuleService.listProductFormFields(
      {
        id: input.fields.map((field) => field.id),
      },
      {
        relations: ["image"],
      }
    );

    // Update basic field data
    await productFormModuleService.updateProductFormFields(
      input.fields.map((field) => ({
        id: field.id,
        uuid: field.uuid,
        label: field.label,
        description: field.description,
        placeholder: field.placeholder,
        options: field.options,
        input_type: field.input_type,
        required: field.required,
        max_file_size: field.max_file_size,
        max_images: field.max_images,
        image_ratios: field.image_ratios,
      }))
    );

    // Handle associated image updates for each field
    for (const field of fieldsToUpdate) {
      const updatedField = input.fields.find((f) => f.id === field.id);
      if (!updatedField) continue;

      // Update, create, or delete image based on new input
      if (field.image) {
        if (!updatedField.image) {
          await productFormModuleService.deleteFieldImages(field.image.id);
        } else {
          await productFormModuleService.updateFieldImages({
            id: field.image.id,
            file_id: updatedField.image.file_id,
            name: updatedField.image.name,
            size: updatedField.image.size,
            mime_type: updatedField.image.mime_type,
            url: updatedField.image.url,
            product_form_field_id: field.id,
          });
        }
      } else if (updatedField.image) {
        await productFormModuleService.createFieldImages({
          file_id: updatedField.image.file_id,
          name: updatedField.image.name,
          size: updatedField.image.size,
          mime_type: updatedField.image.mime_type,
          url: updatedField.image.url,
          product_form_field_id: field.id,
        });
      }
    }

    // Return updated fields with images for the step response
    const updatedFields = await productFormModuleService.listProductFormFields(
      {
        id: input.fields.map((field) => field.id),
      },
      {
        relations: ["image"],
      }
    );

    return new StepResponse(updatedFields, fieldsToUpdate);
  },

  // Compensating action: revert fields and images to original state
  async (originalFields, { container }) => {
    const productFormModuleService: ProductFormModuleService = container.resolve(PRODUCT_FORM_MODULE);
    if (!originalFields) return;

    for (const originalField of originalFields) {
      // Restore original field data
      await productFormModuleService.updateProductFormFields([
        {
          id: originalField.id,
          uuid: originalField.uuid,
          label: originalField.label,
          description: originalField.description,
          placeholder: originalField.placeholder,
          options: originalField.options,
          input_type: originalField.input_type,
          required: originalField.required,
          max_file_size: originalField.max_file_size,
          max_images: originalField.max_images,
          image_ratios: originalField.image_ratios,
        },
      ]);

      // Restore or recreate original image, or delete if necessary
      if (originalField.image) {
        const existingImage = await productFormModuleService.retrieveFieldImage(originalField.image.id);

        if (!existingImage) {
          await productFormModuleService.createFieldImages({
            file_id: originalField.image.file_id,
            name: originalField.image.name,
            size: originalField.image.size,
            mime_type: originalField.image.mime_type,
            url: originalField.image.url,
            product_form_field_id: originalField.id,
          });
        } else {
          await productFormModuleService.updateFieldImages({
            id: originalField.image.id,
            file_id: existingImage.file_id,
            name: existingImage.name,
            size: existingImage.size,
            mime_type: existingImage.mime_type,
            url: existingImage.url,
            product_form_field_id: originalField.id,
          });
        }
      } else {
        const currentField = await productFormModuleService.retrieveProductFormField(originalField.id, {
          relations: ["image"],
        });

        if (currentField.image) {
          await productFormModuleService.deleteFieldImages(currentField.image.id);
        }
      }
    }
  }
);

export default updateProductFormFieldsStep;
