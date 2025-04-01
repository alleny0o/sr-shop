import { MedusaService } from "@medusajs/framework/utils";
import MediaTag from "./models/media-tag";

class MediaTagModuleService extends MedusaService({
    MediaTag,
}) {};

export default MediaTagModuleService;