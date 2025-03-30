// UI Components
import { Label, Input } from "@medusajs/ui";

// Context
import { useFieldContext } from "../../context/field-context";

// react-hook-form
import { Controller } from "react-hook-form";

export const Placeholder = () => {
  const field = useFieldContext();

  return (
    <div className="flex flex-col gap-y-1">
      <Label size="small">Field Placeholder</Label>
      <Controller
        name={`fields.${field.idx}.placeholder`}
        control={field.form.control}
        render={({ field }) => (
          <Input size="small" {...field} value={field.value || ""} placeholder="Enter placeholder..." />
        )}
      />
    </div>
  );
};