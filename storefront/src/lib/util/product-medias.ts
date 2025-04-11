import { EnrichedProduct } from "types/global";

type MediaReturn = {
  id: string;
  url: string;
  name: string;
  is_thumbnail?: boolean;
  mime_type: "image" | "video";
};

type ProductDisplayMediaResult = {
  mediaTag: number | null;
  medias: MediaReturn[];
};

export function getProductDisplayMedia(
  product: EnrichedProduct,
  selectedOptions: Record<string, string | undefined>
): ProductDisplayMediaResult {
  const selectedKeys = Object.keys(selectedOptions);

  // Filter variants based on selected options
  const matchingVariants = product.variants?.filter((variant) =>
    selectedKeys.every((key) =>
      variant.options?.some(
        (opt) => opt.option_id === key && opt.value === selectedOptions[key]
      )
    )
  ) ?? [];

  // Full match — if there's one variant matching the selected options, use its media directly.
  if (matchingVariants.length === 1) {
    const [fullMatchVariant] = matchingVariants;
    if (fullMatchVariant.medias?.length) {
      return {
        mediaTag: fullMatchVariant.media_tag?.value || null,
        medias: fullMatchVariant.medias.map((m, i) => ({
          id: m.id,
          url: m.url,
          name: m.name ?? `Media [${i + 1}]`,
          is_thumbnail: m.is_thumbnail,
          mime_type: m.mime_type?.startsWith("image") ? "image" : "video",
        })),
      };
    }
  }

  // Shared media_tag match — if all matching variants share the same media_tag,
  // select one of those variants and return its media along with the shared tag.
  const uniqueTags = new Set(
    matchingVariants.map((v) => v.media_tag?.value).filter(Boolean)
  );

  if (uniqueTags.size === 1) {
    const [sharedTag] = Array.from(uniqueTags);
    const taggedVariant = matchingVariants.find(
      (v) => v.media_tag?.value === sharedTag
    );
    if (taggedVariant?.medias?.length) {
      return {
        mediaTag: sharedTag || null,
        medias: taggedVariant.medias.map((m, i) => ({
          id: m.id,
          url: m.url,
          name: m.name ?? `Media [${i + 1}]`,
          is_thumbnail: m.is_thumbnail,
          mime_type: m.mime_type?.startsWith("image") ? "image" : "video",
        })),
      };
    }
  }

  // Fallback — if no proper match is found, return product images with mediaTag set to null.
  return {
    mediaTag: null,
    medias: product.images?.map((img, i) => ({
      id: img.id,
      url: img.url,
      name: `Image [${i + 1}]`,
      mime_type: "image",
    })) ?? [],
  };
}
