// Medusa Types
import { FileDTO } from "@medusajs/framework/types";

// Local Types
import { Media } from "../types";


// Upload New Media File To Server
export const uploadMediaFiles = async (files: File[], variant_id: string, product_id: string): Promise<Media[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/file-manager`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload media files');
    };

    const { files: uploaded_files }: { files: FileDTO[] } = await response.json();

    if (uploaded_files.length !== files.length) {
        throw new Error("Failed to upload all media files");
    };

    return uploaded_files.map((file, index) => ({
        file_id: file.id,
        product_id: product_id,
        variant_id: variant_id,
        name: files[index].name,
        size: files[index].size,
        mime_type: files[index].type,
        is_thumbnail: false,
        url: file.url,
    }));
};

// Delete Media Files From Server
export const deleteMediaFiles = async (file_ids: string[]): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/file-manager`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_ids: file_ids }),
    });

    if (!response.ok) {
        throw new Error("Failed to delete media files");
    };  
};

// Update Variant Medias On Server
export const updateVariantMedias = async (variant_medias: Media[], variant_id: string): Promise<void> => {
    // Remove Existing Medias From Variant
    const delete_response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/product-variant_medias/variant/${variant_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!delete_response.ok) {
        throw new Error("Failed to delete existing variant medias");
    };

    // Add Updated Medias To Variant
    const create_response = await fetch(`/admin/product-variant_medias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_medias }),
    });

    if (!create_response.ok) {
        throw new Error("Failed to update variant medias");
    };
};
