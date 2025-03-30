import { useState, KeyboardEvent } from "react";
import { XMarkMini } from "@medusajs/icons";
import {
  Control,
  useController,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

interface TagInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  validationRegex?: RegExp;
}

export const TagInput = <T extends FieldValues>({
  name,
  control,
  placeholder = "Type and press enter or comma to add...",
  validationRegex = /^.+$/,
}: TagInputProps<T>) => {
  const [inputValue, setInputValue] = useState("");

  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: [] as PathValue<T, Path<T>>,
  });

  const tags: string[] = Array.isArray(value) ? value : [];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const newValue = inputValue.trim();

      if (
        newValue &&
        validationRegex.test(newValue) &&
        !tags.includes(newValue)
      ) {
        onChange([...tags, newValue]);
        setInputValue("");
      }
    }

    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      onChange(newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
  };

  return (
    <div
      className={`shadow-borders-base flex min-h-8 flex-wrap items-center gap-1 rounded-md px-2 py-1.5 transition-fg focus-within:shadow-borders-interactive-with-active has-[input:disabled]:bg-ui-bg-disabled has-[input:disabled]:text-ui-fg-disabled has-[input:disabled]:cursor-not-allowed bg-ui-bg-field hover:bg-ui-bg-field-hover`}
      tabIndex={-1}
    >
      {tags.map((tag) => (
        <div
          key={tag}
          className="bg-ui-tag-neutral-bg text-ui-tag-neutral-text [&_svg]:text-ui-tag-neutral-icon border-ui-tag-neutral-border inline-flex items-center border box-border txt-compact-xsmall-plus h-5 rounded-md px-1 gap-x-0.5 pl-1.5 transition-fg pr-1"
        >
          {tag}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => removeTag(tag)}
            className="text-ui-fg-subtle transition-fg outline-none"
          >
            <XMarkMini />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="caret-ui-fg-base text-ui-fg-base txt-compact-small flex-1 appearance-none bg-transparent disabled:text-ui-fg-disabled disabled:cursor-not-allowed focus:outline-none placeholder:text-ui-fg-muted min-w-[120px]"
        placeholder={tags.length === 0 ? placeholder : ""}
        autoComplete="off"
      />
    </div>
  );
};
