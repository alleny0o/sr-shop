// UI Components
import { Label } from "@medusajs/ui";
import { TagInput } from "../../tag-input";

// Context
import { useFieldContext } from "../../../context/field-context";

// react-hook-form
import { Controller } from "react-hook-form";

export const ImageRatios = () => {
  const field = useFieldContext();

  return (
    <div className="flex flex-col gap-y-2">
      <Label size="small">Image Ratios</Label>
      <p className="text-xs text-gray-500 -mt-1 mb-1">
        Accepts formats like 16:9, 4:3. Leave blank to allow any ratio.
      </p>
      <Controller
        name={`fields.${field.idx}.image_ratios`}
        control={field.form.control}
        render={() => (
          <TagInput
            name={`fields.${field.idx}.image_ratios`}
            control={field.form.control}
            validationRegex={/^\d+:\d+$/}
            placeholder="e.g. 16:9, 4:3 — press enter or comma to add"
          />
        )}
      />
    </div>
  );
};
