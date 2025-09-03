export const ALL_LOCALIZATION_QUERY = `#graphql
  query AllLocalizations {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
          name
          symbol
        }
        availableLanguages {
          isoCode
          endonymName
        }
      }
    }
  }
` as const;