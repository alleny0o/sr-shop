import VariantMediaModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const VARIANT_MEDIA_MODULE = "variantMediaModuleService";

export default Module(VARIANT_MEDIA_MODULE, {
    service: VariantMediaModuleService,
});