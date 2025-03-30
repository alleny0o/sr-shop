// UI Components
import { Label } from "@medusajs/ui";
import { TagInput } from "../../tag-input";

// Context
import { useFieldContext } from "../../../context/field-context";

// react-hook-form
import { Controller } from "react-hook-form";

export const Options = () => {
    const field = useFieldContext();

    return (
      <div className="flex flex-col gap-y-2">
        <Label size="small">Field options (at least 1 recommended)</Label>
        <Controller
          name={`fields.${field.idx}.options`}
          control={field.form.control}
          render={() => (
            <>
              <TagInput
                name={`fields.${field.idx}.options`}
                control={field.form.control}
                placeholder="Type option and press comma or enter..."
              />
            </>
          )}
        />
      </div>
    );
};
