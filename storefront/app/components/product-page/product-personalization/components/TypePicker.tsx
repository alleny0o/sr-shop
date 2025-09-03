import { memo } from 'react';
import { FormRadioGroup } from '~/components/product-page/product-personalization/components/form/FormRadioGroup';
import { ParsedPersonalization } from '~/components/product-page/product-personalization/types/personalization';

interface TypePickerProps {
  name?: string;
  options: ParsedPersonalization[];
  value: string; // controlled by RHF via Controller
  onChange: (eOrVal: React.ChangeEvent<HTMLInputElement> | string) => void;
  error?: string;
}

export const TypePicker = memo(({ name = 'type', options, value, onChange, error }: TypePickerProps) => {
  return (
    <FormRadioGroup
      label="Options"
      required
      error={error}
      name={name}
      value={value}
      onChange={onChange}
      options={options.map(option => ({
        value: option.key,
        label: option.label,
      }))}
    />
  );
});

TypePicker.displayName = 'TypePicker';
