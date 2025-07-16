import { MediaNode } from "../types/media";

export const getResponsiveMediaUrl = (baseUrl: string, width: number, height: number) => {
    if (baseUrl.includes('cdn.shopify.com')) {
      const url = new URL(baseUrl);
      url.searchParams.set('width', width.toString());
      url.searchParams.set('height', height.toString());
      url.searchParams.set('crop', 'center');
      return url.toString();
    }
    return baseUrl;
  };
  
  export const generateSrcSet = (baseUrl: string, sizes: number[]) => {
    if (!baseUrl.includes('cdn.shopify.com')) return undefined;
    return sizes.map(size => `${getResponsiveMediaUrl(baseUrl, size, size)} ${size}w`).join(', ');
  };
  
  export const getAltText = (node: MediaNode, index: number, productTitle: string, totalMedia: number) => {
    const baseAlt = node.alt || '';
  
    if (baseAlt.startsWith('#')) {
      const variantValue = baseAlt.substring(1);
      return `${productTitle} - ${variantValue}`;
    }
  
    if (baseAlt && baseAlt.length > 3) {
      return baseAlt;
    }
  
    const mediaType = node.__typename === 'Video' ? 'video' : 'image';
    const position = totalMedia > 1 ? ` ${index + 1} of ${totalMedia}` : '';
    return `${productTitle} ${mediaType}${position}`;
  };