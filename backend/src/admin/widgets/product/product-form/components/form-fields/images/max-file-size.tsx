// UI Components
import { Label, Input } from "@medusajs/ui";

// react-hook-form
import { Controller } from "react-hook-form";

// Context
import { useFieldContext } from "../../../context/field-context";   

export const MaxFileSize = () => {
    const field = useFieldContext();

    return (
        <div className="flex flex-col gap-y-1">
            <Label size="small">Max File Size (in MB)</Label>
            <p className="text-xs text-gray-500 -mt-1 mb-1">Leave blank to accept any size</p>
            <Controller
                name={`fields.${field.idx}.max_file_size`}
                control={field.form.control}
                render={({ field: controllerField }) => {
                    return (
                        <Input
                            size="small"
                            type="number"
                            {...controllerField}
                            value={controllerField.value || ""}
                            placeholder="Enter max file size..."
                        />
                    );
                }}
            />
        </div>
    );
};