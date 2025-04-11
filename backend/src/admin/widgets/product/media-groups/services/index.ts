// Medusa Types
import { FileDTO } from "@medusajs/framework/types";

// Local Types
import { MediaGroupType, MediaItem, PlainMediaGroup } from "../types";
import { compareMediaArrays } from "../utils";

// JS SDK
import { sdk } from "../../../../lib/config";

// Upload New Media File To Server
export const uploadMediaFiles = async (files: File[]): Promise<MediaItem[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`/admin/file-manager`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload media files");
  }

  const { files: uploaded_files }: { files: FileDTO[] } = await response.json();

  if (uploaded_files.length !== files.length) {
    throw new Error("Failed to upload all media files");
  }

  return uploaded_files.map((file, index) => ({
    file_id: file.id,
    name: files[index].name,
    size: files[index].size,
    mime_type: files[index].type,
    is_thumbnail: false,
    url: file.url,
  }));
};

// Delete Media Files From Server
export const deleteMediaFiles = async (file_ids: string[]): Promise<void> => {
  const response = await fetch(`/admin/file-manager`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_ids: file_ids }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete media files");
  }
};

// Function To Process New File Uploads
export const processNewFileUploads = async (media_items: MediaItem[]): Promise<MediaItem[]> => {
  const newFiles = media_items.filter((item) => item.file instanceof File);

  if (newFiles.length === 0) return media_items;

  const uploadedMedias = await uploadMediaFiles(newFiles.map((item) => item.file as File));

  // In processNewFileUploads function:
  const finalMedias: MediaItem[] = [];
  let uploadIndex = 0;

  media_items.forEach((item) => {
    if (item.file instanceof File) {
      // Make sure we're using the server's file_id, not the blob URL
      finalMedias.push({
        ...uploadedMedias[uploadIndex],
        // Ensure file_id is properly set from the server response
        file_id: uploadedMedias[uploadIndex].file_id,
      });
      uploadIndex++;
    } else {
      finalMedias.push(item);
    }
  });

  return finalMedias;
};

// Function To Handle Media Deletions
export const handleMediaDeletions = async (media_items: MediaItem[], edited_medias: MediaItem[]) => {
  const newFileIds = new Set(edited_medias.map((m) => m.file_id));
  const deletedMedias = media_items.filter((m) => !newFileIds.has(m.file_id));

  if (deletedMedias.length > 0) {
    await deleteMediaFiles(deletedMedias.map((m) => m.file_id));
  }
};

// Function To Handle Unsaved Media
export const deleteUnsavedMedias = async (media_items: MediaItem[], edited_medias: MediaItem[]) => {
  const savedFileIds = new Set(media_items.map((m) => m.file_id));
  const unsavedMedias = edited_medias.filter((m) => !savedFileIds.has(m.file_id));

  if (unsavedMedias.length > 0) {
    await deleteMediaFiles(unsavedMedias.map((m) => m.file_id));
  }
};

// Update Media Items On Server
export const updateMediaItems = async (media_items: MediaItem[], media_group_id: string): Promise<void> => {
  // Remove Existing Media Items From Group
  await sdk.client.fetch(`/admin/product-media_groups/media-items`, {
    method: "DELETE",
    body: { media_group_id: media_group_id },
  });

  console.log("media items: ", media_items)
  const newMediasPayload = {
    media_items: {
      media_group_id: media_group_id,
      medias: media_items.map((item) => ({
        file_id: item.file_id,
        name: item.name,
        size: item.size,
        mime_type: item.mime_type,
        is_thumbnail: item.is_thumbnail,
        url: item.url,
      })),
    },
  };

  // Create Media Items To Group
  await sdk.client.fetch(`/admin/product-media_groups/media-items`, {
    method: "POST",
    body: newMediasPayload,
  });
};

// Create New Media Group
export const createMediaGroup = async (
  media_group: PlainMediaGroup,
  media_items: MediaItem[],
  edited_media_items: MediaItem[]
): Promise<{ media_group: PlainMediaGroup; media_items?: MediaItem[] }> => {
  const { media_groups: created_media_groups } = await sdk.client.fetch<{ media_groups: MediaGroupType[] }>(
    `/admin/product-media_groups/media-groups`,
    {
      method: "POST",
      body: { media_groups: [{ product_id: media_group.product_id, media_tag: media_group.media_tag }] },
    }
  );

  if (!created_media_groups[0]) {
    throw new Error("Media group is not found");
  }

  if (!compareMediaArrays(media_items, edited_media_items)) {
    const final_medias = await processNewFileUploads(edited_media_items);
    await handleMediaDeletions(media_items, final_medias);
    await updateMediaItems(final_medias, created_media_groups[0].id);

    return {
      media_group: {
        id: created_media_groups[0].id,
        product_id: created_media_groups[0].product_id,
        media_tag: created_media_groups[0].media_tag ?? undefined,
      },
      media_items: final_medias,
    };
  }

  return {
    media_group: {
      id: created_media_groups[0].id,
      product_id: created_media_groups[0].product_id,
      media_tag: created_media_groups[0].media_tag ?? undefined,
    },
  };
};

// Update Media Group
export const updateMediaGroup = async (
  media_group: PlainMediaGroup,
  media_items: MediaItem[],
  edited_media_items: MediaItem[]
): Promise<{ media_group: PlainMediaGroup; media_items?: MediaItem[] }> => {
  const { media_groups: updated_media_groups } = await sdk.client.fetch<{ media_groups: MediaGroupType[] }>(
    `/admin/product-media_groups/media-groups`,
    {
      method: "PUT",
      body: { media_groups: [{ id: media_group.id, media_tag: media_group.media_tag }] },
    }
  );

  if (!updated_media_groups[0]) throw new Error("Media Group does not exist");

  if (!compareMediaArrays(media_items, edited_media_items)) {
    const final_medias = await processNewFileUploads(edited_media_items);
    await handleMediaDeletions(media_items, final_medias);
    await updateMediaItems(final_medias, updated_media_groups[0].id);

    return {
      media_group: {
        id: updated_media_groups[0].id,
        product_id: updated_media_groups[0].product_id,
        media_tag: updated_media_groups[0].media_tag ?? undefined,
      },
      media_items: final_medias,
    };
  }

  return {
    media_group: {
      id: updated_media_groups[0].id,
      product_id: updated_media_groups[0].product_id,
      media_tag: updated_media_groups[0].media_tag ?? undefined,
    },
  };
};

// Delete Media Group
// export const deleteMediaGroup = async (media_group_id: string): Promise<void> => {
//   await sdk.client.fetch(`/admin/product-media_groups/media-groups`, {
//     method: "DELETE",
//     body: { media_group_ids: [media_group_id] },
//   });
// };
