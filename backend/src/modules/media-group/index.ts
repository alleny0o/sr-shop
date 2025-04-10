import MediaGroupModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const MEDIA_GROUP_MODULE = "mediaGroupModuleService";

export default Module(MEDIA_GROUP_MODULE, {
    service: MediaGroupModuleService,
});