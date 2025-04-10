import MediaGroup from "../../modules/media-group/models/media-group";
import MediaItem from "../../modules/media-group/models/media-item";
import { InferTypeOf } from "@medusajs/framework/types";

export type MediaGroupType = InferTypeOf<typeof MediaGroup>;
export type MediaItemType = InferTypeOf<typeof MediaItem>;

export type MediaItem = {
    file_id: string;
    size: number;
    name: string;
    mime_type: string;
    is_thumbnail: boolean;
    url: string;
};