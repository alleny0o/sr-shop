import { Metaobject } from '@shopify/hydrogen/storefront-api-types';

export interface PersonalizationData {
  type: 'text' | 'image' | 'other' | null; // Now limited to the actual type options
  text: string | null;
  image: File | null; // Local file during form editing
  position: string | null;
  font: string | null;
}

export interface AppliedPersonalizationData {
  type: 'text' | 'image' | 'other'; // Required and limited to actual types
  text?: string | null;
  image?: File | null; // Keep as File for consistency with form data
  imagePreviewUrl?: string | null; // Separate field for preview URL
  position?: string | null;
  font?: string | null;
  timestamp?: string; // When personalization was applied
}

// For when data is sent to server/cart (after Cloudinary upload)
export interface ServerPersonalizationData {
  type: 'text' | 'image' | 'other'; // Required and limited to actual types
  text?: string | null;
  image?: string | null; // Cloudinary URL string
  position?: string | null;
  font?: string | null;
  timestamp?: string;
}

// Parse personalization from metaobject - now represents individual type options
export interface ParsedPersonalization {
  key: 'text' | 'image' | 'other'; // The type key
  label: string; // Display name like 'Text', 'Image', 'Other'
  metaobject: Metaobject; // The single metaobject with all config
}