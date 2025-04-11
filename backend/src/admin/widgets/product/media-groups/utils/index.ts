import { MediaItem, PlainMediaGroup } from "../types";

export const compareMediaArrays = (a?: MediaItem[], b?: MediaItem[]): boolean => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return a.every((media, index) => media.file_id === b[index].file_id && media.is_thumbnail === b[index].is_thumbnail);
};

export const compareMediaGroups = (a?: PlainMediaGroup, b?: PlainMediaGroup): boolean => {
  if (!a || !b) return false;
  return a.id === b.id && a.product_id === b.product_id && a.uuid === b.uuid && a.media_tag === b.media_tag;
};
