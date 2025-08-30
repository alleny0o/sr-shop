import { ProductFragment, ProductQuery } from 'storefrontapi.generated';

export function getMetafield(metafields: ProductFragment['metafields'], key: string): string | null {
  return metafields?.find((field: any) => field?.key === key)?.value || null;
}

export function getMetaFieldAsBoolean(metafields: ProductFragment['metafields'], key: string): boolean {
  return getMetafield(metafields, key) === 'true';
}

export function getMetafieldAsNumber(metafields: ProductFragment['metafields'], key: string): number {
  return parseInt(getMetafield(metafields, key) || '0');
}