import { ProductQuery } from 'storefrontapi.generated';
import { ProductVariant } from '@shopify/hydrogen/storefront-api-types';
import { MediaNode } from '../types/media';

/**
 * Get media nodes from variant gallery or main product media
 */
export function getMediaNodes(
  selectedVariant: ProductVariant | undefined,
  media: NonNullable<ProductQuery['product']>['media'] | undefined,
): NonNullable<ProductQuery['product']>['media']['edges'] {
  // Check if variant has gallery metafield with content
  const variantGallery = selectedVariant?.metafields?.find(metafield => metafield?.key === 'variant_gallery');

  if (variantGallery?.references?.edges && variantGallery.references.edges.length > 0) {
    // Use variant gallery media - format it to match the main media structure
    const formattedVariantMedia = variantGallery.references.edges.map(edge => ({
      node: edge.node as NonNullable<ProductQuery['product']>['media']['edges'][number]['node'],
    }));

    return formattedVariantMedia;
  }

  // Fallback to main product media
  if (!media?.edges || media?.edges.length < 1) return [];
  return media.edges;
}

/**
 * Generate a responsive URL for an image at specific dimensions
 */
export function getResponsiveMediaUrl(originalUrl: string, width?: number, height?: number): string {
  if (!originalUrl) return '';

  try {
    const url = new URL(originalUrl);

    // Handle Shopify CDN URLs
    if (url.hostname.includes('cdn.shopify.com')) {
      // Remove any existing size parameters
      const baseUrl = originalUrl.split('?')[0].replace(/_\d+x\d+/, '');

      if (width && height) {
        // Add size to filename before extension
        const parts = baseUrl.split('.');
        const ext = parts.pop();
        return `${parts.join('.')}_${width}x${height}.${ext}`;
      }
    }

    return originalUrl;
  } catch {
    return originalUrl;
  }
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(originalUrl: string, widths: number[]): string {
  return widths.map(width => `${getResponsiveMediaUrl(originalUrl, width, width)} ${width}w`).join(', ');
}

/**
 * Get alt text for media
 */
export function getAltText(node: MediaNode, index: number, productTitle: string, totalMedia: number): string {
  if (node.__typename === 'MediaImage' && node.alt) {
    return node.alt;
  }

  if (node.__typename === 'Video' && node.alt) {
    return node.alt;
  }

  const mediaType = node.__typename === 'Video' ? 'Video' : 'Image';
  return `${productTitle} - ${mediaType} ${index + 1} of ${totalMedia}`;
}
