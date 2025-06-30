import {MONEY_FRAGMENT} from "./money";

export const CART_LINE_FRAGMENT = `#graphql
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount { ...Money }
      amountPerQuantity { ...Money }
      compareAtAmountPerQuantity { ...Money }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice { ...Money }
        price { ...Money }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

export const CART_LINE_COMPONENT_FRAGMENT = `#graphql
  fragment CartLineComponent on ComponentizableCartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount { ...Money }
      amountPerQuantity { ...Money }
      compareAtAmountPerQuantity { ...Money }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice { ...Money }
        price { ...Money }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

export const CART_QUERY_FRAGMENT = `#graphql
  fragment CartApiQuery on Cart {
    updatedAt
    id
    appliedGiftCards {
      lastCharacters
      amountUsed { ...Money }
    }
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
        ...CartLineComponent
      }
    }
    cost {
      subtotalAmount { ...Money }
      totalAmount { ...Money }
      totalDutyAmount { ...Money }
      totalTaxAmount { ...Money }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
  ${MONEY_FRAGMENT}
  ${CART_LINE_FRAGMENT}
  ${CART_LINE_COMPONENT_FRAGMENT}
` as const;