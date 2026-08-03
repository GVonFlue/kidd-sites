import { headers } from 'next/headers';
import { getBrand } from '@/config';
import { nav as agentNav } from '@/content/agent/nav';
import { nav as cornerstoneNav } from '@/content/cornerstone/nav';

/**
 * The 404.
 *
 * A mistyped URL used to land on the framework default: unbranded, no phone
 * number, no way back. On a lead-generation site that is a lost lead, and it is
 * exactly the page a client stumbles onto while showing someone the site.
 *
 * It is BRAND-AWARE. The middleware rewrites by host, but a 404 happens before
 * any brand page renders, so the host header is read here directly. Get it wrong
 * and a Cornerstone visitor is offered a home valuation.
 *
 * No layout wraps this route, so it carries its own header and footer in
 * miniature: the wordmark, the way back, and the phone number, which is the
 * whole job.
 */
export const dynamic = 'force-dynamic';

export default function NotFound() {
  const host = headers().get('host') || '';
  const isCornerstone = host.includes('cornerstonemgmt');
  const brand = getBrand(isCornerstone ? 'cornerstone' : 'agent');
  const nav = isCornerstone ? cornerstoneNav : agentNav;

  return (
    <main className="flex min-h-screen flex-col bg-surface-deep px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
        <a href="/" className="font-display text-lg font-bold tracking-tight">
          {brand.shortName || brand.name}
        </a>

        <p className="mt-16 font-mono text-xs uppercase tracking-[0.14em] text-accent-lift">Error 404</p>
        <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.05] tracking-[-0.025em] sm:text-[46px]">
          That page is not here.
        </h1>
        <p className="mt-5 max-w-prose text-[17px] leading-relaxed text-white/80">
          Either the address has a typo in it or the page has moved. Nothing is broken on your end.
          Here is everything on the site, and the fastest way to reach a person.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-pill bg-accent px-6 font-semibold text-ink transition-colors hover:bg-accent-lift"
          >
            Back to the home page
          </a>
          <a
            href={`tel:${brand.phone.href}`}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill border border-white/25 px-6 font-mono text-sm tabular-nums text-white transition-colors hover:bg-white/10"
          >
            <span aria-hidden="true">&#9742;</span>
            <span className="sr-only">Call </span>
            {brand.phone.display}
          </a>
        </div>

        <nav aria-label="All pages" className="mt-14 border-t border-white/15 pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-white/50">Every page</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-flex min-h-[40px] items-center text-white/85 underline underline-offset-4 hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
