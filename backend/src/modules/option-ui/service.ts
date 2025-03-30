import { MedusaService } from "@medusajs/framework/utils";
import OptionUI from "./models/option-ui";
import OptionValue from "./models/option-value";
import OptionImage from "./models/option-image";

class OptionUIModuleService extends MedusaService({
    OptionUI,
    OptionValue,
    OptionImage,
}) {};

export default OptionUIModuleService;