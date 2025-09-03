import { memo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormImageDropzone } from '~/components/product-page/product-personalization/components/form/FormImageDropzone';
import { PersonalizationData } from '~/components/product-page/product-personalization/types/personalization';

interface ImageFieldProps {
  form: UseFormReturn<PersonalizationData>;
  previewUrl: string | null;
  onInteraction: () => void;
  config: {
    imageHeading?: string;
    imageHelperText?: string;
  };
}

// 🔧 FIXED: No more double Controller - FormImageDropzone owns the field
export const ImageField = memo(({ form, previewUrl, onInteraction, config }: ImageFieldProps) => {
  return (
    <FormImageDropzone
      required
      form={form}
      name="image"
      label={config.imageHeading || "Image"}
      helpText={config.imageHelperText}
      previewUrl={previewUrl}
      imageDimensions={{
        minWidth: 1,
        minHeight: 1,
        maxWidth: 6000,
        maxHeight: 6000,
      }}
      onFileChange={(file: File | null) => {
        onInteraction();
      }}
    />
  );
});

ImageField.displayName = 'ImageField';