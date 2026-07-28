import { fieldLabels } from '@/content/shared/forms';
import { Eyebrow, H2 } from './Section';
import LeadFormClient from './LeadFormClient';

const TOKEN = /^\[NEEDS VERIFICATION/;

/**
 * Lead capture. One markup pattern for every form on both brands.
 *
 * Accessibility, not optional (Build Standard §13):
 *  - Every input has a real <label>. Placeholder text is never used as a label.
 *  - Helper text is wired with aria-describedby, not left floating.
 *  - 44px minimum tap targets on every control.
 *
 * Anti-spam (Build Standard §8): a honeypot plus a time-to-submit stamp. No
 * CAPTCHA. At this traffic volume a CAPTCHA costs more conversions than it saves.
 *
 * Unverified value stacks are HIDDEN rather than rendered. A visitor must never
 * see a [NEEDS VERIFICATION] token, and the alternative — inventing the content —
 * is not available. The form still works; only the unsubstantiated promises are
 * withheld until the client supplies them.
 */
export default function LeadForm({ form, formKey, id, tone = 'surface' }) {
  if (!form) return null;
  const deep = tone === 'deep';
  const stack = (form.valueStack || []).filter((v) => v && !TOKEN.test(v));
  const fields = form.fields || [];

  return (
    <div id={id} className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <Eyebrow tone={deep ? 'deep' : 'ink'}>{form.eyebrow}</Eyebrow>
        <H2 className="mt-4">{form.heading}</H2>
        {form.body ? (
          <p className={`mt-5 max-w-prose leading-relaxed ${deep ? 'text-white/80' : 'text-ink/80'}`}>
            {form.body}
          </p>
        ) : null}

        {stack.length ? (
          <>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
              What you get
            </p>
            <ul className="mt-4 space-y-3">
              {stack.map((v) => (
                <li key={v} className="flex gap-3 leading-relaxed">
                  <span aria-hidden="true" className="mt-[6px] h-[6px] w-[6px] shrink-0 bg-accent" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <div className={`rounded-lg border p-6 md:p-8 ${deep ? 'border-white/15 bg-white/5' : 'border-line bg-wash'}`}>
      <LeadFormClient formKey={formKey} success={form.success}>
        {/* Honeypot. Hidden from sight and from assistive technology. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="space-y-5">
          {fields.map((f) => {
            const helpKey = `${f.replace('Optional', '')}Help`;
            const help = fieldLabels[helpKey];
            const inputId = `${id}-${f}`;
            const isMessage = f === 'message';
            const type = f.startsWith('email') ? 'email' : f.startsWith('phone') ? 'tel' : 'text';
            return (
              <div key={f}>
                <label htmlFor={inputId} className="block text-sm font-medium">
                  {fieldLabels[f] || f}
                </label>
                {isMessage ? (
                  <textarea
                    id={inputId}
                    name={f}
                    rows={3}
                    aria-describedby={help ? `${inputId}-help` : undefined}
                    className={`mt-2 w-full rounded border px-3 py-3 text-base ${deep ? 'border-white/20 bg-surface-deep text-white' : 'border-line bg-surface text-ink'}`}
                  />
                ) : (
                  <input
                    id={inputId}
                    name={f}
                    type={type}
                    required={f === 'name' || f === 'email'}
                    aria-describedby={help ? `${inputId}-help` : undefined}
                    autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'on'}
                    className={`mt-2 min-h-[48px] w-full rounded border px-3 py-3 text-base ${deep ? 'border-white/20 bg-surface-deep text-white' : 'border-line bg-surface text-ink'}`}
                  />
                )}
                {help ? (
                  <p id={`${inputId}-help`} className="mt-2 text-sm opacity-70">
                    {help}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          className="mt-7 min-h-[52px] w-full rounded-md bg-accent px-6 text-base font-semibold text-ink transition-colors hover:bg-accent-lift"
        >
          {form.button}
        </button>

        {form.consent ? <p className="mt-4 text-sm opacity-70">{form.consent}</p> : null}
      </LeadFormClient>
      </div>
    </div>
  );
}
