import PhoneLink from './PhoneLink';

/**
 * Header — persistent nav CTA on every page at every scroll position, plus a
 * tappable phone. Both are required on every build (Build Order, conversion
 * architecture minimums).
 *
 * Renders as plain HTML with no client JavaScript so the nav and the phone
 * still work with JS disabled (Build Standard §13).
 */
export default function Header({ brand, nav, cta }) {
  const dark = brand.key === 'cornerstone';

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        dark ? 'border-white/10 bg-ink text-white' : 'border-line bg-surface text-ink'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <a href="/" className="flex min-h-[44px] items-center font-display text-lg font-bold">
          {brand.name}
        </a>

        <nav aria-label="Main" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-flex min-h-[44px] items-center">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <PhoneLink phone={brand.phone} className="hidden text-sm sm:inline-flex" />
          <a
            href={cta.href}
            className={`inline-flex min-h-[44px] items-center rounded px-4 text-sm font-semibold ${
              dark ? 'bg-accent text-ink' : 'bg-ink text-white'
            }`}
          >
            {cta.label}
          </a>
        </div>
      </div>

      {/* Mobile nav — no JS, always visible, scrolls horizontally */}
      <nav aria-label="Main, mobile" className="md:hidden">
        <ul className="flex gap-5 overflow-x-auto border-t border-current/10 px-5 py-2 text-sm">
          {nav.map((item) => (
            <li key={item.href} className="shrink-0">
              <a href={item.href} className="inline-flex min-h-[44px] items-center">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
