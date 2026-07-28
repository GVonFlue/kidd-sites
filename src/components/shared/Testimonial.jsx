/**
 * Social proof adjacency. A testimonial sits immediately before an ask, never
 * quarantined on a reviews page.
 * `full` renders the review as written. Otherwise the short pull quote is used
 * and the full text remains available on /reviews.
 */
export default function Testimonial({ item, full = false, tone = 'light' }) {
  if (!item) return null;
  const deep = tone === 'deep';
  return (
    <figure className={`border-l-2 pl-6 ${deep ? 'border-accent-lift' : 'border-accent'}`}>
      <blockquote className={`font-display text-lg font-medium leading-snug md:text-xl ${deep ? 'text-white' : 'text-ink'}`}>
        {full ? item.quote : item.short}
      </blockquote>
      <figcaption className={`mt-4 text-sm ${deep ? 'text-white/70' : 'text-ink/75'}`}>
        <span className="font-medium">{item.name}</span>
        {item.context ? <span> &middot; {item.context}</span> : null}
      </figcaption>
    </figure>
  );
}
