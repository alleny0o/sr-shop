import { type FetcherWithComponents } from 'react-router';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { useEffect, useState, useCallback } from 'react';
import { cn } from '~/utils/cn';
import { Loader2 } from 'lucide-react';
import { useAside } from '~/components/aside/hooks/useAside';

export interface AddToCartButtonProps {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  className?: string;
  ariaLabel?: string;
  afterAddToCart?: () => void;
  onValidate?: () => boolean; // NEW: Return false to prevent add, true to proceed
  personalizationImage?: File | null;
  selectedVariant?: any;
}

// Helper function to upload personalization image
async function uploadPersonalizationImage(file: File): Promise<{
  imageUrl: string;
  s3Key?: string;
  fileId?: string;
}> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/s3/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = 'Upload failed';
    try {
      const errorData = (await response.json()) as { error?: string };
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // JSON parse failed, use default message
    }
    throw new Error(errorMessage || `Upload failed with status ${response.status}`);
  }

  const data = (await response.json()) as { imageUrl: string; s3Key?: string; fileId?: string };

  if (!data?.imageUrl) {
    throw new Error('Invalid response from upload endpoint - missing imageUrl');
  }

  return {
    imageUrl: data.imageUrl,
    s3Key: data.s3Key,
    fileId: data.fileId,
  };
}

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  className,
  ariaLabel,
  afterAddToCart,
  onValidate,
  personalizationImage,
  selectedVariant,
}: AddToCartButtonProps) {
  const { open: openAside } = useAside();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmittingCart, setIsSubmittingCart] = useState<boolean>(false);
  const [finalLines, setFinalLines] = useState<Array<OptimisticCartLineInput>>(lines);

  // Update finalLines when lines prop changes
  useEffect(() => {
    setFinalLines(lines);
  }, [lines]);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      // NEW: Call validation callback if provided
      if (onValidate && !onValidate()) {
        e.preventDefault();
        return; // Validation failed, don't proceed
      }

      // If there's an image to upload, handle it first
      if (personalizationImage && personalizationImage instanceof File) {
        e.preventDefault(); // Prevent default form submission

        // Capture the form element BEFORE the async operation
        const form = e.currentTarget.closest('form');

        setUploadError(null);
        setIsUploading(true);

        try {
          const uploadResult = await uploadPersonalizationImage(personalizationImage);

          // Build image attributes
          const imageAttributes = [
            { key: '_Image', value: uploadResult.imageUrl },
            ...(uploadResult.s3Key ? [{ key: '_ImageKey', value: uploadResult.s3Key }] : []),
            ...(uploadResult.fileId ? [{ key: '_ImageFileId', value: uploadResult.fileId }] : []),
          ];

          // Update lines with image attributes
          const updatedLines = lines.map(line => ({
            ...line,
            attributes: [...(line.attributes || []), ...imageAttributes],
          }));

          setFinalLines(updatedLines);
          setIsUploading(false); // Upload complete
          setIsSubmittingCart(true); // Cart submission starting

          // Submit the form after updating lines using the captured form element
          setTimeout(() => {
            if (form) {
              const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
              form.dispatchEvent(submitEvent);
            }
          }, 0);
        } catch (error) {
          setUploadError(error instanceof Error ? error.message : 'Image upload failed');
          setIsUploading(false);
          setIsSubmittingCart(false);
        }
      }
      // If no image, let the form submit normally
    },
    [personalizationImage, lines, onValidate],
  );

  // Create the inputs for CartForm
  const cartInputs = (() => {
    // Only add selectedVariant for optimistic cart if we're NOT uploading an image
    // This prevents showing items in cart before we know if upload succeeds
    const shouldUseOptimisticCart = selectedVariant && !personalizationImage;

    const linesWithSelectedVariant = shouldUseOptimisticCart
      ? finalLines.map(line => ({
          ...line,
          selectedVariant, // Add selectedVariant to each line for optimistic cart
        }))
      : finalLines; // No selectedVariant = no optimistic cart

    const inputs = {
      lines: linesWithSelectedVariant,
    };

    return inputs;
  })();

  return (
    <CartForm route="/cart" inputs={cartInputs} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        // Fixed loading state calculation - no gaps between states
        const isFetcherSubmitting = fetcher.state === 'submitting';
        const isSubmitting = isUploading || isSubmittingCart || isFetcherSubmitting;
        const isLoading = isSubmitting;

        useEffect(() => {
          if (fetcher.state === 'idle' && fetcher.data) {
            setIsSubmittingCart(false); // Reset submitting state

            if (fetcher.data.errors) {
              // Cart/server error - show it and reset button
              setUploadError(fetcher.data.errors[0]?.message || 'Failed to add to cart');
            } else {
              // Success - open cart aside and run callbacks
              setUploadError(null);
              openAside('cart'); // Open the cart aside
              if (afterAddToCart) afterAddToCart();
            }
          }
        }, [fetcher.state, fetcher.data, openAside, afterAddToCart]);

        // Determine button content
        const buttonContent = (() => {
          if (isLoading) {
            return (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="sr-only">Loading...</span>
              </>
            );
          }

          return children || 'Add to Cart';
        })();

        return (
          <div className="relative">
            <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />

            <button
              type="submit"
              aria-label={ariaLabel || (typeof children === 'string' ? children : 'Add to Cart')}
              onClick={handleClick}
              disabled={disabled || isSubmitting}
              className={cn(
                'w-full p-4 flex items-center justify-center gap-2 font-inter text-base cursor-pointer',
                'relative overflow-hidden',
                'transition-all duration-200 ease-in-out transform',
                'text-atc-button-text',
                'hover:-translate-y-0.5 active:translate-y-0',
                'bg-atc-button-bg hover:bg-atc-button-hover active:bg-atc-button-active',
                // Disabled styles
                disabled &&
                  'bg-atc-button-disabled-bg text-atc-button-disabled-text hover:!bg-atc-button-disabled-bg cursor-not-allowed transform-none',
                isSubmitting && 'cursor-not-allowed transform-none',
                className,
              )}
            >
              {buttonContent}
            </button>

            {/* Error message display */}
            {uploadError && (
              <div className="mt-2 text-sm text-error-text" role="alert" aria-live="polite">
                {uploadError}. Your item was not added.
              </div>
            )}

            {/* Success announcement for screen readers */}
            {fetcher.state === 'idle' && fetcher.data && !fetcher.data.errors && (
              <div className="sr-only" role="status" aria-live="polite">
                Item successfully added to cart
              </div>
            )}
          </div>
        );
      }}
    </CartForm>
  );
}