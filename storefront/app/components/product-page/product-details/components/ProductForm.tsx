import { type MappedProductOptions } from '@shopify/hydrogen';
import type { ProductFragment } from 'storefrontapi.generated';
import { useForm } from 'react-hook-form';
import { useState, useRef, useMemo, useCallback, memo } from 'react';
import { ProductOptions } from './ProductOptions';
import { PersonalizationForm } from '../../product-personalization/PersonalizationForm';
import { PersonalizationData, AppliedPersonalizationData } from '../../product-personalization/types/personalization';
import { getValidPersonalizationOptions } from '../../product-personalization/utils/personalization';
import { getMetaFieldAsBoolean } from '~/utils/metafields';
import { AddToCartButton } from '~/components/product-page/product-details/components/buttons/AddToCartButton';

export type FormState = 'idle' | 'form' | 'summary';
export type ErrorState = 'form-incomplete' | 'missing-required' | null;

// Memoized ProductOptions wrapper to prevent re-renders
const MemoizedProductOptions = memo(ProductOptions);

export function ProductForm({
  metafields,
  productOptions,
  selectedVariant,
}: {
  metafields: ProductFragment['metafields'];
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const options = useMemo(() => getValidPersonalizationOptions(metafields), [metafields]);
  const personalizationRequired = useMemo(
    () => getMetaFieldAsBoolean(metafields, 'personalization_required'),
    [metafields],
  );

  // Stock / availability
  const isAvailable = selectedVariant?.availableForSale ?? false;

  // Localized personalization state
  const [formState, setFormState] = useState<FormState>('idle');
  const [appliedData, setAppliedData] = useState<AppliedPersonalizationData | null>(null);
  const [errorState, setErrorState] = useState<ErrorState>(null);
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // Form initialization with stable defaults - updated for new type system
  const defaultValues = useMemo(
    () => ({
      type: options.length === 1 ? options[0].key : null,
      text: null,
      image: null,
      position: null,
      font: null,
    }),
    [options],
  );

  const form = useForm<PersonalizationData>({
    defaultValues,
    mode: 'all',  
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
  });

  // Build line item properties from applied personalization (SYNC)
  // Note: Image attributes are now handled in AddToCartButton after upload
  const buildLineItemProps = useCallback((data: AppliedPersonalizationData) => {
    const properties: Record<string, string> = {};
    
    // Store the type as the actual type value (text, image, other)
    if (data.type) properties['_Type'] = data.type;
    if (data.text) properties['_Text'] = data.text;
    if (data.font) properties['_Font'] = data.font;
    // Image will be handled during upload in AddToCartButton
    
    return properties;
  }, []);

  // Only disable for stock, not for form state
  const atcDisabled = useMemo(() => {
    return !isAvailable; // Only out of stock blocks ATC
  }, [isAvailable]);

  // Button label reflects stock
  const atcLabel = isAvailable ? 'Add to Cart' : 'Out of Stock';

  // Build cart lines WITH attributes mapped from appliedData
  const cartLines = useMemo(() => {
    const attributes = appliedData
      ? Object.entries(buildLineItemProps(appliedData)).map(([key, value]) => ({ key, value }))
      : [];

    return [
      {
        merchandiseId: selectedVariant?.id || '',
        quantity: 1,
        attributes,
      },
    ];
  }, [selectedVariant, appliedData, buildLineItemProps]);

  // Extract the image File from appliedData for passing to AddToCartButton
  const personalizationImage = appliedData?.image || null;

  // Derive error message from state combinations
  const errorMessage = useMemo(() => {
    // Only show form-incomplete error when actually in form state
    if (errorState === 'form-incomplete' && formState === 'form') {
      return 'Please complete or cancel your personalization';
    }
    
    // Only show missing-required error when in idle state
    if (errorState === 'missing-required' && formState === 'idle' && personalizationRequired) {
      return 'This product requires personalization';
    }
    
    return null;
  }, [errorState, formState, personalizationRequired]);

  // Reset personalization form after successful add to cart
  const handleAfterAddToCart = useCallback(() => {
    // Reset all personalization state back to initial
    setFormState('idle');
    setAppliedData(null);
    setErrorState(null);
    form.reset(defaultValues);
  }, [form, defaultValues]);

  // Validation before add to cart
  const handleValidate = useCallback(() => {
    // Check if form is open
    if (formState === 'form') {
      // Set error state (message will be derived automatically)
      setErrorState('form-incomplete');
      
      // Smooth scroll to form
      scrollTargetRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      return false; // Prevent add to cart
    }
    
    // Check if personalization is required but not applied
    if (personalizationRequired && !appliedData) {
      // Set error state (message will be derived automatically)
      setErrorState('missing-required');
      
      // Smooth scroll to form area
      scrollTargetRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      return false; // Prevent add to cart
    }
    
    return true; // Allow add to cart
  }, [formState, personalizationRequired, appliedData]);

  // No personalization options - simplified form (still respects stock)
  if (options.length === 0) {
    return (
      <div className="space-y-6">
        <MemoizedProductOptions productOptions={productOptions} />
        <div className="h-px bg-soft" />
        <AddToCartButton
          lines={[{ merchandiseId: selectedVariant?.id || '', quantity: 1 }]}
          disabled={!isAvailable}
          className="w-full bg-atc-button-bg text-atc-button-text p-4 transition-colors duration-0 hover:bg-atc-button-hover cursor-pointer uppercase rounded-none"
          selectedVariant={selectedVariant}
          afterAddToCart={handleAfterAddToCart}
        >
          {isAvailable ? 'Add to Cart' : 'Out of Stock'}
        </AddToCartButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MemoizedProductOptions productOptions={productOptions} />

      <div className="h-px bg-soft" />

      <div ref={scrollTargetRef}>
        <PersonalizationForm
          options={options}
          form={form}
          formState={formState}
          setFormState={setFormState}
          appliedData={appliedData}
          setAppliedData={setAppliedData}
          setErrorState={setErrorState}
          errorState={errorState}
          personalizationRequired={personalizationRequired}
        />
        
        {/* Error message display */}
        {errorMessage && (
          <div className="mt-2 text-sm text-error-text font-inter animate-in fade-in duration-200">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="h-px bg-soft" />

      <AddToCartButton
        lines={cartLines}
        disabled={atcDisabled}
        className="uppercase rounded-none"
        personalizationImage={personalizationImage}
        selectedVariant={selectedVariant}
        afterAddToCart={handleAfterAddToCart}
        onValidate={handleValidate}
      >
        {atcLabel}
      </AddToCartButton>
    </div>
  );
}