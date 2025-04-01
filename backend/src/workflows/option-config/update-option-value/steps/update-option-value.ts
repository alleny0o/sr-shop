import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionConfigModuleService from "../../../../modules/option-config/service";
import { OPTION_CONFIG_MODULE } from "../../../../modules/option-config";
import { OptionValueType } from "../../types";

type Image = {
  file_id: string;
  name: string;
  size: number;
  mime_type: string;
  url: string;
};

export type UpdateOptionValueStepInput = {
  id: string;
  option_value_id?: string;
  color?: string;
  image?: Image;
};

const updateOptionValueStep = createStep(
  "update-option-value-step",
  async (input: UpdateOptionValueStepInput, { container }) => {
    const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);

    const optionValue = await optionConfigModuleService.retrieveOptionValue(input.id);

    const updatedOptionValue = await optionConfigModuleService.updateOptionValues({
      id: input.id,
      ...(input.option_value_id && { option_value_id: input.option_value_id }),
      ...(input.color && { color: input.color }),
    });

    const oldOptionImage = await optionConfigModuleService.listOptionImages({
      option_value_id: updatedOptionValue.id,
    });

    let createdOptionImage: any = null;
    if (input.image && oldOptionImage.length === 0) {
      createdOptionImage = await optionConfigModuleService.createOptionImages({
        file_id: input.image.file_id,
        name: input.image.name,
        size: input.image.size,
        mime_type: input.image.mime_type,
        url: input.image.url,
        option_value_id: updatedOptionValue.id,
      });
    } else if (input.image && oldOptionImage.length > 0) {
      createdOptionImage = await optionConfigModuleService.updateOptionImages({
        id: oldOptionImage[0].id,
        file_id: input.image.file_id,
        name: input.image.name,
        size: input.image.size,
        mime_type: input.image.mime_type,
        url: input.image.url,
      });
    }

    return new StepResponse(updatedOptionValue, {
      optionValue: optionValue,
      createdOptionImage: createdOptionImage,
    });
  },
  async ({ optionValue, createdOptionImage }: { optionValue: OptionValueType; createdOptionImage: any }, { container }) => {
    const optionConfigModuleService: OptionConfigModuleService = container.resolve(OPTION_CONFIG_MODULE);

    if (createdOptionImage) {
      await optionConfigModuleService.deleteOptionImages(createdOptionImage.id);
    }

    await optionConfigModuleService.updateOptionValues({
      id: optionValue.id,
      ...(optionValue.option_value_id && { option_value_id: optionValue.option_value_id }),
      ...(optionValue.color && { color: optionValue.color }),
    });
  }
);

export default updateOptionValueStep;
