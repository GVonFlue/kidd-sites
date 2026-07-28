/**
 * Tappable phone. Works with JavaScript disabled (Build Standard §13) because
 * it is a plain anchor. Minimum 44x44px tap target.
 */
export default function PhoneLink({ phone, className = '', showLabel = false }) {
  if (!phone) return null;
  return (
    <a
      href={`tel:${phone.href}`}
      className={`inline-flex min-h-[44px] items-center gap-2 px-1 ${className}`}
    >
      {/* "Call" is announced but not shown, so the accessible name still CONTAINS
          the visible text. An aria-label that replaces the visible text breaks
          voice control: the user says what they can see and nothing happens. */}
      <span className="sr-only">Call </span>
      {showLabel && phone.label ? (
        <span className="font-mono text-xs uppercase tracking-[0.08em] opacity-70">
          {phone.label}
        </span>
      ) : null}
      <span className="font-mono tabular-nums">{phone.display}</span>
    </a>
  );
}
