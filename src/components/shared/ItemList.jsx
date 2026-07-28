import { H2 } from './Section';

const TOKEN = /^\[NEEDS VERIFICATION/;

/** Label plus one line. Used for services, process steps, portal contents. */
export default function ItemList({ heading, body, items = [], numbered = false, tone = 'light', columns = 2 }) {
  const visible = items.filter((i) => i && !TOKEN.test(i.label || '') && !TOKEN.test(i.line || ''));
  if (!visible.length) return null;
  const deep = tone === 'deep';
  const Tag = numbered ? 'ol' : 'ul';
  return (
    <div>
      {heading ? <H2>{heading}</H2> : null}
      {body ? <p className={`mt-4 max-w-prose leading-relaxed ${deep ? 'text-white/80' : 'text-ink/80'}`}>{body}</p> : null}
      <Tag className={`mt-8 grid gap-x-10 gap-y-7 ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {visible.map((item, i) => (
          <li key={item.label} className="border-t border-line/70 pt-4">
            {numbered ? (
              <span className="font-mono text-xs tabular-nums text-accent-ink">
                {String(i + 1).padStart(2, '0')}
              </span>
            ) : null}
            <p className="font-display text-base font-semibold">{item.label}</p>
            <p className={`mt-1.5 text-sm leading-relaxed ${deep ? 'text-white/70' : 'text-ink/70'}`}>
              {item.line}
            </p>
          </li>
        ))}
      </Tag>
    </div>
  );
}
