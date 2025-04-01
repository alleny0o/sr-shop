import { AdminProductOption } from "@medusajs/framework/types";
import { OptionConfig, OptionValue } from "../types";

export const optionConfigsMatch = (options: AdminProductOption[] | null, optionConfigs: OptionConfig[]): boolean => {
  if (!options && (!optionConfigs || optionConfigs.length === 0)) return true;
  if (!options || options.length !== optionConfigs.length) return false;
  return options.every((option) => optionConfigs.some((optionUI) => option.id === optionUI.option_id));
};

export const hasOptionConfigChanged = (a: OptionConfig | null, b: OptionConfig | null): boolean => {
  if (!a || !b) return false;
  if (a.display_type !== b.display_type) return true;
  if (a.is_selected !== b.is_selected) return true;
  return false;
};

export const hasOptionValueChanged = (a: OptionValue, b: OptionValue): boolean => {
  if (a.color !== b.color) return true;
  if (a.image !== b.image) return true;
  return false;
};

export const hasChanged = (a: OptionConfig | null, b: OptionConfig | null): boolean => {
  if (!a || !b) return false;
  if (hasOptionConfigChanged(a, b)) return true;
  for (let i = 0; i < b.option_values.length; i++) {
    if (hasOptionValueChanged(a.option_values[i], b.option_values[i])) {
      return true;
    }
  }
  return false;
};
