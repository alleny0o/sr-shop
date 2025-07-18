export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }

    metafields(identifiers: [
      {namespace: "custom", key: "variant_gallery"}
    ]) {
      key
      value
      type
      references(first: 250) {
        edges {
          node {
            ... on MediaImage {
              __typename
              id
              alt
              mediaContentType
              previewImage {        
                id
                altText
                url
                width               
                height              
              }
              image {
                altText
                url
                width             
                height            
              }
            }
            ... on Video {
              __typename
              id
              alt
              mediaContentType
              previewImage {        
                id
                altText
                url
                width               
                height              
              }
              sources {
                url
                mimeType
                format
                height
                width
              }
            }
          }
        }
      }
    }
  }
` as const;

export const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability

    media(first: 250) {
      edges {
        node {
          __typename
          id
          alt
          mediaContentType
          previewImage {        
            id
            altText
            url
            width               
            height              
          }
          ... on MediaImage {
            id
            image {
              altText
              url
              width             
              height            
            }
          }
          ... on Video {
            id
            sources {
              url
              mimeType
              format
              height
              width
            }
          }
        }
      }
    }

    metafields(identifiers: [
      
      # Customization metafields
      {namespace: "custom", key: "has_customization"}
      {namespace: "custom", key: "customization_required"}
      
      # Text engraving
      {namespace: "custom", key: "text_engraving"}
      {namespace: "custom", key: "text_heading"}
      {namespace: "custom", key: "text_helper"}
      {namespace: "custom", key: "input_placeholder"}
      {namespace: "custom", key: "text_positions"}
      {namespace: "custom", key: "max_characters"}
      
      # Logo engraving
      {namespace: "custom", key: "logo_engraving"}
      {namespace: "custom", key: "logo_text_heading"}
      {namespace: "custom", key: "logo_text_helper"}
      {namespace: "custom", key: "logo_positions"}
      
      # Image overlay
      {namespace: "custom", key: "image_overlay"}
      {namespace: "custom", key: "image_overlay_text_heading"}
      {namespace: "custom", key: "image_overlay_text_helper"}
      {namespace: "custom", key: "image_overlay_aspect_ratio"}

      # More details fields
      {namespace: "custom", key: "shipping_returns"}
      {namespace: "custom", key: "faq"}
    ]) {
      key
      value
      type
    }
    
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;
