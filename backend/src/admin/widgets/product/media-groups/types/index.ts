import { InferTypeOf } from "@medusajs/framework/types";
import MediaGroupModel from "../../../../../modules/media-group/models/media-group";

export type MediaGroupType = InferTypeOf<typeof MediaGroupModel>;

export type MediaItem = {
  id?: string;
  file_id: string;
  size: number;
  name: string;
  mime_type: string;
  is_thumbnail: boolean;
  file?: File;
};

export type MediaGroup = {
  id?: string;
  product_id: string;
  uuid: string;
  media_tag?: string;
  medias: MediaItem[];
};
