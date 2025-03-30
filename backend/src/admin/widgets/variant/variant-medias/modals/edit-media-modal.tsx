// UI Components
import { Button, FocusModal } from "@medusajs/ui";

// Hooks
import { useEditMediaModal } from "../hooks/use-edit-media-modal";

// Local Types
import { Media } from "../types";

// Custom Components
import { ConfirmPrompt } from "../../../../components/confirm-prompt";
import { MediaItem } from "../components/media-item";

// dnd-kit Imports
import { closestCorners, DndContext, DragOverlay, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

// Context
import { useVariantContext } from "../context/variant-context";
import { Dropzone } from "../components/dropzone";

type EditMediaModalProps = {
  variantMedias: Media[];
  setVariantMedias: (variantMedias: Media[]) => void;
};

export const EditMediaModal = ({ variantMedias, setVariantMedias }: EditMediaModalProps) => {
  const variant = useVariantContext();
  const variant_id = variant.variant_id;
  const product_id = variant.product_id;

  const {
    isOpen,
    setIsOpen,
    editedVariantMedias,
    setEditedVariantMedias,
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
  } = useEditMediaModal(variant_id, product_id, variantMedias, setVariantMedias);

  // Define sensors outside of the component to avoid re-creation on every render
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const getTaskPos = (id: string) => {
    return editedVariantMedias.findIndex((m) => m.file_id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null); // Clear activeId if there's no target
      return;
    }

    if (active.id === over.id) {
      setActiveId(null); // Clear activeId if dropped on the same item
      return;
    }

    setEditedVariantMedias((variantMedias) => {
      const originalPos = getTaskPos(active.id as string);
      const newPos = getTaskPos(over.id as string);

      if (originalPos === -1 || newPos === -1) return variantMedias;

      return arrayMove(variantMedias, originalPos, newPos);
    });

    setActiveId(null); // Clear activeId after handling drag end
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <FocusModal open={isOpen} onOpenChange={handleOpenChange}>
        <FocusModal.Trigger asChild>
          <Button size="small" variant="secondary">
            Edit
          </Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header></FocusModal.Header>
          <FocusModal.Body className="flex-1 flex flex-col overflow-hidden">
            <div className="flex size-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
              <div className="bg-ui-bg-subtle size-full overflow-auto">
                <DndContext
                  sensors={sensors}
                  onDragEnd={handleDragEnd}
                  onDragStart={({ active }) => setActiveId(active.id as string)}
                  onDragCancel={() => setActiveId(null)}
                  collisionDetection={closestCorners}
                >
                  <SortableContext items={editedVariantMedias.map((m) => m.file_id)} strategy={rectSortingStrategy}>
                    <div className="grid h-fit auto-rows-auto grid-cols-3 sm:grid-cols-4 gap-6 p-6">
                      {editedVariantMedias.map((variantMedia) => (
                        <MediaItem
                          key={variantMedia.file_id}
                          id={variantMedia.file_id}
                          media={variantMedia}
                          onDelete={handleDelete}
                          onThumbnail={handleThumbnail}
                          isOverlay={false}
                          isActive={variantMedia.file_id === activeId}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? (
                      <MediaItem
                        id={activeId}
                        media={editedVariantMedias.find((m) => m.file_id === activeId)!}
                        onDelete={handleDelete}
                        onThumbnail={handleThumbnail}
                        isOverlay={true}
                        isActive={false}
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
              <div className="bg-ui-bg-base overflow-auto border-b px-6 py-4 lg:border-b-0 lg:border-l">
                <Dropzone editedVariantMedias={editedVariantMedias} setEditedVariantMedias={setEditedVariantMedias} />
              </div>
            </div>
          </FocusModal.Body>
          <FocusModal.Footer className="flex justify-end space-x-2">
            <Button size="small" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="small" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
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
