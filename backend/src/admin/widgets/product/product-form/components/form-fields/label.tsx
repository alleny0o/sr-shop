// UI Components
import { Label as UILabel, Input } from "@medusajs/ui";

// react-hook-form
import { Controller } from "react-hook-form";

// Context
import { useFieldContext } from "../../context/field-context";

export const Label = () => {
    const field = useFieldContext();

    return (
        <div className="flex flex-col gap-y-1">
        <UILabel size="small">Field Label</UILabel>
        <Controller
          name={`fields.${field.idx}.label`}
          control={field.form.control}
          render={({ field }) => {
            return (
              <div className="flex flex-col gap-y-1">
                <Input size="small" {...field} value={field.value || ""} placeholder="Enter label..." />
              </div>
            );
          }}
        />
      </div>
    );
};