/**
 * Two levels only. The primary is the most visually distinct element on its
 * screen; the secondary must not compete with it. Competing CTAs suppress both.
 * Minimum 44px tap target. Focus is visible, never removed.
 */
export default function Button({ href, children, level = 'primary', tone = 'light', className = '' }) {
  if (!href || !children) return null;
  const base =
    'inline-flex min-h-[52px] items-center justify-center rounded-md px-6 text-center text-base font-semibold transition-colors';
  const styles = {
    'primary-light': 'bg-accent text-ink hover:bg-accent-lift',
    'secondary-light': 'border border-line bg-surface text-ink hover:bg-wash',
    'primary-deep': 'bg-accent text-ink hover:bg-accent-lift',
    'secondary-deep': 'border border-white/25 text-white hover:bg-white/10',
  };
  return (
    <a href={href} className={`${base} ${styles[`${level}-${tone}`]} ${className}`}>
      {children}
    </a>
  );
}
