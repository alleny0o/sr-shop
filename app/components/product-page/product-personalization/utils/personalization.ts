import { ProductFragment } from 'storefrontapi.generated';
import { Metaobject } from '@shopify/hydrogen/storefront-api-types';
import { getMetaobjectField, getMetaobjectFieldAsBoolean } from '~/utils/metaobject';
import { ParsedPersonalization } from '../types/personalization';

// ============================================================================
// Core validation and parsing
// ============================================================================

export function formatTypeLabel(typeKey: string): string {
  switch(typeKey) {
    case 'text': return 'Text';
    case 'image': return 'Image';
    case 'other': return 'Other';
    default: return typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
  }
}

// ============================================================================
// Metafield / Metaobject data extraction
// ============================================================================

export function getPersonalizationMetaobject(metafields: ProductFragment['metafields']): Metaobject | null {
  const field = metafields?.find(
    (f) => !!f && f.key === 'personalization' && 'reference' in f
  );
  
  if (!field || !('reference' in field) || !field.reference) return null;
  return field.reference as Metaobject;
}

export function getValidPersonalizationOptions(metafields: ProductFragment['metafields']): ParsedPersonalization[] {
  const metaobject = getPersonalizationMetaobject(metafields);
  if (!metaobject) return [];
  
  const options: ParsedPersonalization[] = [];
  
  // Check which types are enabled and create options for each
  if (getMetaobjectFieldAsBoolean(metaobject, 'text')) {
    options.push({
      metaobject,
      key: 'text',
      label: formatTypeLabel('text'),
    });
  }
  
  if (getMetaobjectFieldAsBoolean(metaobject, 'image')) {
    options.push({
      metaobject,
      key: 'image',
      label: formatTypeLabel('image'),
    });
  }
  
  if (getMetaobjectFieldAsBoolean(metaobject, 'other')) {
    options.push({
      metaobject,
      key: 'other',
      label: formatTypeLabel('other'),
    });
  }
  
  return options;
}

// ============================================================================
// Form field visibility helpers - Now based on selected type
// ============================================================================

export const shouldShowInputField = (selectedType: string | null) => {
  // Only show input field for text type (since you mentioned only text OR image, not both)
  return selectedType === 'text';
};

export const shouldShowImageField = (selectedType: string | null) => {
  // Only show image field for image type
  return selectedType === 'image';
};

// For "other" type - you can customize this based on your needs
export const shouldShowOtherField = (selectedType: string | null) => {
  return selectedType === 'other';
};

// ============================================================================
// Get field configuration based on selected type
// ============================================================================

export function getFieldConfig(metaobject: Metaobject, selectedType: string | null) {
  if (!selectedType) return null;
  
  // Build config based on the selected type
  const config: any = {
    showInput: shouldShowInputField(selectedType),
    showImage: shouldShowImageField(selectedType),
  };
  
  // Add text-specific config
  if (selectedType === 'text') {
    config.inputHeading = getMetaobjectField(metaobject, 'text_header_text') || 'Enter Text';
    config.inputHelperText = getMetaobjectField(metaobject, 'text_helper_text') || undefined;
    config.inputPlaceholder = getMetaobjectField(metaobject, 'text_placeholder') || undefined;
    config.maxCharacters = parseInt(getMetaobjectField(metaobject, 'text_max_characters') || '100');
    config.isMultiline = getMetaobjectFieldAsBoolean(metaobject, 'text_is_multiline');
  }
  
  // Add image-specific config
  if (selectedType === 'image') {
    config.imageHeading = getMetaobjectField(metaobject, 'image_header_text') || 'Upload Image';
    config.imageHelperText = getMetaobjectField(metaobject, 'image_helper_text') || undefined;
  }
  
  // Add other-specific config if needed
  if (selectedType === 'other') {
    config.otherHeading = getMetaobjectField(metaobject, 'other_header_text') || 'Other Option';
    config.otherHelperText = getMetaobjectField(metaobject, 'other_helper_text') || undefined;
    // Define what "other" shows - for now assuming it might show text
    config.showInput = true;
    config.inputHeading = getMetaobjectField(metaobject, 'other_header_text') || 'Enter Details';
    config.inputHelperText = getMetaobjectField(metaobject, 'other_helper_text') || undefined;
  }
  
  return config;
}