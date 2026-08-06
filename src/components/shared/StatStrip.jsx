import { Eyebrow } from './Section';
import Reveal from './Reveal';
import CountUp from './CountUp';

/**
 * Authority through specificity. Real numbers, set in tabular mono figures so
 * they align in a column and read as measurements rather than marketing.
 * This is the whole justification for the mono face in the type system.
 */
export default function StatStrip({ heading, stats = [], credentials = [], tone = 'ink' }) {
  if (!stats.length) return null;
  return (
    <Reveal>
      <Eyebrow tone={tone === 'deep' ? 'deep' : 'ink'}>{heading}</Eyebrow>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              {/* tabular-nums is load-bearing while the figure is counting:
                  without it every digit change reflows the row. */}
              <CountUp
                value={s.figure}
                className="block font-mono text-2xl font-medium tabular-nums tracking-tight md:text-3xl"
              />
              <span className={`mt-2 block text-sm ${tone === 'deep' ? 'text-white/70' : 'text-ink/70'}`}>
                {s.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      {credentials.length ? (
        <ul className={`mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6 text-sm ${tone === 'deep' ? 'border-white/15 text-white/70' : 'border-line text-ink/70'}`}>
          {credentials.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ) : null}
    </Reveal>
  );
}
