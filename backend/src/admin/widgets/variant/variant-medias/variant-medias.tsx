// Widget Configuration
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// Widget Props
import { DetailWidgetProps, AdminProductVariant } from "@medusajs/framework/types";

// React & State Management
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// JS SDK
import { sdk } from "../../../lib/config";

// Context
import { VariantContext } from "./context/variant-context";

// Local Types
import { Media } from "./types";

// Custom Components
import { EditMediaModal } from "./modals/edit-media-modal";
import { SectionWrapper } from "../../../components/section-wrapper";
import { SectionLoader } from "../../../components/section-loader";
import { SectionText } from "../../../components/section-text";
import { MediaDisplayItem } from "./components/media-display-item";

const VariantMediasWidget = ({ data }: DetailWidgetProps<AdminProductVariant>) => {
  // Variant Medias State
  const [variantMedias, setVariantMedias] = useState<Media[]>([]);

  // Fetch Variant Medias
  const {
    data: variantMediasData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["variant-medias", data.id],
    queryFn: () => {
      return sdk.client.fetch<{ variant_medias: Media[] }>(`/admin/product-variant_medias/variant/${data.id}`);
    },
    refetchOnMount: "always",
  });

  // Update Variant Medias State Once Data is Fetched
  useEffect(() => {
    if (variantMediasData?.variant_medias) {
      setVariantMedias(variantMediasData.variant_medias);
    }
  }, [variantMediasData]);

  // Loading Page State
  if (isLoading) {
    return (
      <SectionWrapper heading="Media">
        <SectionLoader height={160} />
      </SectionWrapper>
    );
  }

  // Error Page State
  if (error || !data.product_id || !variantMediasData) {
    console.error(error);
    console.error(error?.message);

    return (
      <SectionWrapper heading="Media">
        <SectionText message="ERROR: Failed to load variant medias." height={160} />
      </SectionWrapper>
    );
  }

  return (
    <VariantContext.Provider value={{ variant_id: data.id, product_id: data.product_id }}>
      <SectionWrapper heading="Media" component={<EditMediaModal variantMedias={variantMedias} setVariantMedias={setVariantMedias} />}>
        {variantMedias.length > 0 ? (
          <div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-4 px-6 py-4">
              {variantMedias.map((media) => (
                <MediaDisplayItem key={media.file_id} media={media} />
              ))}
            </div>
          </div>
        ) : (
          <SectionText message="No media created for this variant. Click edit to add your first media :)" height={160} />
        )}
      </SectionWrapper>
    </VariantContext.Provider>
  );
};

export const config = defineWidgetConfig({
  zone: "product_variant.details.after",
});

export default VariantMediasWidget;
