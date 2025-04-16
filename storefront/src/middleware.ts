import { HttpTypes } from "@medusajs/types";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string;
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
};

// Function to Get Region Map Data
async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache;

  // Check if backend URL is set
  if (!BACKEND_URL) throw new Error("Middleware.ts: Error fetching regions. Backend URL is not set");

  // Check if cache is empty or outdated (older than 1 hour)
  if (!regionMap.keys().next().value || regionMapUpdated < Date.now() - 3600 * 1000) {
    // Fetch regions from Medusa API
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: { "x-publishable-api-key": PUBLISHABLE_API_KEY },
      next: { revalidate: 3600, tags: [`regions-${cacheId}`] },
      cache: "force-cache",
    }).then(async (response) => {
      const json = await response.json();

      if (!response.ok) throw new Error(json.message);

      return json;
    });

    // Ensure regions are available
    if (!regions?.length) throw new Error("Middleware.ts: No regions found. Please set up regions in your Medusa Admin");

    // Build cache mapping each country code to its region
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region);
      });
    });

    // Update cache timestamp
    regionMapCache.regionMapUpdated = Date.now();
  }

  return regionMapCache.regionMap;
}

// Function to Determin User's Country Code
async function getCountryCode(request: NextRequest, regionMap: Map<string, HttpTypes.StoreRegion | number>) {
  try {
    let countryCode;

    // Try to get country code from Vercel header
    const vercelCountryCode = request.headers.get("x-vercel-ip-country")?.toLowerCase();

    // Check if URL already has a country code
    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase();

    // Prioritize country code from URL if valid
    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode;
    }
    // Otherwise, use Vercel's detected country if valid
    else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode;
    }
    // Fall back to default region
    else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION;
    }
    // Last resort: use the first available region
    else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value;
    }

    return countryCode;
  } catch (error) {
    // Development error logging
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      );
    }
  }
}

// The Main Middleware Function
export async function middleware(request: NextRequest) {
  let redirectUrl = request.nextUrl.href;

  let response = NextResponse.redirect(redirectUrl, 307);

  // Get or create a cache ID
  let cacheIdCookie = request.cookies.get("_medusa_cache_id");
  let cacheId = cacheIdCookie?.value || crypto.randomUUID();

  // Get the region map
  const regionMap = await getRegionMap(cacheId);

  // Determine appropriate country code
  const countryCode = regionMap && (await getCountryCode(request, regionMap));

  // Check if URL already has the country code
  const urlHasCountryCode = countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode);

  // If URL has correct country code and cache ID is set, continue normally
  if (urlHasCountryCode && cacheIdCookie) {
    return NextResponse.next();
  }

  // If URL has country code but no cache ID, set the cache ID and continue
  if (urlHasCountryCode && !cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    });

    return response;
  }

  // Skip handling for static assets
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next();
  }

  // Prepare paths for redirect
  const redirectPath = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname;
  const queryString = request.nextUrl.search ? request.nextUrl.search : "";

  // If URL doesn't have country code, redirect to include it
  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`;
    response = NextResponse.redirect(`${redirectUrl}`, 307);
  }

  return response;
}

// Export the matcher to apply middleware to all routes except API and static files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)"],
};
