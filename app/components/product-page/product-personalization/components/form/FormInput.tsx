import { forwardRef } from 'react';
import { FormField } from './FormField';
import { BaseFormFieldProps } from '~/types/form';

interface FormInputProps extends BaseFormFieldProps {
  type?: 'text' | 'email' | 'tel' | 'url';
  placeholder?: string;
  maxLength?: number;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, required, error, helpText, disabled, placeholder, maxLength, type = 'text', value, onChange, ...props },
    ref,
  ) => {
    return (
      <FormField label={label} required={required} error={error} helpText={helpText}>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={`
            w-full px-2 py-1.5
            bg-transparent border rounded-none
            font-inter text-sm
            placeholder:text-muted
            transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-focus-ring
            disabled:bg-disabled disabled:text-muted disabled:cursor-not-allowed
            ${
              error
                ? 'border-error-border'
                : disabled
                  ? 'border-disabled'
                  : 'border-soft text-primary hover:border-hover'
            }
          `}
          {...props}
        />
      </FormField>
    );
  },
);

FormInput.displayName = 'FormInput';
