import React, { forwardRef } from 'react';
import { FormField } from './FormField';
import { BaseFormFieldProps, RadioOption } from '~/types/form';

interface FormRadioGroupProps extends BaseFormFieldProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  headerAction?: React.ReactNode;
}

export const FormRadioGroup = forwardRef<HTMLInputElement, FormRadioGroupProps>(
  ({ label, required, error, helpText, disabled, options, value, onChange, name, headerAction }, ref) => {
    return (
      <FormField
        label={label}
        required={required}
        error={error}
        helpText={helpText}
        headerAction={headerAction}
        className="space-y-2"
      >
        <div className="space-y-1.5">
          {options.map((option, index) => (
            <label
              key={option.value}
              className={`
                flex items-start gap-3 cursor-pointer font-inter group
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              {/* Hidden native radio input */}
              <input
                ref={index === 0 ? ref : undefined}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={e => onChange?.(e.target.value)}
                disabled={disabled}
                className="sr-only peer"
              />

              {/* Custom radio circle */}
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className={`
                    w-4 h-4 rounded-full border transition-colors duration-150
                    flex items-center justify-center
                    peer-focus-visible:ring-1 peer-focus-visible:ring-focus-ring
                    ${
                      error
                        ? 'border-red-500'
                        : disabled
                          ? 'border-disabled'
                          : value === option.value
                            ? 'border-strong'
                            : 'border-soft group-hover:border-hover'
                    }
                  `}
                >
                  {value === option.value && (
                    <div
                      className={`
                        w-2 h-2 rounded-full
                        ${error ? 'bg-red-500' : disabled ? 'bg-disabled' : 'bg-primary'}
                      `}
                    />
                  )}
                </div>
              </div>

              {/* Label + optional description */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-normal ${disabled ? 'text-muted' : 'text-primary'}`}>
                  {option.label}
                </div>
                {option.description && (
                  <div className={`text-xs mt-1 ${error ? 'text-red-600' : disabled ? 'text-muted' : 'text-secondary'}`}>
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </FormField>
    );
  }
);

FormRadioGroup.displayName = 'FormRadioGroup';
