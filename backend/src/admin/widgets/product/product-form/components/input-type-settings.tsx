// Components
import { Label } from "./form-fields/label";
import { Description } from "./form-fields/description";
import { Placeholder } from "./form-fields/placeholder";
import { Image } from "./form-fields/image";
import { Required } from "./form-fields/required";
import { Options } from "./form-fields/dropdown/options";
import { MaxImages } from "./form-fields/images/max-images";
import { MaxFileSize } from "./form-fields/images/max-file-size";
import { ImageRatios } from "./form-fields/images/image-ratios";

type InputTypeSettingsProps = {
  input_type: "text" | "textarea" | "dropdown" | "images";
};

export const InputTypeSettings = ({ input_type }: InputTypeSettingsProps) => {
  return (
    <>
      <Label />
      <Description />
      {["text", "textarea", "dropdown"].includes(input_type) && <Placeholder />}
      {["dropdown"].includes(input_type) && <Options />}
      {["images"].includes(input_type) && (
        <>
          <MaxImages />
          <MaxFileSize />
          <ImageRatios />
        </>
      )}
      <Image />
      <Required />
    </>
  );
};
