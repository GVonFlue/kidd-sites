/**
 * The vacancies grid, rendered from the on-site snapshot.
 *
 * This is the THIRD fallback, behind the AppFolio embed and the iframe. It
 * exists so the rentals page is never an empty rectangle with a button under
 * it — a visitor who lands on "available rentals" and sees no rentals leaves.
 *
 * Every card ends at the same place: the AppFolio listing, where the photos,
 * the application and the fee live. Nothing here tries to be the application.
 *
 * The verification date is printed, not hidden. If the list is a week old the
 * visitor can see that it is a week old and click through, which is a far
 * better outcome than a stale list presented as live.
 *
 * NO PROPERTY PHOTOS. None have been supplied, and stock photography of a house
 * that is not the house is a fair housing and misrepresentation problem, not a
 * design shortcut.
 */
export default function ListingCards({ listings, href }) {
  const items = listings?.items || [];
  if (!items.length) return null;

  const verified = listings.verifiedOn
    ? new Date(`${listings.verifiedOn}T12:00:00Z`).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : null;

  return (
    <div className="mt-10">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <li key={it.address} className="min-w-0">
            <a
              href={href}
              className="group flex h-full min-w-0 flex-col rounded-frame border border-line bg-surface p-6 transition-colors hover:border-ink/30"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-ink">{it.available}</p>

              <p className="mt-3 font-display text-[20px] font-bold leading-tight tracking-[-0.015em] text-ink">
                {it.address}
              </p>
              <p className="mt-1 text-sm text-ink/70">{it.city}</p>

              {/* Facts on one line, in tabular figures so the cards align. */}
              <p className="mt-4 font-mono text-[13px] tabular-nums text-ink/80">
                {[it.beds, it.baths, it.sqft].filter(Boolean).join(' · ')}
              </p>

              {it.line ? <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{it.line}</p> : null}

              <p className="mt-auto pt-6 font-display text-[22px] font-bold tabular-nums text-ink">{it.rent}</p>
              <span className="mt-2 text-sm font-semibold text-accent-ink underline underline-offset-4 group-hover:opacity-80">
                Photos and apply
              </span>
            </a>
          </li>
        ))}
      </ul>

      {verified ? (
        // text-ink/75, not /55. At 13px the lighter tint measured 3.82:1 against
        // the surface, under the 4.5:1 floor — a date nobody can read is worse
        // than no date, because the whole point of printing it is trust.
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
          Verified {verified}. The portal is the live list.
        </p>
      ) : null}
    </div>
  );
}
