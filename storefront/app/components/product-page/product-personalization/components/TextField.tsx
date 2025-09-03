import { memo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FormInput } from '~/components/product-page/product-personalization/components/form/FormInput';
import { FormTextarea } from '~/components/product-page/product-personalization/components/form/FormTextarea';
import { PersonalizationData } from '~/components/product-page/product-personalization/types/personalization';

interface TextFieldProps {
  form: UseFormReturn<PersonalizationData>;
  config: {
    inputHeading: string;
    inputHelperText: string | undefined;
    inputPlaceholder: string | undefined;
    maxCharacters: number;
    isMultiline: boolean;
  };
  onInteraction: () => void;
}

export const TextField = memo(({ form, config, onInteraction }: TextFieldProps) => {
  return (
    <Controller
      name="text"
      control={form.control}
      rules={{
        required: 'Please add text to continue...',
        maxLength: {
          value: config.maxCharacters,
          message: `Text must be ${config.maxCharacters} characters or less...`,
        },
      }}
      render={({ field, fieldState }) =>
        config.isMultiline ? (
          <FormTextarea
            label={config.inputHeading}
            helpText={config.inputHelperText}
            required
            error={fieldState.error?.message}
            maxLength={config.maxCharacters}
            showCharacterCount
            placeholder={config.inputPlaceholder}
            rows={2}
            {...field}
            value={field.value || ''}
            onChange={e => {
              onInteraction();
              field.onChange(e);
            }}
          />
        ) : (
          <FormInput
            label={config.inputHeading}
            helpText={config.inputHelperText}
            required
            error={fieldState.error?.message}
            maxLength={config.maxCharacters}
            placeholder={config.inputPlaceholder}
            {...field}
            value={field.value || ''}
            onChange={e => {
              onInteraction();
              field.onChange(e);
            }}
          />
        )
      }
    />
  );
});

TextField.displayName = 'TextField';
