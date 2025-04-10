import MediaGroup from "../../modules/media-group/models/media-group";
import { InferTypeOf } from "@medusajs/framework/types";

export type MediaGroupType = InferTypeOf<typeof MediaGroup>;

export type Media = {
    file_id: string;
    size: number;
    name: string;
    mime_type: string;
    is_thumbnail: boolean;
    url: string;
};