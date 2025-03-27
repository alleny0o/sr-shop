import { MedusaService } from "@medusajs/framework/utils";
import VariantMedia from "./models/variant-media";

class VariantMediaModuleService extends MedusaService({
    VariantMedia,
}) {};

export default VariantMediaModuleService;