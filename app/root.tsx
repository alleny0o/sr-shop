// shopify imports
import { Analytics, getShopAnalytics, useNonce } from '@shopify/hydrogen';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { CountryCode } from '@shopify/hydrogen/customer-account-api-types';
import { LanguageCode } from '@shopify/hydrogen/storefront-api-types';

// react-router imports
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  redirect,
} from 'react-router';

// third-party imports
import { useJudgeme } from '@judgeme/shopify-hydrogen';

// asset imports
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';

// component imports
import { PageLayout } from '~/components/layout/PageLayout';

// graphql imports
import { HEADER_QUERY, FOOTER_QUERY } from './graphql/storefront/menus';
import { ALL_LOCALIZATION_QUERY } from './graphql/storefront/locale';

// lib imports
import { resolveEffectiveLocale } from './lib/locale';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({ formMethod, currentUrl, nextUrl }) => {
  // Helper function to check if a string is a valid locale format
  const isValidLocale = (segment: string) => {
    return /^[a-z]{2}-[a-z]{2}$/i.test(segment);
  };

  // Extract potential locale from URLs
  const currentFirstSegment = currentUrl.pathname.split('/')[1];
  const nextFirstSegment = nextUrl.pathname.split('/')[1];

  // Only treat as locales if they match the expected format
  const currentLocale = isValidLocale(currentFirstSegment) ? currentFirstSegment : null;
  const nextLocale = isValidLocale(nextFirstSegment) ? nextFirstSegment : null;

  // Revalidate if locale changed (including going from locale to no locale or vice versa)
  if (currentLocale !== nextLocale) return true;

  // Rest of your logic...
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;

  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
  ];
}

export async function loader(args: LoaderFunctionArgs) {
  try {
    // Step 1: Fetch localizations with caching
    const localizations = await args.context.storefront.query(ALL_LOCALIZATION_QUERY, {
      cache: args.context.storefront.CacheLong(),
    });

    // Step 2: Determine effective locale
    const url = new URL(args.request.url);
    const { locale, cookie } = resolveEffectiveLocale(args.request, localizations, url.pathname);

    // Step 3: Check if redirect is needed
    const currentPrefixMatch = url.pathname.match(/^\/([a-z]{2}-[a-z]{2})(\/|$)/i);
    const currentPrefix = currentPrefixMatch?.[1]?.toLowerCase();

    // Always redirect if we have a locale but no prefix in URL, or wrong prefix
    const needsRedirect =
      locale?.prefix &&
      (!currentPrefix || // No prefix in URL (like localhost:3000)
        currentPrefix !== locale.prefix.toLowerCase()); // Wrong prefix in URL

    if (needsRedirect) {
      // Remove any existing locale prefix from pathname
      const pathnameWithoutPrefix = currentPrefix ? url.pathname.replace(/^\/[a-z]{2}-[a-z]{2}/i, '') : url.pathname;

      // Ensure the path starts with /
      const normalizedPath = pathnameWithoutPrefix.startsWith('/')
        ? pathnameWithoutPrefix
        : `/${pathnameWithoutPrefix}`;

      // Build redirect URL with locale prefix
      const redirectUrl = `/${locale.prefix}${normalizedPath}`.replace(/\/+$/, '') + url.search;

      console.log('Redirecting:', url.pathname, '->', redirectUrl);

      throw redirect(redirectUrl, {
        headers: cookie ? { 'Set-Cookie': cookie } : {},
      });
    }

    // Step 4: Update context with resolved locale
    if (locale?.country) args.context.storefront.i18n.country = locale.country;
    if (locale?.language) args.context.storefront.i18n.language = locale.language;

    // Step 5: Load other data in parallel
    const [deferredData, criticalData] = await Promise.all([loadDeferredData(args), loadCriticalData(args)]);

    // Step 6: Set cookie if needed
    if (cookie) {
      args.context.localeCookie = cookie;
    }

    return {
      ...deferredData,
      ...criticalData,
      locale,
      localizations,
      publicStoreDomain: args.context.env.PUBLIC_STORE_DOMAIN,
      shop: getShopAnalytics({
        storefront: args.context.storefront,
        publicStorefrontId: args.context.env.PUBLIC_STOREFRONT_ID,
      }),
      consent: {
        checkoutDomain: args.context.env.PUBLIC_CHECKOUT_DOMAIN,
        storefrontAccessToken: args.context.env.PUBLIC_STOREFRONT_API_TOKEN,
        withPrivacyBanner: false,
        country: locale?.country,
        language: locale?.language,
      },
      // Add Judge.me configuration
      judgeme: {
        shopDomain: args.context.env.JUDGEME_SHOP_DOMAIN,
        publicToken: args.context.env.JUDGEME_PUBLIC_TOKEN,
        cdnHost: args.context.env.JUDGEME_CDN_HOST,
        delay: 100, // optional parameter, default to 500ms
      },
    };
  } catch (error) {
    // Check if this is a redirect response - if so, re-throw it
    if (error instanceof Response && (error.status === 302 || error.status === 301)) {
      throw error;
    }

    // Only fallback if it's not a redirect
    console.error('Loader error:', error);

    const fallbackLocale = { country: 'US' as CountryCode, language: 'EN' as LanguageCode, prefix: 'en-us' };
    args.context.storefront.i18n.country = fallbackLocale.country;
    args.context.storefront.i18n.language = fallbackLocale.language;

    const [deferredData, criticalData] = await Promise.all([loadDeferredData(args), loadCriticalData(args)]);

    return {
      ...deferredData,
      ...criticalData,
      locale: fallbackLocale,
      localizations: null,
      publicStoreDomain: args.context.env.PUBLIC_STORE_DOMAIN,
      shop: getShopAnalytics({
        storefront: args.context.storefront,
        publicStorefrontId: args.context.env.PUBLIC_STOREFRONT_ID,
      }),
      consent: {
        checkoutDomain: args.context.env.PUBLIC_CHECKOUT_DOMAIN,
        storefrontAccessToken: args.context.env.PUBLIC_STOREFRONT_API_TOKEN,
        withPrivacyBanner: false,
        country: fallbackLocale.country,
        language: fallbackLocale.language,
      },
      // Add Judge.me configuration
      judgeme: {
        shopDomain: args.context.env.JUDGEME_SHOP_DOMAIN,
        publicToken: args.context.env.JUDGEME_PUBLIC_TOKEN,
        cdnHost: args.context.env.JUDGEME_CDN_HOST,
        delay: 100, // optional parameter, default to 500ms
      },
    };
  }
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return { header };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  const { storefront, customerAccount, cart } = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch(error => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');

  return (
    <html lang={data?.locale?.language ?? 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body className="bg-pastel-yellow-light">
        {data ? (
          <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
            <PageLayout {...data}>{children}</PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}


export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');
  
  // Initialize Judge.me if data is available
  if (data?.judgeme) {
    useJudgeme(data.judgeme);
  }
  
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
