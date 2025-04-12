import { OptionConfig, OptionValue } from "../types";
import { FileDTO } from "@medusajs/framework/types";
import { sdk } from "../../../../lib/config";

/**
 * Updates the core option extension properties
 */
export const updateOptionCofig = async (optionConfig: OptionConfig) => {
  return sdk.client.fetch("/admin/product-option_config/option-config", {
    method: "PUT",
    body: {
      id: optionConfig.id,
      option_title: optionConfig.option_title,
      display_type: optionConfig.display_type,
      is_selected: optionConfig.is_selected,
      is_primary_option: optionConfig.is_primary_option,
    },
  });
};

/**
 * Deletes a file upload by its file ID
 */
export const deleteFile = async (fileId: string) => {
  return sdk.client.fetch(`/admin/file-manager`, {
    method: "DELETE",
    body: {
      file_ids: [fileId],
    },
  });
};

/**
 * Uploads a file and returns the file data
 */
export const uploadFile = async (file: File): Promise<FileDTO> => {
  const formData = new FormData();
  formData.append("files", file);

  const res = await fetch(`/admin/file-manager`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to upload option image");
  }

  const result: { files: FileDTO[] } = await res.json();
  return result.files[0];
};

/**
 * Updates an option value with buttons/dropdown display type (no colors or images)
 */
export const updateOptionValue = async (optionValue: OptionValue) => {
  if (optionValue.image && "id" in optionValue.image) {
    await deleteFile(optionValue.image.file_id);
  }

  return sdk.client.fetch("/admin/product-option_config/option-values", {
    method: "PUT",
    body: {
      id: optionValue.id,
      option_value_id: optionValue.option_value_id,
      color: undefined,
      image: undefined,
    },
  });
};

/**
 * Updates an option value with color display type
 */
export const updateColorOptionValue = async (optionValue: OptionValue) => {
  if (optionValue.image && "id" in optionValue.image) {
    await deleteFile(optionValue.image.file_id);
  }

  return sdk.client.fetch("/admin/product-option_config/option-values", {
    method: "PUT",
    body: {
      id: optionValue.id,
      option_value_id: optionValue.option_value_id,
      color: optionValue.color,
      image: undefined,
    },
  });
};

/**
 * Updates an option value with image display type
 */
export const updateImageOptionValue = async (optionValue: OptionValue, originalOptionValue?: OptionValue) => {
  // Check if the image has been replaced
  const isImageReplaced =
    originalOptionValue &&
    optionValue.image &&
    "temp_url" in optionValue.image &&
    originalOptionValue.image &&
    "id" in originalOptionValue.image;

  // Delete the original file if it's being replaced
  if (isImageReplaced && originalOptionValue.image && "id" in originalOptionValue.image) {
    await deleteFile(originalOptionValue.image.file_id);
  }

  // Handle new image upload if a new image is present
  let result: FileDTO | null = null;
  if (optionValue.image && "temp_url" in optionValue.image) {
    result = await uploadFile(optionValue.image.file);
  }

  // Update the value
  return sdk.client.fetch("/admin/product-option_config/option-values", {
    method: "PUT",
    body: {
      id: optionValue.id,
      option_value_id: optionValue.option_value_id,
      color: undefined,
      image:
        optionValue.image && "temp_url" in optionValue.image && result
          ? {
              file_id: result.id,
              name: optionValue.image.file.name,
              size: optionValue.image.file.size,
              mime_type: optionValue.image.file.type,
              url: result.url,
            }
          : optionValue.image
          ? optionValue.image
          : undefined,
    },
  });
};
