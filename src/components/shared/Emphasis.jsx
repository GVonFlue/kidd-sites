/**
 * One word of a headline in brass instead of ink.
 *
 * The cheapest premium signal available: it costs one CSS class and it makes a
 * headline look designed rather than typed. Borrowed from the motion review of
 * ramanstudio.com, where a single gradient word carries most of the hero.
 *
 * IT TAKES A SUBSTRING, NOT MARKUP. Headlines live in the content files as
 * plain strings, and they must stay plain strings: the copy audit reads them,
 * the SEO description derives from them, and a non-technical editor has to be
 * able to change one without touching JSX. So the content file says which words
 * to lift and this splits the string around them.
 *
 * The heading's text content is unchanged — the accent is a <span> INSIDE the
 * h1, so screen readers, search engines and copy-paste all still see one
 * sentence. Never implement this by splitting the headline into two fields.
 *
 * If the substring is not found the plain string is returned untouched, which
 * is the correct failure: an editor who rewords a headline and forgets to
 * update the accent gets a normal headline, not a crash and not a half-styled
 * fragment.
 */
export default function withAccent(text, accent, tone = 'light') {
  if (!text || !accent) return text;
  const i = text.indexOf(accent);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className={tone === 'deep' ? 'accent-gradient-deep' : 'accent-gradient'}>{accent}</span>
      {text.slice(i + accent.length)}
    </>
  );
}
