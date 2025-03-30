// UI Components
import { Container, IconButton, Label, Select } from "@medusajs/ui";
import { Trash } from "@medusajs/icons";

// react-hook-form
import { Controller } from "react-hook-form";

// Context
import { useFieldContext } from "../context/field-context";

// Components
import { InputTypeSettings } from "./input-type-settings";

export const FormFieldWrapper = () => {
    const field = useFieldContext();

    return (
        <Container className="flex flex-col px-4 py-2 gap-y-3">
        <div className="flex items-center justify-between">
          <Label size="small" weight="plus">
            Field #{field.idx + 1}
          </Label>
          <IconButton size="small" variant="primary" onClick={field.remove}>
            <Trash />
          </IconButton>
        </div>
  
        {/* Display Type */}
        <div className="flex flex-col gap-y-1">
          <Controller
            name={`fields.${field.idx}.input_type`}
            control={field.form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-y-1">
                <Label size="small">Field Type</Label>
                <Select size="small" value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {["text", "textarea", "dropdown", "images"].map((type) => (
                      <Select.Item key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
            )}
          />
        </div>
  
        <Controller
          name={`fields.${field.idx}.input_type`}
          control={field.form.control}
          render={({ field: input_type }) =>
            input_type.value ? (
              <>
              <InputTypeSettings input_type={input_type.value} />
              </>
            ) : (
              <Label size="large" weight="plus">
                ERR finding Display Type
              </Label>
            )
          }
        />
      </Container>
    );
};