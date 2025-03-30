// JS SDK
import { sdk } from "../../../../lib/config";

// Types
import { FileDTO } from "@medusajs/framework/types";
import { ProductFormType, Field } from "../types";

/**
 * Updates the product form details.
 * @param formData - The form data containing id, name, and active status.
 * @returns The updated product form.
 */
export const updateProductForm = async (formData: { id: string; name?: string; active?: boolean }): Promise<ProductFormType> => {
  const res = await sdk.client.fetch<{ product_form: ProductFormType }>(`/admin/product-product_form/form`, {
    method: "PUT",
    body: formData,
  });

  return res.product_form;
};

/**
 * Uploads a file to the server.
 * @param file - The file to be uploaded.
 * @returns The uploaded file's details.
 */
export const uploadFile = async (file: File): Promise<FileDTO> => {
  // Create a FormData object to hold the file
  const formData = new FormData();
  formData.append("files", file);

  // Make a POST request to the server to upload the file
  const res = await fetch(`/admin/file-manager`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const result: { files: FileDTO[] } = await res.json();
  return result.files[0];
};

/**
 * Deletes files from the server.
 * @param fileIds - An array of file IDs to be deleted.
 * @returns A promise indicating the completion of the delete operation.
 */
export const deleteFiles = async (fileIds: string[]): Promise<void> => {
    await sdk.client.fetch(`admin/file-manager`, {
        method: "DELETE",
        body: { file_ids: fileIds },
    });
};

/**
 * Creates new fields in the product form.
 * @param fields - An array of new fields to be created.
 * @param productId - The product ID associated with the product form.
 * @returns A promise indicating the completion of the create operation.
 */
export const createFields = async (fields: Field[], productId: string): Promise<void> => {
    await sdk.client.fetch(`/admin/product-product_form/fields`, {
        method: "POST",
        body: { fields, product_id: productId },
    });
};

/**
 * Deletes fields from the product form.
 * @param fieldIds - An array of field IDs to be deleted.
 * @returns A promise indicating the completion of the delete operation.
 */
export const deleteFields = async (fieldIds: string[]): Promise<void> => {
    await sdk.client.fetch(`/admin/product-product_form/fields`, {
        method: "DELETE",
        body: { field_ids: fieldIds },
    });
};

/**
 * Updates existing fields in the product form.
 * @param fields - An array of fields to be updated.
 * @returns A promise indicating the completion of the update operation.
 */
export const updateFields = async (fields: Field[]): Promise<void> => {
    await sdk.client.fetch(`/admin/product-product_form/fields`, {
        method: "PUT",
        body: { fields },
    });
};