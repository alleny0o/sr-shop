// UI Components
import { Badge, Button, Container, Label, Select, Switch, Text, Tooltip } from "@medusajs/ui";
import { CheckCircle, InformationCircle } from "@medusajs/icons";

// Medusa Types
import { AdminProductOptionValue } from "@medusajs/framework/types";

// Types
import { OptionConfig } from "../types";

// Hooks
import { useOptionConfig } from "../hooks/use-option-config";

// React & State Management
import { useQuery } from "@tanstack/react-query";

// JS SDK
import { sdk } from "../../../../lib/config";

// Utils
import { hasChanged } from "../utils";

// Custom Components
import { DrawerWrapper } from "../../../../components/drawer-wrapper";
import { ConfirmPrompt } from "../../../../components/confirm-prompt";
import { Dropzone } from "../components/dropzone";
import { ColorPicker } from "../components/color-picker";
import { useEffect } from "react";

type OptionConfigDrawerProps = {
  optionConfig: OptionConfig;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const OptionConfigDrawer = ({ optionConfig, open, setOpen }: OptionConfigDrawerProps) => {
  // use-handle-save
  const {
    updatedOptionConfig,
    setUpdatedOptionConfig,
    handleDisplayTypeChange,
    handleIsSelectedChange,
    handleIsPrimaryOptionChange,
    handleSave,
    saving,
    promptVisible,
    setPromptVisible,
  } = useOptionConfig({
    optionConfig,
    setOpen,
  });

  useEffect(() => {
    if (!open) {
      document.body.style.pointerEvents = "auto"; // restore pointer interaction
      document.body.style.overflow = "auto";
    }
  }, [open]);

  // handlers to manage interactions with the drawer
  const handleDrawerClose = () => {
    if (hasChanged(optionConfig, updatedOptionConfig)) {
      setPromptVisible(true);
    } else {
      setOpen(false);
    }
  };

  const confirmDiscardChanges = () => {
    setPromptVisible(false);
    setOpen(false);
    setUpdatedOptionConfig(optionConfig);
  };

  const searchParams = new URLSearchParams();
  for (const value of updatedOptionConfig.option_values) {
    searchParams.append("ids[]", value.option_value_id);
  }

  if (searchParams.size === 0) {
    return (
      <>
        {open && (
          <DrawerWrapper
            open={open}
            openChange={() => setOpen(false)}
            heading={`Edit Option - ${updatedOptionConfig.option_title}`}
          >
            <div className="size-full flex justify-center items-center">
              <Text size="base" className="text-gray-500">
                No option values to load. Add at least one option value to edit!
              </Text>
            </div>
          </DrawerWrapper>
        )}
      </>
    );
  }

  const {
    data: optionValues,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["option-values", searchParams.toString()],
    queryFn: async () =>
      sdk.client.fetch<{ real_option_values: AdminProductOptionValue[] }>(
        `/admin/product-option_config/option-values?${searchParams.toString()}`
      ),
  });

  if (isLoading) {
    return (
      <>
        {open && (
          <DrawerWrapper
            open={open}
            openChange={(open) => setOpen(!open)}
            heading={`Edit Option - ${updatedOptionConfig.option_title}`}
          >
            <div className="size-full flex justify-center items-center">
              <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-10 flex justify-center items-center text-yellow-700"></div>
            </div>
          </DrawerWrapper>
        )}
      </>
    );
  }

  if (error) {
    return (
      <>
        {open && (
          <DrawerWrapper
            open={open}
            openChange={(open) => setOpen(!open)}
            heading={`Edit Option - ${updatedOptionConfig.option_title}`}
          >
            <div className="size-full flex justify-center items-center">
              <Badge color="red" size="base">
                ERROR: Couldn't load option values. Please reload the page.
              </Badge>
            </div>
          </DrawerWrapper>
        )}
      </>
    );
  }

  return (
    <>
      {open && (
        <DrawerWrapper
          open={open}
          openChange={() => {
            if (hasChanged(optionConfig, updatedOptionConfig)) {
              setPromptVisible(true);
            } else {
              setOpen(false);
            }
          }}
          heading={`Edit Option - ${updatedOptionConfig.option_title}`}
          footer={
            <>
              <Button size="small" variant="secondary" onClick={handleDrawerClose}>
                Cancel
              </Button>
              <Button size="small" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </>
          }
        >
          {/* Option Title */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-x-1">
              <Label weight="plus" size="small">
                Option title
              </Label>
            </div>
            <div className="relative">
              <div className="cursor-not-allowed shadow-borders-base flex min-h-8 flex-wrap items-center gap-1 rounded-md px-2 py-1.5 transition-fg focus-within:shadow-borders-interactive-with-active has-[input:disabled]:bg-ui-bg-disabled has-[input:disabled]:text-ui-fg-disabled has-[input:disabled]:cursor-not-allowed bg-ui-bg-field hover:bg-ui-bg-field-hover">
                <span className="txt-compact-small">{updatedOptionConfig.option_title}</span>
              </div>
            </div>
          </div>

          {/* Is Primary Option? */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-x-2">
              <Switch
                id="is-primary-option"
                checked={updatedOptionConfig.is_primary_option}
                onClick={() => handleIsPrimaryOptionChange(!updatedOptionConfig.is_primary_option)}
              />
              <Label weight="plus" size="small">
                Is this the primary option for the product?
              </Label>
            </div>
          </div>

          {/* Is Selected? */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-x-2">
              <Switch
                id="is-selected"
                checked={updatedOptionConfig.is_selected}
                onClick={() => handleIsSelectedChange(!updatedOptionConfig.is_selected)}
              />
              <Label weight="plus" size="small">
                Is this option selected by default?
              </Label>
            </div>
          </div>

          {/* Display Type */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-x-1">
              <Label weight="plus" size="small">
                Display type
              </Label>
            </div>
            <div>
              <Select value={updatedOptionConfig.display_type} onValueChange={handleDisplayTypeChange}>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value={"buttons"}>Buttons</Select.Item>
                  <Select.Item value={"dropdown"}>Dropdown</Select.Item>
                  <Select.Item value={"images"}>Images</Select.Item>
                  <Select.Item value={"colors"}>Colors</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>

          {/* Edit Option Variations */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <Label weight="plus" size="small">
                {updatedOptionConfig.option_values.length >= 1 ? "Edit option values:" : "No option values to edit"}
              </Label>
              <Tooltip content="When updating option values for an option, first remove all existing option values before re-adding them. This ensures predictable ordering and accurate display on the storefront.">
                <InformationCircle />
              </Tooltip>
            </div>
            <div className="flex flex-wrap gap-y-3">
              {isSuccess ? (
                <>
                  {updatedOptionConfig.option_values.map((value, index) => {
                    const valueName = optionValues?.real_option_values.find((v) => v.id === value.option_value_id)?.value;

                    return (
                      <Container key={value.id} className="items-start flex flex-col space-y-2 px-3 py-2">
                        <div className="inline-flex gap-x-1 items-center">
                          <Label size="xsmall">Option value:</Label>
                          <Badge size="2xsmall" color="grey" className="inline-flex">
                            {valueName}
                          </Badge>
                        </div>

                        {/* If display type is buttons or dropdown */}
                        {(updatedOptionConfig.display_type === "buttons" || updatedOptionConfig.display_type === "dropdown") && (
                          <div className="flex items-center gap-x-1">
                            <Text size="xsmall" className="text-zinc-500 dark:text-zinc-400">
                              Nothing to edit for this display type
                            </Text>
                            <CheckCircle className="text-zinc-500 dark:text-zinc-400" />
                          </div>
                        )}

                        {/* If display type is colors */}
                        {updatedOptionConfig.display_type === "colors" && (
                          <div className="flex items-center gap-x-1">
                            <ColorPicker
                              updatedOptionConfig={updatedOptionConfig}
                              setUpdatedOptionConfig={setUpdatedOptionConfig}
                              index={index}
                            />
                          </div>
                        )}

                        {/* If display type is images */}
                        {updatedOptionConfig.display_type === "images" && (
                          <div className="inline-flex items-center gap-x-1">
                            <Dropzone
                              updatedOptionConfig={updatedOptionConfig}
                              setUpdatedOptionConfig={setUpdatedOptionConfig}
                              index={index}
                            />
                          </div>
                        )}
                      </Container>
                    );
                  })}
                </>
              ) : (
                <>
                  <Container className="flex justify-center items-center min-h-48">
                    <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-10 flex justify-center items-center text-yellow-700"></div>
                  </Container>
                </>
              )}
            </div>
          </div>
        </DrawerWrapper>
      )}

      {/* Prompt to confirm discard changes */}
      <ConfirmPrompt
        title="Are you sure you want to leave this form?"
        description="You have unsaved changes that will be lost if you exit this form."
        open={promptVisible}
        onClose={() => setPromptVisible(false)}
        onConfirm={confirmDiscardChanges}
        onCancel={() => setPromptVisible(false)}
      />
    </>
  );
};
