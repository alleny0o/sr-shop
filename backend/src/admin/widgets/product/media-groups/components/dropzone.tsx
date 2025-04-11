// UI Components
import { Label } from "@medusajs/ui";
import { ArrowDownTray } from "@medusajs/icons";

// React & State Management
import { useCallback, useEffect } from "react";

// React Dropzone
import { useDropzone } from "react-dropzone";

// Local Types
import { MediaItem } from "../types";

type DropzoneProps = {
  editedMediaItems: MediaItem[];
  setEditedMediaItems: (mediaItems: MediaItem[]) => void;
};

export const Dropzone = (input: DropzoneProps) => {
  // Props
  const { editedMediaItems, setEditedMediaItems } = input;

  // Handlers
  // handlers
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const newMediaItems: MediaItem[] = acceptedFiles.map((file) => ({
        file_id: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        mime_type: file.type,
        is_thumbnail: false,
        url: URL.createObjectURL(file),
        file,
      }));

      setEditedMediaItems([...editedMediaItems, ...newMediaItems]);
    },
    [editedMediaItems, setEditedMediaItems]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [], // Restrict to image files only
      "video/*": [], // Restrict to video files only
    },
    maxSize: 10 * 1024 * 1024, // 10MB max file size
  });

  // Cleanup URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      editedMediaItems.forEach((media) => {
        if (media.file_id) {
          URL.revokeObjectURL(media.file_id);
        }
      });
    };
  }, [editedMediaItems]);

  return (
    <>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-1">
              <Label size="small" weight="plus">
                Media
              </Label>
              <p className="font-normal font-sans txt-compact-small text-ui-fg-muted">(Optional)</p>
            </div>
            <span className="txt-small text-ui-fg-subtle">
            Add media to this media group to showcase it in your storefront.
            </span>
          </div>
          <div
            {...getRootProps({
              className:
                "cursor-pointer bg-ui-bg-component border-ui-border-strong transition-fg group flex w-full flex-col items-center gap-y-2 rounded-lg border border-dashed p-8 hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus outline-none focus:border-solid",
            })}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-y-2">
              <div className="text-ui-fg-subtle group-disabled:text-ui-fg-disabled flex items-center gap-x-2">
                <ArrowDownTray />
                <p className="font-normal font-sans txt-medium">Upload images</p>
              </div>
              <p className="font-normal font-sans txt-compact-small text-ui-fg-muted group-disabled:text-ui-fg-disabled">
                Drag and drop images here or click to upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
