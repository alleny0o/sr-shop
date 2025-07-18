import { ProductQuery } from 'storefrontapi.generated';

export function getMetafield(product: NonNullable<ProductQuery['product']>, key: string): string | null {
  return product.metafields?.find((field: any) => field.key === key)?.value || null;
}

export function getMetaFieldAsBoolean(product: NonNullable<ProductQuery['product']>, key: string): boolean {
  return getMetafield(product, key) === 'true';
}

export function getMetafieldAsNumber(product: NonNullable<ProductQuery['product']>, key: string): number {
  return parseInt(getMetafield(product, key) || '0');
}

export function getMetaFieldAsList(product: NonNullable<ProductQuery['product']>, key: string): string[] {
  return getMetafield(product, key)?.split(',') || [];
}
