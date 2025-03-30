// React & State Management
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

// react-hook-form
import { useForm, useFieldArray, UseFormReturn, useWatch } from "react-hook-form";

// Types
import { CompleteImage, Field, Form } from "../types";

// UUID
import { v4 as uuidv4 } from "uuid";

// Utils
import { compareImages } from "../utils";

// Services
import { updateProductForm, uploadFile, deleteFiles, createFields, deleteFields, updateFields } from "../services";

// Toast
import { toast } from "@medusajs/ui";

type UseProductFormProps = {
  productForm: Form;
  product_id: string;
  onCloseModal: () => void;
};

export const useProductForm = (input: UseProductFormProps) => {
  // Destructure input
  const { productForm, product_id, onCloseModal } = input;

  // Query client
  const queryClient = useQueryClient();

  // Initialize form with default values
  const form: UseFormReturn<Form> = useForm<Form>({
    defaultValues: productForm,
  });

  // Manage dynamic form fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  // States
  const [promptVisible, setPromptVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Watch fields
  const watchFields = useWatch({ name: "fields", control: form.control });

  // Handler to add a new field to the form
  const handleAddField = useCallback(() => {
    append({
      id: undefined,
      uuid: uuidv4(),
      label: undefined,
      description: undefined,
      placeholder: undefined,
      options: undefined,
      required: false,
      input_type: "text",

      max_file_size: undefined,
      max_images: undefined,
      image_ratios: undefined,

      image: undefined,
    });
  }, [append]);

  // Checks if the form's non-fields data has been modified.
  const isFormDirty = useCallback(() => {
    return form.getValues("name") !== productForm.name || form.getValues("active") !== productForm.active;
  }, [form, productForm]);

  // Checks if the fields have been modified.
  const isFieldsDirty = useCallback((): boolean => {
    const currentFields = form.getValues("fields");

    // Check if the number of fields differs
    if (currentFields.length !== productForm.fields.length) return true;

    // Compare each field in detail
    for (let i = 0; i < currentFields.length; i++) {
      const field = currentFields[i];
      const originalField = productForm.fields[i];

      // Compare scalar and nullable properties
      if (
        field.input_type !== originalField.input_type ||
        field.label !== originalField.label ||
        field.description !== originalField.description ||
        field.placeholder !== originalField.placeholder ||
        field.required !== originalField.required ||
        field.max_file_size !== originalField.max_file_size ||
        field.max_images !== originalField.max_images ||
        field.image_ratios !== originalField.image_ratios
      ) {
        return true;
      }

      // Compare arrays (options)
      const optionsA = field.options || [];
      const optionsB = originalField.options || [];
      if (optionsA.length !== optionsB.length || !optionsA.every((opt, idx) => opt === optionsB[idx])) {
        return true;
      }

      // Compare guide_image using utility function
      if (!compareImages(field.image, originalField.image)) {
        return true;
      }
    }

    return false; // No differences found
  }, [form, productForm]);

  // Handler to reset the form when the user confirms cancellation.
  const handleReset = useCallback(() => {
    form.reset(productForm);
    setPromptVisible(false);
    onCloseModal();
  }, [form, productForm, onCloseModal]);

  // Handler to cancel the form editing.
  const handleCancel = () => {
    if (isFormDirty() || isFieldsDirty()) {
      setPromptVisible(true);
    } else {
      onCloseModal();
    }
  };

  // Handle save
  const handleSave = useCallback(
    form.handleSubmit(async (formData) => {
      setSaving(true);

      try {
        if (!isFormDirty() && !isFieldsDirty()) {
          toast.success("Product form was successfully updated.");
          return;
        }

        if (isFormDirty()) {
          await updateProductForm({
            id: formData.id,
            name: formData.name,
            active: formData.active,
          });
        }

        if (isFieldsDirty()) {
          const { fields: currentFields } = formData;
          const { fields: originalFields } = productForm;

          // identify deleted fields and their associated files
          const removedFields = originalFields.filter(
            (originalField) => !currentFields.some((currentField) => currentField.id === originalField.id)
          );
          const removedFieldIds = removedFields.map((field) => field.id).filter(Boolean) as string[];
          const removedFileIds = removedFields
            .map((field) => (field.image && "id" in field.image ? field.image.file_id : null))
            .filter(Boolean) as string[];

          // handle updated fields
          const updatedFieldsPayload: Field[] = [];
          const oldFileIdsToDelete: string[] = [];
          for (const updatedField of currentFields.filter((field) => field.id)) {
            const matchingOriginalField = originalFields.find((originalField) => originalField.id === updatedField.id);
            if (!matchingOriginalField) continue;

            const { image: originalGuideImage } = matchingOriginalField;
            let { image: updatedGuideImage } = updatedField;

            // upload new image if necessary
            if (updatedGuideImage && "temp_url" in updatedGuideImage) {
              const uploadedFile = await uploadFile(updatedGuideImage.file);
              updatedGuideImage = {
                id: undefined,
                file_id: uploadedFile.id,
                name: updatedGuideImage.file.name,
                size: updatedGuideImage.file.size,
                mime_type: updatedGuideImage.file.type,
                url: uploadedFile.url,
              } as CompleteImage;

              // delete old file if necessary
              if (originalGuideImage && "id" in originalGuideImage) {
                oldFileIdsToDelete.push(originalGuideImage.file_id);
              }
            }

            updatedFieldsPayload.push({
              id: updatedField.id as string,
              uuid: updatedField.uuid,
              label: updatedField.label ?? undefined,
              description: updatedField.description ?? undefined,
              placeholder: updatedField.placeholder ?? undefined,
              required: updatedField.required,
              input_type: updatedField.input_type,
              options: updatedField.options ?? undefined,

              max_file_size: updatedField.max_file_size ?? undefined,
              max_images: updatedField.max_images ?? undefined,
              image_ratios: updatedField.image_ratios ?? undefined,

              image: updatedGuideImage as CompleteImage,
            });
          }

          // handle new fields
          const newFieldsPayload: Field[] = [];
          for (const newField of currentFields.filter((field) => !field.id)) {
            let { image: newImage } = newField;

            // Upload guide image if present
            if (newImage && "temp_url" in newImage) {
              const uploadedFile = await uploadFile(newImage.file);
              newImage = {
                id: undefined,
                file_id: uploadedFile.id,
                name: newImage.file.name,
                size: newImage.file.size,
                mime_type: newImage.file.type,
                url: uploadedFile.url,
              } as CompleteImage;
            }

            newFieldsPayload.push({
              id: undefined,
              uuid: newField.uuid,
              label: newField.label ?? undefined,
              description: newField.description ?? undefined,
              placeholder: newField.placeholder ?? undefined,
              required: newField.required,
              input_type: newField.input_type,
              options: newField.options ?? undefined,

              max_file_size: newField.max_file_size ?? undefined,
              max_images: newField.max_images ?? undefined,
              image_ratios: newField.image_ratios ?? undefined,

              image: newImage as CompleteImage,
            });
          }

          // prepare api requests
          const apiRequests: Promise<void>[] = [];

          if (removedFileIds.length > 0) {
            apiRequests.push(deleteFiles(removedFileIds));
          }

          if (removedFieldIds.length > 0) {
            apiRequests.push(deleteFields(removedFieldIds));
          }

          if (oldFileIdsToDelete.length > 0) {
            apiRequests.push(deleteFiles(oldFileIdsToDelete));
          }

          if (updatedFieldsPayload.length > 0) {
            apiRequests.push(updateFields(updatedFieldsPayload));
          }

          if (newFieldsPayload.length > 0) {
            apiRequests.push(createFields(newFieldsPayload, product_id));
          }

          // Execute all API requests concurrently
          await Promise.all(apiRequests);
        }

        toast.success("Product form was successfully updated.");
        queryClient.invalidateQueries({ queryKey: ["product-form", product_id] });
      } catch (error) {
        console.error(error);
        toast.error("Failed to update product form.");
      } finally {
        setSaving(false);
        onCloseModal();
      }
    }),
    [form, isFormDirty, isFieldsDirty, productForm, product_id, onCloseModal]
  );

  return {
    form,
    fields,
    append,
    remove,
    handleAddField,
    handleCancel,
    handleReset,
    handleSave,
    promptVisible,
    setPromptVisible,
    saving,
    watchFields,
  };
};
