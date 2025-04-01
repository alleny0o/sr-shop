// // Widget Configuration
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// Widget Props
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";

// JS SDK
import { sdk } from "../../../lib/config";

// React & State Management
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Context
import { OptionConfigsContext } from "./context/option-configs-context";

// Custom Components
import { SectionWrapper } from "../../../components/section-wrapper";
import { SectionLoader } from "../../../components/section-loader";

// Types
import { OptionConfig, OptionConfigType } from "./types";
import { SectionText } from "../../../components/section-text";
import { optionConfigsMatch } from "./utils";
import { OptionConfigsTable } from "./components/option-configs-table";

const OptionConfigsWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const product_id = data.id;
  const options = data.options;
  const optionsKey = JSON.stringify(options);

  const [optionConfigs, setOptionConfigs] = useState<OptionConfig[]>([]);

  const {
    data: optionConfigsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["option-configs", product_id, optionsKey],
    queryFn: () => sdk.client.fetch<{ option_configs: OptionConfigType[] }>(`/admin/product-option_config/product/${product_id}`),
    refetchOnMount: "always",
  });

  useEffect(() => {
    setOptionConfigs([]);
  }, [options]);

  useEffect(() => {
    if (optionConfigsData) {
      console.log("optionConfigsData:", optionConfigsData);
      console.log("optionConfigsData.option_configs:", optionConfigsData?.option_configs);

      const optionConfigs: OptionConfig[] = optionConfigsData.option_configs.map((optionConfig: OptionConfigType) => {
        switch (optionConfig.display_type) {
          case "buttons":
          case "dropdown":
            return {
              id: optionConfig.id,
              product_id: optionConfig.product_id,
              option_id: optionConfig.option_id,
              option_title: optionConfig.option_title,
              display_type: optionConfig.display_type,
              is_selected: optionConfig.is_selected,
              option_values: optionConfig.option_values.map((optionValue) => ({
                id: optionValue.id,
                option_value_id: optionValue.option_value_id,
                color: null,
                image: null,
              })),
            } as OptionConfig;
          case "colors":
            return {
              id: optionConfig.id,
              product_id: optionConfig.product_id,
              option_id: optionConfig.option_id,
              option_title: optionConfig.option_title,
              display_type: optionConfig.display_type,
              is_selected: optionConfig.is_selected,
              option_values: optionConfig.option_values.map((optionValue) => ({
                id: optionValue.id,
                option_value_id: optionValue.option_value_id,
                color: optionValue.color,
                image: null,
              })),
            } as OptionConfig;
          case "images":
            return {
              id: optionConfig.id,
              product_id: optionConfig.product_id,
              option_id: optionConfig.option_id,
              option_title: optionConfig.option_title,
              display_type: optionConfig.display_type,
              is_selected: optionConfig.is_selected,
              option_values: optionConfig.option_values.map((optionValue) => ({
                id: optionValue.id,
                option_value_id: optionValue.option_value_id,
                color: null,
                image: optionValue.image
                  ? {
                      id: optionValue.image.id,
                      file_id: optionValue.image.file_id,
                      name: optionValue.image.name,
                      size: optionValue.image.size,
                      mime_type: optionValue.image.mime_type,
                      url: optionValue.image.url,
                    }
                  : null,
              })),
            } as OptionConfig;
        }
      });

      setOptionConfigs(optionConfigs);
    }
  }, [optionConfigsData]);

  if (isLoading) {
    return (
      <SectionWrapper heading="Option Configurations">
        <SectionLoader height={160} />
      </SectionWrapper>
    );
  }

  if (error || !optionConfigsData) {
    return (
      <SectionWrapper heading="Option Configurations">
        <SectionText message="ERROR: Unable to load or validate option configurations." height={160} />
      </SectionWrapper>
    );
  }

  if (!optionConfigsMatch(options, optionConfigs)) {
    return (
      <SectionWrapper heading="Option Configurations">
        <SectionText message="ERROR: Unable to load or validate option configurations." height={160} />
      </SectionWrapper>
    );
  }

  if (!optionConfigs) {
    return (
      <SectionWrapper heading="Option Configurations">
        <SectionLoader height={160} />
      </SectionWrapper>
    );
  }

  return (
    <OptionConfigsContext.Provider value={optionConfigs}>
      <SectionWrapper heading="Option Configurations">
        {optionConfigs.length === 0 ? (
          <SectionText message="No option configurations found. Create an option first!" height={160} />
        ) : (
          <OptionConfigsTable />
        )}
      </SectionWrapper>
    </OptionConfigsContext.Provider>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.before",
});

export default OptionConfigsWidget;
