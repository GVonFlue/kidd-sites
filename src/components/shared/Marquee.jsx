/**
 * The credential ticker — a slow infinite scroll of things that are true.
 *
 * It occupies the position a logo bar occupies on a SaaS site: immediately
 * under the hero, where a visitor deciding whether to keep reading gets a
 * second of evidence. Motion is what makes it read as a live band rather than
 * a static row nobody looks at.
 *
 * THE LIST IS RENDERED TWICE AND THE TRACK TRAVELS -50%. That is the whole
 * trick: when the animation wraps, copy two is standing exactly where copy one
 * started, so there is no visible seam. Rendering it once and translating -100%
 * leaves an empty gap sweeping across the band.
 *
 * ACCESSIBILITY. Copy two is `aria-hidden` — a screen reader that read the
 * duplicate would announce every credential twice, which is worse than not
 * having the band at all. The whole strip is also a plain list underneath, so
 * with CSS off it is still a readable set of facts, and it stops on hover and
 * on keyboard focus so nobody has to chase a moving target.
 *
 * NOTHING IN HERE IS DECORATION-ONLY COPY. Every item is a claim that appears
 * elsewhere on the site and has been verified. Do not add an item here that is
 * not already substantiated on a real page — a ticker is exactly where an
 * unverified boast slips onto a site unnoticed.
 */
import MarqueeLean from './MarqueeLean';

export default function Marquee({ items, tone = 'wash', label, duration = 46 }) {
  if (!items || items.length < 3) return null;
  // See MarqueeLean below: the band leans with the scroll.

  const deep = tone === 'deep';
  const ground = deep ? 'bg-surface-deep text-white/85' : tone === 'surface' ? 'bg-surface text-ink/80' : 'bg-wash text-ink/80';
  const edge = deep ? 'border-white/10' : 'border-line';
  const dot = deep ? 'text-accent-lift' : 'text-accent-ink';

  const Row = ({ hidden }) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-mono text-[12px] uppercase tracking-[0.13em] sm:px-8 sm:text-[13px]">{item}</span>
          <span aria-hidden="true" className={`text-[10px] ${dot}`}>&#9670;</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`marquee overflow-hidden border-y ${edge} ${ground}`}>
      {label ? <h2 className="sr-only">{label}</h2> : null}
      {/* The track is twice the content width; -50% is exactly one copy. */}
      {/* data-allow-overflow declares to test-overflow.mjs that this element is
          meant to exceed the viewport. The test still checks that the parent
          actually clips it, so the exemption cannot hide a real overflow. */}
      <MarqueeLean>
        <div
          data-allow-overflow
          className="marquee-track flex w-max py-4"
          style={{ '--marquee-duration': `${duration}s` }}
        >
          <Row />
          <Row hidden />
        </div>
      </MarqueeLean>
    </div>
  );
}
