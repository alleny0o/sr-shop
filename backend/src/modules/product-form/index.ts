import ProductFormModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const PRODUCT_FORM_MODULE = "productFormModuleService";

export default Module(PRODUCT_FORM_MODULE, {
    service: ProductFormModuleService,
});