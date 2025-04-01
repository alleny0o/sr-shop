import OptionConfigModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const OPTION_CONFIG_MODULE = "optionConfigModuleService";

export default Module(OPTION_CONFIG_MODULE, {
    service: OptionConfigModuleService,
});