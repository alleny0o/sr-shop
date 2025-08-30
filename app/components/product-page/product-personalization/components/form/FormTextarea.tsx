import { forwardRef } from 'react';
import { FormField } from './FormField';
import { BaseFormFieldProps } from '~/types/form';

interface FormTextareaProps extends BaseFormFieldProps {
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  showCharacterCount?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps & { value?: string }>(
  (
    {
      label,
      required,
      error,
      helpText,
      disabled,
      placeholder,
      maxLength,
      rows = 4,
      showCharacterCount,
      value = '',
      onChange,
      ...props
    },
    ref,
  ) => {
    const characterCount = value?.length || 0;
    const isNearLimit = maxLength && characterCount > maxLength * 0.8;

    return (
      <FormField
        label={label}
        required={required}
        error={error}
        helpText={helpText}
        footer={
          showCharacterCount && maxLength ? (
            <div className={`text-xs ${isNearLimit ? 'text-error-text' : 'text-primary'}`}>{maxLength - characterCount}</div>
          ) : null
        }
      >
        <div className="relative">
          <textarea
            ref={ref}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
            disabled={disabled}
            value={value}
            onChange={onChange}
            className={`
              w-full px-2 py-1.5 rounded-none
              bg-transparent border
              font-inter font-light text-xs
              placeholder:text-muted placeholder:text-xs
              transition-colors duration-150
              resize-y max-h-20
              focus:outline-none
              disabled:text-muted disabled:cursor-not-allowed
              ${
                error
                  ? 'border-error-border'
                  : disabled
                    ? 'border-disabled'
                    : 'border-soft text-primary focus:border-strong'
              }
            `}
            {...props}
          />
        </div>
      </FormField>
    );
  },
);

FormTextarea.displayName = 'FormTextarea';