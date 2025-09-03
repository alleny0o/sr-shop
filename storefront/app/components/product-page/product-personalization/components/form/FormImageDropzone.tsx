import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Upload, Trash2 } from 'lucide-react';
import { FormField } from '~/components/product-page/product-personalization/components/form/FormField';
import { cn } from '~/utils/cn';

interface ImageDimensions {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

interface FormImageDropzoneProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  required?: boolean;
  maxSize?: number;
  className?: string;
  previewUrl?: string | null;
  onFileChange?: (file: File | null) => void;
  imageDimensions?: ImageDimensions;
  helpText?: string;
}

// Helper function to validate image dimensions
const validateImageDimensions = (file: File, dimensions: ImageDimensions): Promise<string | null> => {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url); // Clean up

      const { width, height } = img;
      const { minWidth, maxWidth, minHeight, maxHeight } = dimensions;

      // Check width limits
      if (minWidth && width < minWidth) {
        resolve(`Image width must be at least ${minWidth}px (current: ${width}px)`);
        return;
      }

      if (maxWidth && width > maxWidth) {
        resolve(`Image width must be at most ${maxWidth}px (current: ${width}px)`);
        return;
      }

      // Check height limits
      if (minHeight && height < minHeight) {
        resolve(`Image height must be at least ${minHeight}px (current: ${height}px)`);
        return;
      }

      if (maxHeight && height > maxHeight) {
        resolve(`Image height must be at most ${maxHeight}px (current: ${height}px)`);
        return;
      }

      resolve(null); // No errors
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve('Invalid image file');
    };

    img.src = url;
  });
};

export const FormImageDropzone = (props: FormImageDropzoneProps) => {
  const {
    form,
    name,
    label,
    required,
    maxSize = 10 * 1024 * 1024,
    className,
    previewUrl,
    onFileChange,
    imageDimensions,
    helpText,
  } = props;

  return (
    <Controller
      name={name}
      control={form.control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleFileChange = useCallback(
          (file: File | null) => {
            onChange(file);
            onFileChange?.(file);
            if (file) form.clearErrors(name);
          },
          [onChange, onFileChange, form, name],
        );

        const onDrop = useCallback(
          async (acceptedFiles: File[]) => {
            if (!acceptedFiles.length) return;

            const file = acceptedFiles[0];

            // Validate dimensions if specified
            if (imageDimensions) {
              const dimensionError = await validateImageDimensions(file, imageDimensions);
              if (dimensionError) {
                form.setError(name, { message: dimensionError });
                return;
              }
            }

            handleFileChange(file);
          },
          [handleFileChange, imageDimensions, form, name],
        );

        const removeFile = useCallback(() => {
          handleFileChange(null);
        }, [handleFileChange]);

        // Strict: only formats we actually support end-to-end
        const ACCEPT: Record<string, string[]> = {
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png'],
        };

        const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
          onDrop,
          accept: ACCEPT,
          maxFiles: 1,
          maxSize,
          multiple: false,
          onDropRejected: rejections => {
            const msg = rejections.flatMap(r => r.errors.map(e => e.message)).join('\n') || 'Unsupported file.';
            form.setError(name, { message: msg });
          },
        });

        return (
          <FormField label={label} required={required} error={error?.message} helpText={helpText}>
            <div className="space-y-3">
              <div
                {...getRootProps()}
                className={cn(
                  'group relative cursor-pointer rounded-none border px-4 py-3 transition-all duration-200 overflow-hidden',
                  'hover:border-slate-500 hover:shadow-sm',
                  'active:scale-[0.98]',
                  'focus:outline-none focus:ring-2 focus:ring-pastel-blue-dark focus:ring-offset-2',
                  isDragActive ? 'border-slate-500 shadow-md scale-[1.01]' : 'bg-white border-soft',
                  error && 'border-error-border bg-error-bg',
                  className,
                )}
              >
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-200 pointer-events-none',
                    'group-hover:opacity-100',
                    isDragActive ? 'opacity-100 bg-blue-50/70' : 'opacity-0 bg-slate-50/60',
                  )}
                />
                <input
                  {...getInputProps()}
                  aria-invalid={!!error || fileRejections.length > 0}
                  aria-describedby={`${name}-error`}
                />
                <div className="flex items-center justify-center space-x-2 relative z-10">
                  <Upload className="h-4 w-4 text-primary" />
                  <p className="text-sm text-secondary">Drag & drop or upload a image</p>
                </div>
              </div>

              {value && previewUrl && (
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt={value.name || 'Uploaded image'}
                    className="!rounded-none max-w-[250px] max-h-[250px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors cursor-pointer group"
                  >
                    <Trash2 className="h-4 w-4 text-gray-600 group-hover:text-error-text" />
                  </button>
                </div>
              )}
            </div>
          </FormField>
        );
      }}
    />
  );
};