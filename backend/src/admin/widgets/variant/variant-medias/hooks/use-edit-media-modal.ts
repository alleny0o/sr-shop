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
const processNewFileUploads = async (editedMedias: Media[], variantId: string, productId: string): Promise<Media[]> => {
  const newFiles = editedMedias.filter((media) => media.file instanceof File);

  if (newFiles.length === 0) return editedMedias;

  const uploadedMedias = await uploadMediaFiles(
    newFiles.map((media) => media.file as File),
    variantId,
    productId
  );

  const finalMedias: Media[] = [];
  let uploadIndex = 0;

  editedMedias.forEach((media) => {
    if (media.file instanceof File) {
      finalMedias.push(uploadedMedias[uploadIndex]);
      uploadIndex++;
    } else {
      finalMedias.push(media);
    }
  });

  return finalMedias;
};

// Helper function to handle media deletions
const handleMediaDeletions = async (initialMedias: Media[], finalMedias: Media[]) => {
  const newFileIds = new Set(finalMedias.map((m) => m.file_id));
  const deletedMedias = initialMedias.filter((m) => !newFileIds.has(m.file_id));

  if (deletedMedias.length > 0) {
    await deleteMediaFiles(deletedMedias.map((m) => m.file_id));
  }
};

// Helper function to handle unsaved media deletions on cancel
const deleteUnsavedMedias = async (initialMedias: Media[], editedMedias: Media[]) => {
  const savedFileIds = new Set(initialMedias.map((m) => m.file_id));
  const unsavedMedias = editedMedias.filter((m) => !savedFileIds.has(m.file_id));

  if (unsavedMedias.length > 0) {
    await deleteMediaFiles(unsavedMedias.map((m) => m.file_id));
  }
};

export const useEditMediaModal = (
  variantId: string,
  productId: string,
  initialMedias: Media[],
  setMedias: (medias: Media[]) => void
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedMedias, setEditedMedias] = useState<Media[]>(initialMedias);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEditedMedias(initialMedias);
    }
  }, [isOpen, initialMedias]);

  const areMediasEqual = useCallback((a: Media[], b: Media[]) => {
    return compareMediaArrays(a, b);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);

    try {
      if (areMediasEqual(initialMedias, editedMedias)) {
        toast.success("Media was successfully updated.");
        setIsOpen(false);
        return;
      }

      const finalMedias = await processNewFileUploads(editedMedias, variantId, productId);
      await handleMediaDeletions(initialMedias, finalMedias);
      await updateVariantMedias(finalMedias, variantId);

      setMedias(finalMedias);

      toast.success("Media was successfully updated.");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update media", error);
      toast.error("Failed to save media :(");
    } finally {
      setIsSaving(false);
    }
  }, [areMediasEqual, initialMedias, editedMedias, setMedias, variantId, productId]);

  const handleCancel = useCallback(() => {
    if (areMediasEqual(initialMedias, editedMedias)) {
      setIsOpen(false);
    } else {
      setShowConfirmPrompt(true);
    }
  }, [areMediasEqual, initialMedias, editedMedias]);

  const confirmCancel = useCallback(async () => {
    try {
      await deleteUnsavedMedias(initialMedias, editedMedias);
    } catch (error) {
      console.error("Error deleting medias:", error);
    }
    setShowConfirmPrompt(false);
    setEditedMedias(initialMedias);
    setIsOpen(false);
  }, [initialMedias, editedMedias]);

  const handleDelete = useCallback((fileId: string) => {
    setEditedMedias((medias) => medias.filter((media) => media.file_id !== fileId));
  }, []);

  const handleThumbnail = useCallback((fileId: string) => {
    setEditedMedias((medias) =>
      medias.map((media) => ({
        ...media,
        is_thumbnail: media.file_id === fileId,
      }))
    );
  }, []);

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
