// UI Components
import { Label, Switch } from "@medusajs/ui";

// context
import { useFieldContext } from "../../context/field-context";

// react-hook-form
import { Controller } from "react-hook-form";

export const Required = () => {
  const { form, idx } = useFieldContext();

  return (
    <div className="flex flex-col gap-y-2">
      <Controller
        name={`fields.${idx}.required`}
        control={form.control}
        render={({ field }) => (
          <div className="flex items-center gap-x-2">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            <Label weight="regular" size="small">
              Is Required?
            </Label>
          </div>
        )}
      />
    </div>
  );
};