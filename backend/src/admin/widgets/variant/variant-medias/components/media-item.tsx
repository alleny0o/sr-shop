// UI Components
import { DropdownMenu, IconButton } from "@medusajs/ui";
import { Trash, ThumbnailBadge, EllipsisHorizontal, PencilSquare } from "@medusajs/icons";

// Local Types
import { Media } from "../types";

// dnd-kit Imports
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type MediaItemProps = {
  id: string;
  media: Media;
  onDelete: (file_id: string) => void;
  onThumbnail: (file_id: string) => void;
  isOverlay: boolean;
  isActive: boolean;
};

export const MediaItem = ({ id, media, onDelete, onThumbnail, isOverlay, isActive }: MediaItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const isVideo = media.mime_type?.startsWith("video/");

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`touch-none cursor-grab shadow-elevation-card-rest hover:shadow-elevation-card-hover focus-visible:shadow-borders-focus bg-ui-bg-subtle-hover group relative aspect-square h-auto max-w-full overflow-hidden rounded-lg outline-none ${
        isActive && !isOverlay ? "opacity-50" : ""
      }`}
    >
      {isVideo ? (
        <video
          src={media.url}
          className={`${isOverlay ? "opacity-100" : ""} size-full object-cover object-center`}
          controls
          muted
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={media.url}
          alt={media.name}
          className={`${isOverlay ? "opacity-100" : ""} size-full object-cover object-center`}
        />
      )}

      {!isVideo && media.is_thumbnail && (
        <div className="absolute left-2 top-2">
          <ThumbnailBadge />
        </div>
      )}

      <div className="absolute right-2 top-2">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild disabled={isOverlay}>
            <IconButton size="2xsmall">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="p-1 text-sm min-w-[100px]">
            <DropdownMenu.Item
              className="flex items-center gap-x-2 text-sm py-1 px-2"
              onClick={() => {
                if (!isOverlay) onDelete(media.file_id);
              }}
            >
              <Trash className="text-ui-fg-subtle" />
              Delete
            </DropdownMenu.Item>
            {!isVideo && (
              <>
                <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
                <DropdownMenu.Item
                  className="flex items-center gap-x-2 text-sm py-1 px-2"
                  onClick={() => {
                    if (!isOverlay) onThumbnail(media.file_id);
                  }}
                >
                  <PencilSquare className="text-ui-fg-subtle" />
                  Make thumbnail
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </div>
  );
};
