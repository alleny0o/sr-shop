import { InferTypeOf } from "@medusajs/framework/types";
import OptionImage from "../../modules/option-config/models/option-image";
import OptionConfig from "../../modules/option-config/models/option-config";
import OptionValue from "../../modules/option-config/models/option-value";

export type ImageType = InferTypeOf<typeof OptionImage>;
export type OptionConfigType = InferTypeOf<typeof OptionConfig>;
export type OptionValueType = InferTypeOf<typeof OptionValue>;