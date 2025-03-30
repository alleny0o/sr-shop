import OptionUIModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const OPTION_UI_MODULE = "optionUIModuleService";

export default Module(OPTION_UI_MODULE, {
    service: OptionUIModuleService,
});