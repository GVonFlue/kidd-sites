import { H2 } from './Section';
import Reveal from './Reveal';
import ScrollFill from './ScrollFill';
const TOKEN = /^\[NEEDS VERIFICATION/;

/**
 * `fill` turns the FIRST paragraph into a scroll-written statement: the words
 * fill with brass, left to right, tied to scroll position.
 *
 * Only the first, and only where it is asked for. The effect works because it
 * is rare — a page where every paragraph writes itself is a page nobody can
 * skim, and skimming is what most visitors are doing.
 *
 * It is also deliberately not available on the deep ground: the pale
 * unfilled state is tuned against a light surface, and on near-black it would
 * be either invisible or too loud.
 */
export default function Prose({ heading, body, tone = 'light', fill = false }) {
  const paras = (Array.isArray(body) ? body : [body]).filter((p) => p && !TOKEN.test(p));
  if (!paras.length) return null;
  const deep = tone === 'deep';
  const canFill = fill && !deep;
  return (
    <Reveal className="max-w-prose">
      {heading ? <H2>{heading}</H2> : null}
      {paras.map((p, i) =>
        canFill && i === 0 ? (
          <ScrollFill key={p.slice(0, 40)} className="mt-5 text-[19px] font-medium leading-relaxed md:text-[22px]">
            {p}
          </ScrollFill>
        ) : (
          <p key={p.slice(0, 40)} className={`mt-5 leading-relaxed ${deep ? 'text-white/80' : 'text-ink/80'}`}>
            {p}
          </p>
        ),
      )}
    </Reveal>
  );
}
