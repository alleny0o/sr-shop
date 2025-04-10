"use client"

import { clx } from "@medusajs/ui"
import React, { useState } from "react"
import Image from "next/image"
import { EnrichedOption } from "types/global"
import { ChevronDown } from "lucide-react"

type OptionSelectProps = {
  option: EnrichedOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Handle display type
  const displayType = option.display_type || "buttons";

  // Render options based on display type
  const renderOptions = () => {
    switch (displayType) {
      case "dropdown":
        return (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded px-4 py-2 w-full flex items-center justify-between"
              disabled={disabled}
              data-testid="dropdown-button"
            >
              <span>{current || "Select an option"}</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-ui-border-base rounded-md shadow-lg max-h-60 overflow-auto">
                {option.values.map((optionValue) => (
                  <button
                    key={optionValue.id}
                    onClick={() => {
                      updateOption(option.id, optionValue.value)
                      setIsDropdownOpen(false)
                    }}
                    className={clx(
                      "text-small-regular w-full text-left px-4 py-2 hover:bg-ui-bg-subtle transition-colors duration-150",
                      {
                        "bg-ui-bg-subtle font-medium":
                          optionValue.value === current,
                      }
                    )}
                    disabled={disabled}
                    data-testid="dropdown-option"
                  >
                    {optionValue.value}
                  </button>
                ))}
              </div>
            )}
          </div>
        )

      case "colors":
        return (
          <div className="flex flex-wrap gap-3">
            {option.values.map((optionValue) => {
              // Get color from config if available or use the value itself
              const colorValue = optionValue.config?.color || optionValue.value

              return (
                <button
                  onClick={() => updateOption(option.id, optionValue.value)}
                  key={optionValue.id}
                  style={{ backgroundColor: colorValue }}
                  className={clx(
                    "h-10 w-10 rounded-full border border-ui-border-base transition-all duration-150",
                    {
                      "ring-2 ring-ui-border-interactive ring-offset-1":
                        optionValue.value === current,
                      "hover:shadow-elevation-card-rest":
                        optionValue.value !== current,
                    }
                  )}
                  disabled={disabled}
                  data-testid="color-option"
                  title={optionValue.value}
                />
              )
            })}
          </div>
        )

      case "images":
        return (
          <div className="flex flex-wrap gap-3">
            {option.values.map((optionValue) => {
              // Get image URL from config
              const imageUrl = optionValue.config?.image?.url
              console.log("Image URL:", imageUrl)

              return (
                <button
                  onClick={() => updateOption(option.id, optionValue.value)}
                  key={optionValue.id}
                  className={clx(
                    "h-16 w-16 rounded-md border border-ui-border-base overflow-hidden transition-all duration-150 relative",
                    {
                      "ring-2 ring-ui-border-interactive":
                        optionValue.value === current,
                      "hover:shadow-elevation-card-rest":
                        optionValue.value !== current,
                    }
                  )}
                  disabled={disabled}
                  data-testid="image-option"
                  title={optionValue.value}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={optionValue.value}
                      fill
                      sizes="(max-width: 768px) 64px, 64px"
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      No image
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )

      case "buttons":
      default:
        return (
          <div className="flex flex-wrap justify-between gap-2">
            {option.values.map((optionValue) => (
              <button
                onClick={() => updateOption(option.id, optionValue.value)}
                key={optionValue.id}
                className={clx(
                  "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-2 flex-1",
                  {
                    "border-ui-border-interactive":
                      optionValue.value === current,
                    "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                      optionValue.value !== current,
                  }
                )}
                disabled={disabled}
                data-testid="button-option"
              >
                {optionValue.value}
              </button>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>
      <div data-testid={dataTestId}>{renderOptions()}</div>
    </div>
  )
}

export default OptionSelect
