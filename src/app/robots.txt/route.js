/**
 * Per-domain robots, pointing at that domain's own sitemap.
 * A single shared robots.txt would advertise the wrong sitemap on one of the
 * two domains.
 */
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const host = request.headers.get('host') || '';
  const domain = host.includes('cornerstonemgmt') ? 'cornerstonemgmt.co' : 'agentkidd.com';

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# The lead and chat endpoints are not content and should not be crawled.',
    'Disallow: /api/',
    '',
    `Sitemap: https://${domain}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=3600' },
  });
}
