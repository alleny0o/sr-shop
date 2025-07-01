export const LOCALE_COOKIE_NAME = 'locale';
const LOCALE_COOKIE_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Extracts locale preference from request cookies
 * Returns locale string like "en-us" or null if not found/invalid
 */
export function getLocaleFromCookie(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  // Parse cookies from header: "locale=en-us; theme=dark" -> ["locale=en-us", "theme=dark"]
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  const match = cookies.find(cookie => cookie.startsWith(`${LOCALE_COOKIE_NAME}=`));
  if (!match) return null;

  const locale = match.split('=')[1]; // Extract value after "="

  // Validate format: must be "xx-xx" (e.g. "en-us")
  return /^[a-z]{2}-[a-z]{2}$/i.test(locale) ? locale : null;
}

/**
 * Creates Set-Cookie header string to save locale preference
 * Cookie expires in 1 year and works across all pages
 */
export function setLocaleCookie(locale: string): string {
  if (!/^[a-z]{2}-[a-z]{2}$/.test(locale)) {
    throw new Error(`Invalid locale format: ${locale}`);
  }

  return `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_AGE}; SameSite=Lax; Secure`;
}

/**
 * Creates Set-Cookie header string to delete locale cookie
 * Sets Max-Age=0 to immediately expire the cookie
 */
export function deleteLocaleCookie(): string {
  return `${LOCALE_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax; Secure`;
}
