import { Metaobject, MetaobjectField } from '@shopify/hydrogen/storefront-api-types';

// get field value from a metaobject
export function getMetaobjectField(metaobject: Metaobject, fieldKey: string): string | null {
  const field = metaobject.fields.find((f: MetaobjectField) => f.key === fieldKey);
  return field?.value || null;
}

// get field as boolean
export function getMetaobjectFieldAsBoolean(metaobject: Metaobject, fieldKey: string): boolean {
  return getMetaobjectField(metaobject, fieldKey) === 'true';
}

// get field as number
export function getMetaobjectFieldAsNumber(metaobject: Metaobject, fieldKey: string): number {
  return parseInt(getMetaobjectField(metaobject, fieldKey) || '0');
}
