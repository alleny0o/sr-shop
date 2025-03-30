// react-dropzone
import { useDropzone } from "react-dropzone";

// React
import { useCallback } from "react";

// UI Components
import { Plus } from "@medusajs/icons";

// react-hook-form
import { UseFormReturn } from "react-hook-form";

// Types
import { Form, Field } from "../types";

type DropzoneProps = {
  form: UseFormReturn<Form, any, undefined>;
  value: string;
};

export const Dropzone = ({ form, value }: DropzoneProps) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const tempUrl = URL.createObjectURL(file);

        form.setValue(
          value as `fields.${number}.image`,
          {
            temp_url: tempUrl,
            file,
          } as Field["image"]
        );
      }
    },
    [form, value]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const currentImage = form.getValues(value as `fields.${number}.image`);

  return (
    <div
      {...getRootProps({
        className: `relative flex items-center justify-center rounded-md w-16 h-16 cursor-pointer ${
          currentImage
            ? "bg-transparent border-2 border-solid dark:border-zinc-950"
            : "bg-gray-100 dark:bg-zinc-900 border-2 border-dashed dark:border-zinc-950"
        }`,
      })}
    >
      <input {...getInputProps()} />
      {currentImage ? (
        <img
          src={"url" in currentImage ? currentImage.url : "temp_url" in currentImage ? currentImage.temp_url : ""}
          alt="Uploaded image"
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Plus />
        </div>
      )}
    </div>
  );
};
