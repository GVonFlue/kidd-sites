import { H2 } from './Section';
const TOKEN = /^\[NEEDS VERIFICATION/;

export default function Prose({ heading, body, tone = 'light' }) {
  const paras = (Array.isArray(body) ? body : [body]).filter((p) => p && !TOKEN.test(p));
  if (!paras.length) return null;
  const deep = tone === 'deep';
  return (
    <div className="max-w-prose">
      {heading ? <H2>{heading}</H2> : null}
      {paras.map((p) => (
        <p key={p.slice(0, 40)} className={`mt-5 leading-relaxed ${deep ? 'text-white/80' : 'text-ink/80'}`}>
          {p}
        </p>
      ))}
    </div>
  );
}
