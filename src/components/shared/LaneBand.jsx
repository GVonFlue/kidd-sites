import { H2 } from './Section';
import Reveal from './Reveal';

/**
 * The pick-your-door band. Extracted from the Serhant axis: reduce the visitor's
 * first job to one choice from a small set, each labelled plainly and explained
 * in one line.
 *
 * Each lane is a parcel. The whole card is the target, so the tap area is the
 * card rather than a small link inside it.
 */
export default function LaneBand({ heading, items = [], tone = 'wash' }) {
  if (!items.length) return null;
  const deep = tone === 'deep';
  return (
    <Reveal>
      <H2>{heading}</H2>
      <ul className={`mt-8 grid gap-px overflow-hidden rounded-lg border ${deep ? 'border-white/15 bg-white/15' : 'border-line bg-line'} sm:grid-cols-2 ${items.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {items.map((item) => (
          <li key={item.label} className={deep ? 'bg-surface-deep' : 'bg-surface'}>
            <a
              href={item.href || '#'}
              className={`group flex h-full min-h-[136px] flex-col p-6 transition-colors ${deep ? 'hover:bg-white/5' : 'hover:bg-wash'}`}
            >
              <span className="font-display text-lg font-semibold leading-snug">{item.label}</span>
              <span className={`mt-2 text-sm leading-relaxed ${deep ? 'text-white/70' : 'text-ink/70'}`}>
                {item.line}
              </span>
              <span aria-hidden="true" className="mt-auto pt-4 font-mono text-accent-ink">
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
