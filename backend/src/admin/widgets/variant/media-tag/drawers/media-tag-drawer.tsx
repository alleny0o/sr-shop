// UI Components
import { Input, Label, Button, Drawer, toast } from "@medusajs/ui";

// React & State Management
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// react-hook-form
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Local Types
import { Form, mediaTagSchema } from "../types";

// Custom Components
import { ConfirmPrompt } from "../../../../components/confirm-prompt";

// JS SDK
import { sdk } from "../../../../lib/config";

type MediaTagDrawerProps = {
  id: string;
  variant_id: string;
  value: number | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const MediaTagDrawer = ({
  id,
  variant_id,
  value,
  open,
  setOpen,
}: MediaTagDrawerProps) => {
  const queryClient = useQueryClient();

  const form: UseFormReturn<Form> = useForm<Form>({
    resolver: zodResolver(mediaTagSchema),
    defaultValues: {
      value: value ?? null,
    },
  });

  const [saving, setSaving] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);

  const handleCancel = useCallback((open: boolean) => {
    const currentValue = form.getValues("value");
    if (currentValue !== value) {
      setPromptVisible(true);
    } else {
      setOpen(!open);
    }
  }, [form, value, setOpen]);

  const handleReset = useCallback(() => {
    form.reset({ value: value ?? null });
    setPromptVisible(false);
    setOpen(false);
  }, [form, value, setOpen]);

  const handleSave = form.handleSubmit(
    useCallback(
      async (data: Form) => {
        setSaving(true);
        
        try {
          if (data.value === value) {
            toast.success("Media tag was successfully updated.");
            setOpen(false);
            return;
          }

          await sdk.client.fetch<{ media_tag: any }>(
            `/admin/variant-media_tag`,
            {
              method: "PUT",
              body: {
                id,
                value: data.value,
              },
            }
          );

          queryClient.invalidateQueries({ queryKey: ["media-tag", variant_id] });

          toast.success("Media tag was successfully updated.");
        } catch (error) {
          console.error("Error saving media tag:", error);
          toast.error("Failed to update media tag.");
        } finally {
          setOpen(false);
          setSaving(false);
        }
      },
      [id, value, variant_id, queryClient, setOpen]
    )
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      form.setValue("value", val === "" ? null : Number(val), {
        shouldValidate: true,
      });
    },
    [form]
  );

  return (
    <>
      <Drawer open={open} onOpenChange={() => handleCancel(open)}>
        <Drawer.Trigger asChild>
          <Button size="small" variant="secondary">
            Edit
          </Button>
        </Drawer.Trigger>

        <Drawer.Content>
          <Drawer.Header>Edit Media Tag</Drawer.Header>
          <Drawer.Body className="flex flex-col gap-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="value" size="small" weight="plus">
                Media Tag Value
              </Label>
              <Input
                id="value"
                type="number"
                value={form.watch("value") ?? ""}
                onChange={handleInputChange}
              />
              {form.formState.errors.value && (
                <p className="text-red-700 text-xs">
                  {"ERROR: " + form.formState.errors.value.message}
                </p>
              )}
            </div>
          </Drawer.Body>

          <Drawer.Footer>
            <Button size="small" variant="secondary" onClick={() => handleCancel(open)}>
              Cancel
            </Button>
            <Button size="small" disabled={saving} onClick={handleSave}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>

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
