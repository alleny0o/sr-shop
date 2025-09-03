export const MONEY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
` as const;