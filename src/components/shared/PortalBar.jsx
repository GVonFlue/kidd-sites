/**
 * OWNER AND RESIDENT PORTAL LINKS.
 *
 * AppFolio hosts both portals itself. There is no login to build here and there
 * should not be one: an owner's statements and a resident's ledger live in
 * AppFolio, and a second set of credentials on this site would be a liability
 * with no upside.
 *
 * What this site owes them is the DOOR — obvious, above the fold on the pages
 * they land on, and never more than one tap away.
 *
 * It renders nothing at all until the real URLs are in
 * `external.portals` in the brand config. That is deliberate. A portal button
 * that goes nowhere is worse than no button, because a resident who taps it and
 * lands on an error calls the office, which is the exact call this is meant to
 * prevent.
 */
export default function PortalBar({ portals = [], only = null, tone = 'surface', heading, note, quiet = false }) {
  // `only` picks the doors that belong on this page. A resident landing on the
  // rentals page does not need the owner portal, and an owner does not need to
  // scan past two logins that are not theirs.
  const list = only ? portals.filter((p) => only.includes(p.key)) : portals;
  if (!list.length) return null;
  const deep = tone === 'deep';

  return (
    <div>
      {heading ? (
        quiet ? (
          <p className={`font-mono text-xs uppercase tracking-[0.08em] ${deep ? 'text-accent-lift' : 'text-accent-ink'}`}>
            {heading}
          </p>
        ) : (
          <h2 className={`font-display text-[22px] font-bold tracking-[-0.01em] ${deep ? 'text-white' : 'text-ink'}`}>
            {heading}
          </h2>
        )
      ) : null}
      <ul className={`flex flex-wrap gap-3 ${quiet ? 'mt-3' : 'mt-5'}`}>
        {list.map((p) => (
          <li key={p.key || p.url}>
            <a
              href={p.url}
              className={`inline-flex min-h-[48px] items-center gap-2 rounded-pill px-5 text-sm font-semibold transition-colors ${
                // `quiet` is for the hero. A brass fill there would be a second
                // primary in the first screenful, competing with the offer that
                // is the whole point of the page for a visitor who is not a
                // client yet. Someone who already has a login does not need the
                // loudest button on the page to find it.
                p.primary && !quiet
                  ? 'bg-accent text-ink hover:bg-accent-lift'
                  : deep
                    ? 'border border-white/25 text-white hover:bg-white/10'
                    : 'border border-line bg-surface text-ink hover:bg-wash'
              }`}
            >
              {p.label}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </li>
        ))}
      </ul>
      {note ? (
        <p className={`mt-4 max-w-prose text-sm leading-relaxed ${deep ? 'text-white/70' : 'text-ink/75'}`}>{note}</p>
      ) : null}
    </div>
  );
}
