// UI Components
import { Button, FocusModal, Input, Label, Switch } from "@medusajs/ui";

// react-hook-form
import { Controller } from "react-hook-form";

// Hooks
import { useProductForm } from "../hooks/use-product-form";

// Types
import { Form } from "../types";

// Context
import { FieldContext } from "../context/field-context";

// Components
import { FormFieldWrapper } from "../components/form-field-wrapper";
import { ConfirmPrompt } from "../../../../components/confirm-prompt";
import { LivePreview } from "../components/live-preview";

type ProductFormModalProps = {
  product_id: string;
  productForm: Form;
  focusModal: boolean;
  setFocusModal: (value: boolean) => void;
};

export const ProductFormModal = ({ product_id, productForm, focusModal, setFocusModal }: ProductFormModalProps) => {
  const {
    form,
    fields,
    remove,
    handleAddField,
    handleCancel,
    handleReset,
    handleSave,
    promptVisible,
    setPromptVisible,
    saving,
    watchFields,
  } = useProductForm({
    productForm,
    product_id,
    onCloseModal: () => setFocusModal(false),
  });

  return (
    <>
      <FocusModal open={focusModal} onOpenChange={handleCancel}>
        <FocusModal.Content>
          <FocusModal.Header>
            <div className="flex items-center gap-x-2">
              <Button size="small" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="small" variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col overflow-hidden">
            <div className="flex size-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
              {/* Form Fields Section */}
              <div className="bg-ui-bg-subtle size-full overflow-auto px-6 py-4 flex flex-col gap-y-6">
                {/* Is Form Active */}
                <div className="flex items-center gap-x-2">
                  <Label size="base" weight="plus">
                    Is Form Active
                  </Label>
                  <Controller
                    name="active"
                    control={form.control}
                    render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                  />
                </div>

                {/* Form Name */}
                <div className="flex flex-col gap-y-2">
                  <Label size="base" weight="plus">
                    Form Name
                  </Label>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field }) => <Input {...field} value={field.value ?? ""} placeholder="Enter form name..." />}
                  />
                </div>

                {/* Manage Form Fields */}
                <div className="flex flex-col gap-y-2">
                  <Label size="base" weight="plus">
                    Manage Form Fields
                  </Label>
                  {fields.map((field, index) => (
                    <FieldContext.Provider
                      key={field.id}
                      value={{
                        idx: index,
                        remove: () => remove(index),
                        form,
                      }}
                    >
                      <FormFieldWrapper />
                    </FieldContext.Provider>
                  ))}
                  <Button variant="primary" size="small" onClick={handleAddField} disabled={fields.length >= 3}>
                    Add Field
                  </Button>
                </div>
              </div>

              {/* Live Preview Section */}
              <div className="bg-ui-bg-base overflow-y-auto overflow-x-hidden border-b px-6 py-4 lg:border-b-0 lg:border-l min-h-48">
                <div className="flex flex-col gap-y-6">
                  <div>
                    <Label weight="plus" size="base">
                      Live Preview
                    </Label>
                    <p className="text-xs text-gray-500">Note: This is just a preview, not exactly how it will look.</p>{" "}
                  </div>
                  <LivePreview fields={watchFields} />
                </div>
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      <ConfirmPrompt
        title="Are you sure you want to leave this form?"
        description="You have unsaved changes that will be lost if you exit this form."
        open={promptVisible}
        onClose={() => setPromptVisible(false)}
        onConfirm={handleReset}
        onCancel={() => setPromptVisible(false)}
      />
    </>
  );
};
