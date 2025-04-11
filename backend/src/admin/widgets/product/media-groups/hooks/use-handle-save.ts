// Local Types
import { MediaGroup, MediaItem, PlainMediaGroup } from "../types";

// UI Components
import { toast } from "@medusajs/ui";

// Services
import { createMediaGroup, updateMediaGroup, deleteUnsavedMedias } from "../services";

// Utils
import { compareMediaGroups, compareMediaArrays } from "../utils";

// React & State Management
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type UseHandleSaveProps = {
  originalMediaGroup: MediaGroup;
  editedMediaGroup: PlainMediaGroup;
  setEditedMediaGroup: (group: PlainMediaGroup) => void;
  editedMediaItems: MediaItem[];
  setEditedMediaItems: (value: React.SetStateAction<MediaItem[]>) => void;
  mediaGroups: MediaGroup[];
  type: "create" | "edit";
};

export const useHandleSave = (input: UseHandleSaveProps) => {
  // destructure inputs
  const { originalMediaGroup, editedMediaGroup, setEditedMediaGroup, editedMediaItems, setEditedMediaItems, mediaGroups, type } =
    input;

  // modal state
  const [open, isOpen] = useState(false);

  // save state
  const [saving, setSaving] = useState(false);

  // confirm prompt state
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);

  const queryClient = useQueryClient();

  const uniqueMediaTag = (media_tag: string | undefined): boolean => {
    const trimmedTag = media_tag?.trim().toLowerCase() || null;

    if (!trimmedTag) return false; // reject empty tags

    return !mediaGroups.some(
      (group) => group.uuid !== editedMediaGroup.uuid && group.media_tag?.trim().toLowerCase() === trimmedTag
    );
  };

  const handleSave = useCallback(async () => {
    setSaving(true);

    if (!uniqueMediaTag(editedMediaGroup.media_tag)) {
      toast.error("Media Tag must be unique and not empty.");
      setSaving(false);
      return;
    }
    try {
      if (
        compareMediaGroups(originalMediaGroup, editedMediaGroup) &&
        compareMediaArrays(originalMediaGroup?.medias, editedMediaItems)
      ) {
        toast.success("Media Group was successfully updated.");
        isOpen(false);
        return;
      }

      if (type === "create") {
        await createMediaGroup(editedMediaGroup, originalMediaGroup.medias, editedMediaItems);
      } else {
        await updateMediaGroup(editedMediaGroup, originalMediaGroup.medias, editedMediaItems);
      }

      setEditedMediaItems([]);

      toast.success("Media Group was successfully updated.");
      isOpen(false);
    } catch (error) {
      toast.error("Failed to update Media Group :(");
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["media-groups", originalMediaGroup.product_id],
      });
      setSaving(false);
    }
  }, [originalMediaGroup, editedMediaGroup, editedMediaItems, type, setEditedMediaItems]);

  const handleCancel = useCallback(() => {
    if (
      compareMediaGroups(originalMediaGroup, editedMediaGroup) &&
      compareMediaArrays(originalMediaGroup?.medias, editedMediaItems)
    ) {
      isOpen(false);
    } else {
      setShowConfirmPrompt(true);
    }
  }, [compareMediaArrays, originalMediaGroup, editedMediaGroup, editedMediaItems]);

  const confirmCancel = useCallback(async () => {
    try {
      await deleteUnsavedMedias(originalMediaGroup?.medias, editedMediaItems);
    } catch (error) {
      console.error("Error deleting medias");
    }

    setShowConfirmPrompt(false);
    if (originalMediaGroup) {
      const { medias, ...groupWithoutMedias } = originalMediaGroup;
      setEditedMediaGroup(groupWithoutMedias);
      setEditedMediaItems(originalMediaGroup.medias);
    }
    isOpen(false);
  }, [originalMediaGroup, editedMediaItems, setEditedMediaGroup, setEditedMediaItems, setShowConfirmPrompt]);

  const handleDelete = useCallback((fileId: string) => {
    setEditedMediaItems((medias) => medias.filter((media) => media.file_id !== fileId));
  }, []);

  const handleThumbnail = useCallback((fileId: string) => {
    setEditedMediaItems((medias: MediaItem[]) =>
      medias.map((media: MediaItem) => ({
        ...media,
        is_thumbnail: media.file_id === fileId,
      }))
    );
  }, []);

  return {
    handleSave,
    handleCancel,
    confirmCancel,
    handleDelete,
    handleThumbnail,
    open,
    isOpen,
    saving,
    setSaving,
    showConfirmPrompt,
    setShowConfirmPrompt,
  };
};
