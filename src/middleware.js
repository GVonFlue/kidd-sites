import { NextResponse } from 'next/server';

// Host-based routing, Build Standard §5.
// Order matters: the last entry is the fallback for unknown hosts.
const DOMAIN_MAP = [
  { match: 'cornerstonemgmt', brand: 'cornerstone' },
  { match: 'agentkidd', brand: 'agent' },
];

const BRANDS = DOMAIN_MAP.map((d) => d.brand);
const DEFAULT_BRAND = DOMAIN_MAP[DOMAIN_MAP.length - 1].brand;

/**
 * TEMPORARY REVIEW MODE.
 *
 * Set ALLOW_BRAND_OVERRIDE=1 in Vercel to make ?brand= work in production.
 *
 * This exists for exactly one situation: the site is deployed and the domains
 * are not pointed yet. Without it the .vercel.app URL can only ever show Agent
 * Kidd, because brand routing comes from the Host header and there is only one
 * host. With it, reviewers can reach both brands on the preview URL.
 *
 * While it is on, every page is served `noindex`, so the .vercel.app URL cannot
 * be indexed and start competing with the real domains in search. That is the
 * trap this flag would otherwise open.
 *
 * REMOVE IT the moment DNS is pointed. It is in the launch checklist.
 */
const REVIEW_MODE = process.env.ALLOW_BRAND_OVERRIDE === '1';

export function middleware(request) {
  const url = request.nextUrl.clone();

  // Brand override: always available in development, and in production only
  // while REVIEW_MODE is deliberately switched on.
  // Pinned to a cookie so navigation inside the site stays on that brand.
  const requested = url.searchParams.get('brand');
  const cookieBrand = request.cookies.get('brand')?.value;
  const overrideAllowed = process.env.NODE_ENV !== 'production' || REVIEW_MODE;

  let brand;
  let setCookie = null;

  if (overrideAllowed && requested && BRANDS.includes(requested)) {
    brand = requested;
    setCookie = requested;
  } else {
    const host = request.headers.get('host') || '';
    const entry = DOMAIN_MAP.find((d) => host.includes(d.match));
    if (entry) {
      brand = entry.brand;
    } else if (overrideAllowed && cookieBrand && BRANDS.includes(cookieBrand)) {
      brand = cookieBrand;
    } else {
      brand = DEFAULT_BRAND;
    }
  }

  // Already rewritten — don't double-prefix.
  if (url.pathname === `/${brand}` || url.pathname.startsWith(`/${brand}/`)) {
    const passthrough = NextResponse.next();
    if (REVIEW_MODE) passthrough.headers.set('x-robots-tag', 'noindex, nofollow');
    return passthrough;
  }

  url.searchParams.delete('brand');
  url.pathname = `/${brand}${url.pathname === '/' ? '' : url.pathname}`;

  const res = NextResponse.rewrite(url);
  if (setCookie) res.cookies.set('brand', setCookie, { path: '/', httpOnly: false });
  // Keep the un-pointed preview URL out of search entirely.
  if (REVIEW_MODE) res.headers.set('x-robots-tag', 'noindex, nofollow');
  return res;
}

// Must exclude /api, /_next and static files or API routes and assets break.
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
