import { MedusaService } from "@medusajs/framework/utils";
import MediaGroup from "./models/media-group";
import Media from "./models/media";

class MediaGroupModuleService extends MedusaService({
    MediaGroup,
    Media,
}) {};

export default MediaGroupModuleService;