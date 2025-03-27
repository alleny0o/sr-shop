// React & State Management
import { useState, useEffect, useCallback } from "react";

// UI Components
import { toast } from "@medusajs/ui";

// Local Types
import { Media } from "../types";

// Services
import { uploadMediaFiles, deleteMediaFiles, updateVariantMedias } from "../services";

// Helper function to compare media arrays
const compareMediaArrays = (a: Media[], b: Media[]) => {
  if (a.length !== b.length) return false;
  return a.every((media, index) => media.file_id === b[index].file_id && media.is_thumbnail === b[index].is_thumbnail);
};

// Helper function to process new file uploads
// Helper function to process new file uploads
const processNewFileUploads = async (edited_medias: Media[], variant_id: string, product_id: string): Promise<Media[]> => {
  // Identify new files to upload
  const newFiles = edited_medias.filter((media) => media.file instanceof File);

  if (newFiles.length === 0) return edited_medias;

  // Upload new files
  const uploadedMedias = await uploadMediaFiles(
    newFiles.map((media) => media.file as File),
    variant_id,
    product_id
  );

  // Reconstruct finalMedias preserving order
  const final_medias: Media[] = [];
  let upload_index = 0;

  edited_medias.forEach((media) => {
    if (media.file instanceof File) {
      final_medias.push(uploadedMedias[upload_index]);
      upload_index++;
    } else {
      final_medias.push(media);
    }
  });

  return final_medias;
};

// Helper function to handle media deletions
const handleMediaDeletions = async (initial_medias: Media[], final_medias: Media[]) => {
  // Determine medias to delete
  const new_file_ids = new Set(final_medias.map((m) => m.file_id));
  const deleted_medias = initial_medias.filter((m) => !new_file_ids.has(m.file_id));

  // Delete removed medias if any
  if (deleted_medias.length > 0) {
    await deleteMediaFiles(deleted_medias.map((m) => m.file_id));
  }
};

// Helper function to handle unsaved media deletions on cancel
const deleteUnsavedMedias = async (initial_medias: Media[], edited_medias: Media[]) => {
  const savedFileIds = new Set(initial_medias.map((m) => m.file_id));
  const unsavedMedias = edited_medias.filter((m) => !savedFileIds.has(m.file_id));

  if (unsavedMedias.length > 0) {
    await deleteMediaFiles(unsavedMedias.map((m) => m.file_id));
  }
};

export const useEditMediaModal = (
  variant_id: string,
  product_id: string,
  initial_medias: Media[],
  setMedias: (medias: Media[]) => void
) => {
  // State management for modal and media editing
  const [isOpen, setIsOpen] = useState(false);
  const [editedMedias, setEditedMedias] = useState<Media[]>(initial_medias);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sync initial medias when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditedMedias(initial_medias);
    }
  }, [isOpen, initial_medias]);

  // Memoized comparison function to check if medias are equal
  const areMediasEqual = useCallback((a: Media[], b: Media[]) => {
    return compareMediaArrays(a, b);
  }, []);

  // Handle saving edited medias
  const handleSave = useCallback(async () => {
    setIsSaving(true);

    try {
      // Check if no changes were made
      if (areMediasEqual(initial_medias, editedMedias)) {
        toast.success("Media was successfully updated.");
        setIsOpen(false);
        return;
      }

      // Process new file uploads
      const finalMedias = await processNewFileUploads(editedMedias, variant_id, product_id);

      // Handle deletions of removed medias
      await handleMediaDeletions(initial_medias, finalMedias);

      // Update variant medias on server
      await updateVariantMedias(finalMedias, variant_id);

      // Upade the state with the new medias
      setMedias(finalMedias);

      toast.success("Media was successfully updated.");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update media", error);
      toast.error("Failed to save media :(");
    } finally {
      setIsSaving(false);
    }
  }, [areMediasEqual, initial_medias, editedMedias, setMedias, variant_id]);

  // Handle cancellation of media editing
  const handleCancel = useCallback(() => {
    if (areMediasEqual(initial_medias, editedMedias)) {
      setIsOpen(false);
    } else {
      setShowConfirmPrompt(true);
    }
  }, [areMediasEqual, initial_medias, editedMedias]);

  // Confirm cancellation and clean up unsaved medias
  const confirmCancel = useCallback(async () => {
    try {
      // Delete any unsaved media files
      await deleteUnsavedMedias(initial_medias, editedMedias);
    } catch (error) {
      console.error("Error deleting medias:", error);
    }
    setShowConfirmPrompt(false);
    setEditedMedias(initial_medias);
    setIsOpen(false);
  }, [initial_medias, editedMedias]);

  // Remove a media from edited medias
  const handleDelete = useCallback((file_id: string) => {
    setEditedMedias((medias) => medias.filter((media) => media.file_id !== file_id));
  }, []);

  // Set a specific media as thumbnail
  const handleThumbnail = useCallback((file_id: string) => {
    setEditedMedias((medias) =>
      medias.map((media) => ({
        ...media,
        is_thumbnail: media.file_id === file_id,
      }))
    );
  }, []);

  // Return all necessary states and handlers
  return {
    isOpen,
    setIsOpen,
    editedMedias,
    setEditedMedias,
    showConfirmPrompt,
    setShowConfirmPrompt,
    isSaving,
    handleSave,
    handleCancel,
    confirmCancel,
    handleDelete,
    handleThumbnail,
    activeId,
    setActiveId,
  };
};
