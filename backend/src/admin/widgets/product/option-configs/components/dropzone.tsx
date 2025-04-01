import { useDropzone } from "react-dropzone";
import React, { useCallback } from "react";
import { Plus } from "@medusajs/icons";

// types
import { OptionConfig } from "../types";

type DropzoneProps = {
  updatedOptionConfig: OptionConfig;
  setUpdatedOptionConfig: (oc: OptionConfig) => void;
  index: number;
};

const DropzoneComponent = (input: DropzoneProps) => {
  const { updatedOptionConfig, setUpdatedOptionConfig, index } = input;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const tempUrl = URL.createObjectURL(file);

        // Update the option_variation with the new option_image
        const updatedValues = [...updatedOptionConfig.option_values];
        updatedValues[index] = {
          ...updatedValues[index],
          image: {
            temp_url: tempUrl,
            file,
          },
        };

        setUpdatedOptionConfig({
          ...updatedOptionConfig,
          option_values: updatedValues,
        });
      }
    },
    [updatedOptionConfig, setUpdatedOptionConfig, index]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const currentImage = updatedOptionConfig.option_values[index]?.image;

  return (
    <div
      {...getRootProps({
        className: `relative flex items-center justify-center rounded-md w-14 h-14 cursor-pointer ${
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
          alt={"Uploaded image"} // Display the image name as alt text
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

export const Dropzone = React.memo(DropzoneComponent);
