import { seo as agentSeo } from '@/content/agent/seo';
import { seo as cornerstoneSeo } from '@/content/cornerstone/seo';

/**
 * ONE SITEMAP PER DOMAIN. Build Standard §12.
 *
 * This is a route handler rather than Next's static `sitemap.js` because the
 * correct sitemap depends on which domain asked for it, and a static export
 * cannot know that. The middleware matcher excludes paths containing a dot, so
 * `/sitemap.xml` reaches this handler directly without being brand-rewritten.
 */
export const dynamic = 'force-dynamic';

const BRANDS = [
  { match: 'cornerstonemgmt', domain: 'cornerstonemgmt.co', routes: Object.keys(cornerstoneSeo) },
  { match: 'agentkidd', domain: 'agentkidd.com', routes: Object.keys(agentSeo) },
];

export async function GET(request) {
  const host = request.headers.get('host') || '';
  const brand = BRANDS.find((b) => host.includes(b.match)) || BRANDS[BRANDS.length - 1];
  const origin = `https://${brand.domain}`;

  const urls = brand.routes
    .map((r) => {
      const loc = r === '/' ? origin : `${origin}${r}`;
      const priority = r === '/' ? '1.0' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
  });
}
