// UI Components
import { FocusModal, Button, Input, Label, Text } from "@medusajs/ui";

// React & State Management
import { useState } from "react";

// Local Types
import { MediaGroup, MediaItem, PlainMediaGroup } from "../types";

// dnd-kit Imports
import { closestCorners, DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

// Hooks
import { useHandleSave } from "../hooks/use-handle-save";

// Custom Components
import { MediaItem as MediaItemComponent } from "../components/media-item";
import { Dropzone } from "../components/dropzone";
import { ConfirmPrompt } from "../../../../components/confirm-prompt";

type MediaGroupModalProps = {
  mediaGroup: MediaGroup;
  mediaGroups: MediaGroup[];
  type: "create" | "edit";
};

export const MediaGroupModal = ({ mediaGroup, mediaGroups, type }: MediaGroupModalProps) => {
  const [editedMediaGroup, setEditedMediaGroup] = useState<PlainMediaGroup>({
    id: mediaGroup.id ?? undefined,
    uuid: mediaGroup.uuid,
    product_id: mediaGroup.product_id,
    media_tag: mediaGroup.media_tag ?? undefined,
  });
  const [editedMediaItems, setEditedMediaItems] = useState<MediaItem[]>(mediaGroup.medias ? mediaGroup.medias : []);
  const [activeId, setActiveId] = useState<string | null>(null);

  const {
    handleSave,
    handleCancel,
    confirmCancel,
    handleDelete,
    handleThumbnail,
    open,
    isOpen,
    saving,
    showConfirmPrompt,
    setShowConfirmPrompt,
  } = useHandleSave({
    originalMediaGroup: mediaGroup,
    editedMediaGroup,
    setEditedMediaGroup,
    editedMediaItems,
    setEditedMediaItems,
    mediaGroups,
    type,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getItemPosition = (id: string) => editedMediaItems.findIndex((item) => item.file_id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    setEditedMediaItems((prev) => {
      const from = getItemPosition(active.id as string);
      const to = getItemPosition(over.id as string);
      if (from === -1 || to === -1) return prev;
      return arrayMove(prev, from, to);
    });

    setActiveId(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowConfirmPrompt(true);
    } else {
      isOpen(open);
    }
  };

  return (
    <>
      <FocusModal open={open} onOpenChange={handleOpenChange}>
        {type === "create" && (
          <FocusModal.Trigger asChild>
            <Button size="small" variant="secondary">
              Create
            </Button>
          </FocusModal.Trigger>
        )}

        <FocusModal.Content>
          <FocusModal.Header>
            <FocusModal.Title>
              {type === "create"
                ? "Create Media Group"
                : `Edit Media Group${mediaGroup?.media_tag ? ` - ${mediaGroup.media_tag}` : ""}`}
            </FocusModal.Title>
          </FocusModal.Header>

          <FocusModal.Body className="flex-1 flex flex-col overflow-hidden">
            {/* Media Tag Input (always on top) */}
            <div className="p-6 border-b">
              <Label size="small" weight="plus" htmlFor="media_tag">
                Media Tag
              </Label>
              <Input
                className="mt-2"
                id="media_tag"
                placeholder="e.g. Red Group"
                type="text"
                value={editedMediaGroup?.media_tag ?? ""}
                onChange={(e) =>
                  setEditedMediaGroup((prev) => ({
                    ...prev,
                    media_tag: e.target.value,
                  }))
                }
                autoFocus
              />
            </div>

            {/* Main Content Area - Using flex-col-reverse for mobile and grid for desktop */}
            <div className="flex size-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
              {/* Media Items Section */}
              <div className="bg-ui-bg-subtle size-full overflow-auto">
                <DndContext
                  sensors={sensors}
                  onDragEnd={handleDragEnd}
                  onDragStart={({ active }) => setActiveId(active.id as string)}
                  onDragCancel={() => setActiveId(null)}
                  collisionDetection={closestCorners}
                >
                  <SortableContext items={editedMediaItems.map((m) => m.file_id)} strategy={rectSortingStrategy}>
                    <div className="grid h-fit auto-rows-auto grid-cols-3 sm:grid-cols-4 gap-6 p-6">
                      {editedMediaItems.length > 0 ? (
                        editedMediaItems.map((item) => (
                          <MediaItemComponent
                            key={item.file_id}
                            id={item.file_id}
                            media={item}
                            onDelete={handleDelete}
                            onThumbnail={handleThumbnail}
                            isOverlay={false}
                            isActive={item.file_id === activeId}
                          />
                        ))
                      ) : (
                        <div className="col-span-full text-center">
                          <Text>No media added yet. Upload or drop files to get started.</Text>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? (
                      <MediaItemComponent
                        id={activeId}
                        media={editedMediaItems.find((m) => m.file_id === activeId)!}
                        onDelete={handleDelete}
                        onThumbnail={handleThumbnail}
                        isOverlay={true}
                        isActive={false}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>

              {/* Dropzone Area */}
              <div className="bg-ui-bg-base overflow-auto border-b px-6 py-4 lg:border-b-0 lg:border-l">
                <Dropzone editedMediaItems={editedMediaItems} setEditedMediaItems={setEditedMediaItems} />
              </div>
            </div>
          </FocusModal.Body>

          <FocusModal.Footer className="flex justify-end space-x-2">
            <Button size="small" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="small" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </FocusModal.Footer>
        </FocusModal.Content>
      </FocusModal>

      <ConfirmPrompt
        title="Are you sure you want to leave this form?"
        description="You have unsaved changes that will be lost if you exit this form."
        open={showConfirmPrompt}
        onClose={setShowConfirmPrompt}
        onConfirm={confirmCancel}
        onCancel={() => setShowConfirmPrompt(false)}
      />
    </>
  );
};
