import { useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { Controller, UseFormReturn, useWatch } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { PersonalizationData, AppliedPersonalizationData, ParsedPersonalization } from './types/personalization';
import { getFieldConfig } from './utils/personalization';

import { TypePicker } from './components/TypePicker';
import { TextField } from './components/TextField';
import { ImageField } from './components/ImageField';
import { PersonalizationSummary } from './components/PersonalizationSummary';
import { FormActions } from './components/FormActions';

import { FormState } from '../product-details/components/ProductForm';
import { ErrorState } from '../product-details/components/ProductForm';

type PersonalizationFormProps = {
  options: ParsedPersonalization[];
  form: UseFormReturn<PersonalizationData>;
  formState: FormState;
  setFormState: (state: FormState) => void;
  appliedData: AppliedPersonalizationData | null;
  setAppliedData: (data: AppliedPersonalizationData | null) => void;
  setErrorState: (error: ErrorState) => void;
  errorState: ErrorState;
  personalizationRequired: boolean;
};

export const PersonalizationForm = memo((props: PersonalizationFormProps) => {
  const {
    options,
    form,
    formState,
    setFormState,
    appliedData,
    setAppliedData,
    setErrorState,
    errorState,
    personalizationRequired,
  } = props;

  // Refs for transient state
  const blobUrlsRef = useRef<Set<string>>(new Set());
  const hasInteractedRef = useRef(false);

  // ✅ Subscribe to RHF updates so UI reacts instantly
  const selectedType = useWatch({ control: form.control, name: 'type' });
  const currentImage = useWatch({ control: form.control, name: 'image' });

  // Stable initial values with proper typing
  const initialValues = useMemo<PersonalizationData>(
    () => ({
      type: options.length === 1 ? options[0].key : null,
      text: null,
      image: null,
      position: null,
      font: null,
    }),
    [options],
  );

  // Since all options share the same metaobject now, we just need the first one
  const metaobject = options[0]?.metaobject || null;

  // Derived config from selected type
  const config = useMemo(() => {
    if (!metaobject || !selectedType) return null;
    return getFieldConfig(metaobject, selectedType);
  }, [metaobject, selectedType]);

  // 🔧 CRITICAL FIX: Prune non-applicable fields when config changes
  useEffect(() => {
    if (!config) return;

    // If this type doesn't show image, clear any lingering image value
    if (!config.showImage && form.getValues('image')) {
      form.setValue('image', null, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    // If this type doesn't show text, clear any lingering text
    if (!config.showInput && (form.getValues('text') ?? '').trim().length > 0) {
      form.setValue('text', '', {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [config?.showImage, config?.showInput, form]);

  // Blob URL management
  const createBlobUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file);
    blobUrlsRef.current.add(url);
    return url;
  }, []);

  const cleanupBlobUrl = useCallback((url: string) => {
    if (blobUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      blobUrlsRef.current.delete(url);
    }
  }, []);

  const cleanupAllBlobs = useCallback(() => {
    blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    blobUrlsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => cleanupAllBlobs();
  }, [cleanupAllBlobs]);

  // 🔧 CRITICAL FIX: Guard blob URL creation with config.showImage
  const currentImagePreviewUrl = useMemo(() => {
    if (!config?.showImage) return null; // 👈 new guard prevents phantom previews
    if (!currentImage) return null;
    if (appliedData?.image === currentImage && appliedData.imagePreviewUrl) {
      return appliedData.imagePreviewUrl;
    }
    return createBlobUrl(currentImage);
  }, [currentImage, appliedData, createBlobUrl, config?.showImage]);

  // 🔧 IMPROVED: More explicit type change handling
  const handleTypeChange = useCallback(() => {
    // Reset both fields explicitly; the pruning effect will enforce final state
    form.setValue('image', null, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    form.setValue('text', '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  }, [form]);

  const handleInteraction = useCallback(() => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      setErrorState(null);
    }
  }, [setErrorState]);

  const handleAdd = useCallback(() => {
    setErrorState(null);
    hasInteractedRef.current = false;
    setFormState('form');
    if (options.length === 1) {
      form.setValue('type', options[0].key, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [form, options, setFormState, setErrorState]);

  // 🔧 IMPROVED: Immediate pruning after edit
  const handleEdit = useCallback(() => {
    if (appliedData) {
      const { imagePreviewUrl, ...formData } = appliedData;
      // Ensure type is properly typed
      const typedFormData: PersonalizationData = {
        ...formData,
        type: formData.type as 'text' | 'image' | 'other',
        text: formData.text || null,
        image: formData.image || null,
        position: formData.position || null,
        font: formData.font || null,
      };
      form.reset(typedFormData);
    }
    setFormState('form');

    // Immediate prune in case the current selected type doesn't match stored fields
    const c = config;
    if (c) {
      if (!c.showImage) form.setValue('image', null, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      if (!c.showInput) form.setValue('text', '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    }
  }, [appliedData, form, setFormState, config]);

  const handleRemove = useCallback(() => {
    if (appliedData?.imagePreviewUrl) {
      cleanupBlobUrl(appliedData.imagePreviewUrl);
    }
    setAppliedData(null);
    setFormState('idle');
    setErrorState(null);
    form.reset(initialValues);
  }, [appliedData, cleanupBlobUrl, form, initialValues, setAppliedData, setFormState, setErrorState]);

  const handleCancel = useCallback(() => {
    setErrorState(null);
    setFormState(appliedData ? 'summary' : 'idle');
    form.reset(initialValues);
  }, [appliedData, form, initialValues, setFormState, setErrorState]);

  const handleApply = useCallback(async () => {
    setErrorState(null);

    const isValid = await form.trigger(['type', 'text', 'image'], { shouldFocus: true });
    if (!isValid) {
      setFormState('form');
      return;
    }

    const data = form.getValues();
    const hasData = Boolean(data.type && ((data.text?.trim()?.length ?? 0) > 0 || data.image));

    if (!hasData) {
      if (appliedData?.imagePreviewUrl) cleanupBlobUrl(appliedData.imagePreviewUrl);
      setAppliedData(null);
      setFormState('idle');
      form.reset(initialValues);
      return;
    }

    if (appliedData?.imagePreviewUrl && appliedData.imagePreviewUrl !== currentImagePreviewUrl) {
      cleanupBlobUrl(appliedData.imagePreviewUrl);
    }

    // Ensure type is not null when creating applied data
    if (!data.type) return;

    const dataWithPreview: AppliedPersonalizationData = {
      type: data.type as 'text' | 'image' | 'other',
      text: data.text,
      image: data.image,
      imagePreviewUrl: data.image ? currentImagePreviewUrl : null,
      position: data.position,
      font: data.font,
      timestamp: new Date().toISOString(),
    };

    setAppliedData(dataWithPreview);
    setFormState('summary');
  }, [
    form,
    appliedData,
    initialValues,
    currentImagePreviewUrl,
    cleanupBlobUrl,
    setAppliedData,
    setFormState,
    setErrorState,
  ]);

  // Error styles
  const containerStyle = useMemo(() => {
    if (errorState === 'missing-required' && formState === 'idle' && personalizationRequired) {
      return { borderColor: 'var(--color-error-border)' };
    }
    if (errorState === 'form-incomplete' && formState === 'form') {
      return { borderColor: 'var(--color-error-border)' };
    }
    return {};
  }, [errorState, formState, personalizationRequired]);

  if (options.length === 0) return null;

  // Idle state
  if (formState === 'idle') {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1 bg-bronze-light font-medium text-sm text-muted-foreground border border-soft rounded-none px-3 py-2.5 justify-center cursor-pointer transition-colors hover:border-strong"
        style={containerStyle}
      >
        <Plus size={15} />
        Add Personalization {!personalizationRequired ? '(Optional)' : '(Required)'}
      </button>
    );
  }

  // Summary state
  if (formState === 'summary' && appliedData) {
    return (
      <PersonalizationSummary appliedData={appliedData} options={options} onEdit={handleEdit} onRemove={handleRemove} />
    );
  }

  // Form state
  return (
    <div className="space-y-6 border border-soft rounded-lg p-4" style={containerStyle}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-primary font-inter">
          Personalization Form
          {personalizationRequired && <span className="text-error-text ml-px font-inter">*</span>}
        </label>
        <button
          type="button"
          onClick={() => form.reset(initialValues)}
          className="flex items-center gap-1 text-xs text-secondary hover:text-primary transition-colors font-inter cursor-pointer"
        >
          Reset Form
        </button>
      </div>

      <div className="space-y-6 border-l-2 border-pastel-blue-dark pl-6" key={`cfg-${selectedType || 'none'}`}>
        {options.length >= 2 && (
          <Controller
            name="type"
            control={form.control}
            rules={{ required: 'Please select an option' }}
            render={({ field, fieldState }) => (
              <TypePicker
                name={field.name}
                options={options}
                value={(field.value as string) || ''}
                onChange={eOrVal => {
                  handleInteraction();
                  const next = typeof eOrVal === 'string' ? eOrVal : ((eOrVal as any)?.target?.value as string);
                  field.onChange(next);
                  handleTypeChange();
                }}
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        {config && (
          <div className="space-y-4">
            {config.showInput && <TextField form={form} config={config} onInteraction={handleInteraction} />}

            {config.showImage && (
              <ImageField
                form={form}
                previewUrl={currentImagePreviewUrl}
                config={config}
                onInteraction={handleInteraction}
              />
            )}
          </div>
        )}
      </div>

      <FormActions onCancel={handleCancel} onApply={handleApply} />
    </div>
  );
});

PersonalizationForm.displayName = 'PersonalizationForm';