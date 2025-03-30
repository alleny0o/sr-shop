import { memo } from "react";
import { Input, Label, Select, Textarea } from "@medusajs/ui";
import { Field } from "../types";

type LivePreviewProps = {
  fields: Field[];
};

export const LivePreview = memo(({ fields }: LivePreviewProps) => {
  return (
    <>
      <div className="flex flex-col gap-y-10">
        {fields.map((field: Field) => (
          <div key={field.id || field.uuid} className="flex flex-col">
            {field.image &&
              ("temp_url" in field.image ||
                "file_id" in field.image) && (
                <div className="flex justify-center items-center mt-1 mb-2">
                  <img
                    src={
                      field.image
                        ? "temp_url" in field.image
                          ? field.image.temp_url
                          : "url" in field.image
                          ? field.image.url
                          : undefined
                        : undefined
                    }
                    alt="field_image"
                    className="max-w-[250px] max-h-[250px] w-auto h-auto"
                    style={{
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}
            <Label
              size="small"
              weight="plus"
              className="whitespace-normal break-words"
            >
              {field.label}
              {field.required && <span className="text-red-700">*</span>}
            </Label>
            <div className="flex flex-col gap-y-1">
              <Label size="xsmall" className="whitespace-normal break-words">
                {field.description}
              </Label>
              {field.input_type === "text" && (
                <Input placeholder={field.placeholder ?? ""} />
              )}
              {field.input_type === "textarea" && (
                <Textarea placeholder={field.placeholder ?? ""} />
              )}
              {field.input_type === "dropdown" && (
                <Select>
                  <Select.Trigger>
                    <Select.Value placeholder={field.placeholder ?? ""} />
                  </Select.Trigger>
                  <Select.Content>
                    {field.options?.map((option: string, index: number) => (
                      <Select.Item key={index} value={option}>
                        {option}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              )}
              {field.input_type === "images" && (<Input type="file" />)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
});
