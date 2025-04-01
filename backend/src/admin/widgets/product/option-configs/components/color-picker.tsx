import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { OptionConfig } from "../types";

type ColorPickerProps = {
  updatedOptionConfig: OptionConfig;
  setUpdatedOptionConfig: (oc: OptionConfig) => void;
  index: number;
};

const ColorPickerComponent = (input: ColorPickerProps) => {
  const { updatedOptionConfig, setUpdatedOptionConfig, index } = input;

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState<"top" | "bottom">("bottom");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const color = updatedOptionConfig.option_values[index].color || "#ffffff";

  const handleChange = (hex: string) => {
    const newOptionValues = [...updatedOptionConfig.option_values];
    newOptionValues[index] = {
      ...newOptionValues[index],
      color: hex,
    };

    setUpdatedOptionConfig({
      ...updatedOptionConfig,
      option_values: newOptionValues,
    });
  };

  const togglePicker = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      setPickerPosition(spaceBelow < 300 && spaceAbove > 300 ? "top" : "bottom");
    }
    setShowColorPicker((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShowColorPicker(false);
    }
  };

  useEffect(() => {
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={togglePicker}
        className={`flex items-center justify-center w-[40px] h-[40px] rounded-full border-2 
          ${color ? "border-gray-500 dark:border-gray-300" : "border-dashed border-gray-500 dark:border-gray-200"}`}
        style={{ backgroundColor: color || "transparent" }}
      >
        {!color && (
          <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-200" />
        )}
      </button>
      {showColorPicker && (
        <div
          ref={pickerRef}
          className={`absolute z-10 ${
            pickerPosition === "top" ? "bottom-[calc(100%+8px)]" : "mt-2"
          }`}
        >
          <HexColorPicker color={color} onChange={handleChange} />
        </div>
      )}
    </div>
  );
};

export const ColorPicker = React.memo(ColorPickerComponent);
