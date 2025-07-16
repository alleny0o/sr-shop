export type MediaNode = {
  __typename: string;
  id: string;
  alt?: string | null;
  image?: {
    url: string;
  } | null;
  previewImage?: {
    url: string;
  } | null;
  sources?: Array<{
    url: string;
    mimeType: string;
  }> | null;
};
