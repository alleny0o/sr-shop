import MediaTagModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const MEDIA_TAG_MODULE = "mediaTagModuleService";

export default Module(MEDIA_TAG_MODULE, {
    service: MediaTagModuleService,
});