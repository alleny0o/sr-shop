import { CountryCode, LanguageCode } from '@shopify/hydrogen/storefront-api-types';
import type { AllLocalizationsQuery } from 'storefrontapi.generated';
import { deleteLocaleCookie, getLocaleFromCookie, setLocaleCookie } from './cookies/locale';

export const DEFAULT_LOCALE = 'en-us';

// Basic locale structure from API
export type RawLocale = {
  country: CountryCode;
  language: LanguageCode;
  prefix: string; // Format: "en-us"
};

// Extended locale with display info for UI
export type UILocale = RawLocale & {
  currency: string;
  countryName: string;
  languageName: string;
};

/**
 * Determines the best locale to use based on URL, cookie, and headers
 * Returns locale + cookie header for setting/deleting locale cookie
 */
export function resolveEffectiveLocale(
  request: Request,
  localizations: AllLocalizationsQuery,
  pathname: string,
): { locale: RawLocale | null; cookie?: string } {
  const available = getAvailableLocales(localizations);

  // Skip i18n for API endpoints and static files
  const isInternal = pathname.startsWith('/api') || pathname.startsWith('/_');
  const isFile = /\.[^\/]+$/.test(pathname);
  if (isInternal || isFile) {
    return { locale: null, cookie: undefined };
  }

  // 1) Check if URL has a valid locale prefix (e.g., /en-us/products)
  const match = pathname.match(/^\/([a-z]{2}-[a-z]{2})(\/|$)/i);
  const pathLocale = match?.[1]?.toLowerCase() ?? null;
  const pathData = pathLocale ? available.find(l => l.prefix === pathLocale) : null;

  let preferred: RawLocale | null = null;

  if (pathData) {
    // URL explicitly set a valid locale - use it
    preferred = pathData;
  } else {
    // 2) Try saved locale from cookie
    const cookieLocale = getLocaleFromCookie(request);
    if (cookieLocale) {
      preferred = available.find(l => l.prefix === cookieLocale) || null;
    }

    // 3) Try browser's Accept-Language header
    if (!preferred) {
      const accept = parseAcceptLanguageHeader(request);
      if (accept) {
        preferred = available.find(l => l.prefix === accept) || null;
      }
    }

    // 4) Fallback to default or first available locale
    if (!preferred) {
      preferred = available.find(l => l.prefix === DEFAULT_LOCALE) || available[0] || null;
    }
  }

  // Prepare cookie header to save or clear locale preference
  const cookie = preferred ? setLocaleCookie(preferred.prefix) : deleteLocaleCookie();

  return { locale: preferred, cookie };
}

/**
 * Extracts the first language from Accept-Language header
 * Returns format like "en-us" or null if invalid
 */
export function parseAcceptLanguageHeader(request: Request): string | null {
  const header = request.headers.get('accept-language');
  if (!header) return null;
  const first = header.split(',')[0].trim(); // Get first preference: "en-US;q=0.9"
  return /^[a-z]{2}-[a-z]{2}$/i.test(first) ? first.toLowerCase() : null;
}

/**
 * Converts Shopify's localization data into our RawLocale format
 * Creates prefix like "en-us" from language + country codes
 */
export function getAvailableLocales(allLocalizations: AllLocalizationsQuery): RawLocale[] {
  return (
    allLocalizations.localization.availableCountries?.flatMap(
      country =>
        country.availableLanguages?.map(language => ({
          country: country.isoCode as CountryCode,
          language: language.isoCode as LanguageCode,
          prefix: `${language.isoCode.toLowerCase()}-${country.isoCode.toLowerCase()}`,
        })) || [],
    ) || []
  );
}

/**
 * Same as getAvailableLocales but includes display names and currency
 * Used for building locale selection UI
 */
export function getAllLocales(allLocalizations: AllLocalizationsQuery): UILocale[] {
  return (
    allLocalizations.localization.availableCountries?.flatMap(
      country =>
        country.availableLanguages?.map(language => ({
          country: country.isoCode as CountryCode,
          language: language.isoCode as LanguageCode,
          countryName: country.name,
          languageName: language.endonymName, // Native language name
          prefix: `${language.isoCode.toLowerCase()}-${country.isoCode.toLowerCase()}`,
          currency: `${country.currency.isoCode} ${country.currency.symbol}`, // "USD $"
        })) || [],
    ) || []
  );
}

/**
 * Gets unique countries from locale list
 * Useful for country selector dropdowns
 */
export const getUniqueCountries = (locales: UILocale[]) => {
  const countryMap = new Map();
  locales.forEach(locale => {
    if (!countryMap.has(locale.country)) {
      countryMap.set(locale.country, {
        code: locale.country,
        name: locale.countryName,
      });
    }
  });
  return Array.from(countryMap.values());
};

/**
 * Gets all available languages for a specific country
 * Useful for language selector after country is chosen
 */
export const getLanguagesForCountry = (locales: UILocale[], countryCode: string) => {
  return locales
    .filter(locale => locale.country === countryCode)
    .map(locale => ({
      code: locale.language,
      name: locale.languageName,
      locale: locale, // Full locale object for easy access
    }));
};
