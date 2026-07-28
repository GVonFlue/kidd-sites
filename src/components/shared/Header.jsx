import PhoneLink from './PhoneLink';

/**
 * Floating pill navigation, in the ProyTech / Serhant idiom: detached from the
 * top edge, fully rounded, dark, with the wordmark in its own chip on the left
 * and two pill actions on the right.
 *
 * It sits OUTSIDE the page frame and above it, so the frame's rounded corner
 * reads as a card the nav is resting on.
 *
 * Everything here is plain HTML with no client JavaScript: the nav and the phone
 * still work with JS disabled, and there is no hydration cost on the one element
 * present on every single page.
 */
export default function Header({ brand, nav, cta }) {
  return (
    <div className="sticky top-0 z-50 px-[var(--frame)] pb-3 pt-3 md:pt-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-8 focus:top-6 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <header className="mx-auto flex max-w-6xl items-center gap-2 rounded-pill border border-white/10 bg-ink/95 px-2 py-2 text-white shadow-[0_10px_34px_-14px_rgba(26,29,31,.55)] backdrop-blur-md">
        {/* Wordmark chip */}
        <a
          href="/"
          className="flex min-h-[44px] shrink-0 items-center rounded-pill bg-white/10 px-4 font-display text-base font-bold tracking-tight md:text-lg"
        >
          {brand.shortName || brand.name}
        </a>

        <nav aria-label="Main" className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-pill px-3 text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <PhoneLink
            phone={brand.phone}
            className="hidden rounded-pill border border-white/20 px-4 text-sm text-white transition-colors hover:bg-white/10 xl:inline-flex"
          />
          <a
            href={cta.href}
            className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-pill bg-accent px-4 text-sm font-semibold text-ink transition-colors hover:bg-accent-lift md:px-5"
          >
            {cta.label}
          </a>
        </div>
      </header>

      {/* Mobile and tablet: a second pill rail underneath, scrolling sideways.
          The phone is first so it is never more than one tap away. */}
      <nav aria-label="Main, compact" className="mx-auto mt-2 max-w-6xl lg:hidden">
        <ul className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li className="shrink-0">
            <a
              href={`tel:${brand.phone.href}`}
              className="inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-pill bg-ink px-4 font-mono text-sm tabular-nums text-accent-lift"
            >
              <span aria-hidden="true">&#9742;</span>
              <span className="sr-only">Call </span>
              {brand.phone.display}
            </a>
          </li>
          {nav.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={item.href}
                className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-pill border border-line bg-surface px-4 text-sm text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
