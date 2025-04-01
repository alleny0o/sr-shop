export type Image = | {
    id: string;
    file_id: string;
    name: string;
    size: number;
    mime_type: string;
    url: string;
} | {
    temp_url: string;
    file: File;
};

export type OptionValue = {
    id: string;
    option_value_id: string;
    color: string | null;
    image: Image | null;
};

export type OptionConfig = {
    id: string;
    product_id: string;
    option_id: string;
    option_title: string;
    is_selected: boolean;
    display_type: "buttons" | "dropdown" | "colors" | "images";
    option_values: OptionValue[];
};

import { InferTypeOf } from "@medusajs/framework/types";
import RealOptionConfig from "../../../../../modules/option-config/models/option-config";
import RealOptionValue from "../../../../../modules/option-config/models/option-value";

export type OptionConfigType = InferTypeOf<typeof RealOptionConfig>;
export type OptionValueType = InferTypeOf<typeof RealOptionValue>;