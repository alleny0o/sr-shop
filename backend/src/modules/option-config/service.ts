import { MedusaService } from "@medusajs/framework/utils";
import OptionConfig from "./models/option-config";
import OptionValue from "./models/option-value";
import OptionImage from "./models/option-image";

class OptionConfigModuleService extends MedusaService({
    OptionConfig,
    OptionValue,
    OptionImage,
}) {};

export default OptionConfigModuleService;