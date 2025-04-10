import { MedusaService } from "@medusajs/framework/utils";
import MediaGroup from "./models/media-group";
import MediaItem from "./models/media-item";

class MediaGroupModuleService extends MedusaService({
    MediaGroup,
    MediaItem,
}) {};

export default MediaGroupModuleService;