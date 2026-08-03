import PhoneLink from './PhoneLink';
import BrandMark from './BrandMark';

/**
 * Floating pill navigation, in the ProyTech / Serhant idiom: detached from the
 * top edge, fully rounded, dark, with the wordmark in its own chip on the left
 * and two pill actions on the right.
 *
 * It sits OUTSIDE the page frame and above it, so the frame's rounded corner
 * reads as a card the nav is resting on.
 *
 * ON A PHONE the bar carries only what a visitor needs in the first second: the
 * two highest-intent destinations and the phone number. Everything else goes
 * behind a menu. Client decision at the V1 sit-down and the right one — the old
 * version was a sideways-scrolling rail, and a link you have to swipe to find is
 * a link nobody finds.
 *
 * THE MENU IS A <details>, NOT JAVASCRIPT. It opens and closes with no script at
 * all, which keeps the promise that this site works with JavaScript disabled. A
 * navigation that will not open is a far worse failure than a section that will
 * not animate. It is keyboard-operable and screen-reader-announced for free.
 */
export default function Header({ brand, nav, cta }) {
  // The first two are the ones that survive on a phone. Order in the nav content
  // file is deliberate: it is a ranking, not a list.
  const primary = nav.slice(0, 2);
  const rest = nav.slice(2);

  return (
    <div className="sticky top-0 z-50 px-[var(--frame)] pb-3 pt-3 md:pt-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-8 focus:top-6 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <header className="mx-auto flex max-w-6xl items-center gap-2 rounded-pill border border-white/10 bg-ink/95 px-2 py-2 text-white shadow-[0_10px_34px_-14px_rgba(26,29,31,.55)] backdrop-blur-md">
        {/* Wordmark chip, or the logo once one has been supplied. */}
        {/* min-w-0 + a width cap, NOT shrink-0. The chip used to refuse to
            shrink, so anything unexpectedly wide inside it — a logo file that
            had not been uploaded yet, rendering as its alt text — pushed the
            menu button clean off the right edge of the viewport. The bar must
            survive whatever ends up in this chip. */}
        <a
          href="/"
          className="flex min-h-[44px] min-w-0 max-w-[52%] items-center overflow-hidden rounded-pill bg-white/10 px-4 font-display text-base font-bold tracking-tight md:max-w-none md:text-lg"
        >
          <BrandMark src={brand.logo} name={brand.name} fallback={brand.shortName} />
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
            className="hidden min-h-[44px] items-center whitespace-nowrap rounded-pill bg-accent px-4 text-sm font-semibold text-ink transition-colors hover:bg-accent-lift sm:inline-flex md:px-5"
          >
            {cta.label}
          </a>

          {/* Everything not in the phone bar, one tap away. */}
          {/* `[&:not([open])>nav]:hidden` is load-bearing. A closed <details> hides
              its own children, but an ABSOLUTELY POSITIONED child escapes that
              hiding: the panel stayed laid out, 230px wide, anchored past the
              right edge of the bar, and pushed the document's scroll width to
              380 inside a 375 viewport. Every Cornerstone page scrolled sideways
              because of a menu nobody had opened. */}
          <details className="relative lg:hidden [&:not([open])>nav]:hidden">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-1.5 rounded-pill border border-white/20 px-4 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
              Menu
              <span aria-hidden="true" className="text-[9px] leading-none">&#9660;</span>
            </summary>
            <nav
              aria-label="More"
              className="absolute right-0 top-[calc(100%+10px)] z-50 w-[230px] overflow-hidden rounded-frame border border-line bg-surface py-2 text-ink shadow-[0_18px_44px_-18px_rgba(26,29,31,.5)]"
            >
              <ul>
                {rest.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="flex min-h-[46px] items-center px-5 text-[15px] hover:bg-wash">
                      {item.label}
                    </a>
                  </li>
                ))}
                {/* The CTA is hidden in the bar below 640px, so it lives here
                    instead of being unreachable on the narrowest phones. */}
                <li className="mt-1 border-t border-line pt-1 sm:hidden">
                  <a href={cta.href} className="flex min-h-[46px] items-center px-5 text-[15px] font-semibold text-accent-ink hover:bg-wash">
                    {cta.label}
                  </a>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </header>

      {/* The phone bar. Two destinations and the number, always visible, never
          scrolled. On a phone this is the whole navigation most people use. */}
      {/* min-w-0 on the row and on every child: a flex row refuses to shrink
          below its min-content width by default, and the moment it exceeds the
          frame it drags the sticky header out with it and every page on the
          brand gets a sideways scroll. */}
      <nav aria-label="Main, compact" className="mx-auto mt-2 flex w-full min-w-0 max-w-6xl items-center gap-2 lg:hidden">
        {primary.map((item) => (
          <a
            key={item.href}
            href={item.href}
            // min-w-0 + truncate, NOT nowrap. Cornerstone's labels are longer
            // than Agent Kidd's, and with nowrap the two pills plus the phone
            // number forced the whole bar 385px wide inside a 319px frame —
            // which pushed the header out with it and gave every Cornerstone
            // page a sideways scroll at 320 and 375.
            className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center truncate rounded-pill border border-line bg-surface px-3 text-sm font-medium text-ink"
          >
            {item.label}
          </a>
        ))}
        <a
          href={`tel:${brand.phone.href}`}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill bg-ink px-2.5 font-mono text-[12.5px] tabular-nums text-accent-lift sm:px-3 sm:text-[13px]"
        >
          <span aria-hidden="true">&#9742;</span>
          <span className="sr-only">Call </span>
          {/* The number itself is dropped below 400px, where three items plus a
              14-character phone number cannot fit inside the frame. The icon and
              the tap target stay, so the call is still one tap; only the label
              goes. Better than truncating a phone number, which would read as
              a wrong number. */}
          <span className="hidden min-[400px]:inline">{brand.phone.display}</span>
          <span className="min-[400px]:hidden" aria-hidden="true">Call</span>
        </a>
      </nav>
    </div>
  );
}
