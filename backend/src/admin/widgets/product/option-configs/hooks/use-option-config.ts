// Types
import { OptionConfig } from "../types";

// React & State Management
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

// UI Components
import { toast } from "@medusajs/ui";

// Services
import { updateOptionCofig, updateOptionValue, updateColorOptionValue, updateImageOptionValue } from "../services";

// Utils
import { hasChanged, hasOptionConfigChanged } from "../utils";

type UseOptionConfigProps = {
  optionConfig: OptionConfig;
  setOpen: (open: boolean) => void;
};

export const useOptionConfig = ({ optionConfig, setOpen }: UseOptionConfigProps) => {
  const queryClient = useQueryClient();

  const [updatedOptionConfig, setUpdatedOptionConfig] = useState<OptionConfig>(optionConfig);

  useEffect(() => {
    setUpdatedOptionConfig(optionConfig);
  }, [optionConfig]);

  const [promptVisible, setPromptVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDisplayTypeChange = (displayType: OptionConfig["display_type"]) => {
    setUpdatedOptionConfig((prev) => ({
      ...prev,
      display_type: displayType,
    }));
  };

  const handleIsSelectedChange = (isSelected: OptionConfig["is_selected"]) => {
    setUpdatedOptionConfig((prev) => ({
      ...prev,
      is_selected: isSelected,
    }));
  };

  const handleSave = async () => {
    if (!hasChanged(optionConfig, updatedOptionConfig)) {
      toast.success("Option configuration was successfully updated.");
      setOpen(false);
      return;
    }

    setSaving(true);

    try {
      if (hasOptionConfigChanged(optionConfig, updatedOptionConfig)) await updateOptionCofig(updatedOptionConfig);

      switch (updatedOptionConfig.display_type) {
        case "buttons":
        case "dropdown":
          await Promise.all(updatedOptionConfig.option_values.map((value) => updateOptionValue(value)));
          break;
        case "colors":
          await Promise.all(updatedOptionConfig.option_values.map((value) => updateColorOptionValue(value)));
          break;
        case "images":
          await Promise.all(updatedOptionConfig.option_values.map((value) => updateImageOptionValue(value)));
          break;
        default:
          throw new Error("Unsupported display type");
      }
      toast.success("Option configuration was successfully updated.");
    } catch (error) {
      console.error("Failed to update option configuration:", error);
      toast.error("Failed to update option configuration.");
    } finally {
      setSaving(false);
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["option-configs", updatedOptionConfig.product_id],
      });
    }
  };
  return {
    updatedOptionConfig,
    setUpdatedOptionConfig,
    handleDisplayTypeChange,
    handleIsSelectedChange,
    handleSave,
    saving,
    promptVisible,
    setPromptVisible,
  };

};
