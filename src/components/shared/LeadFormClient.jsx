'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Progressive enhancement only. The <form> inside this wrapper is a real form
 * with a real action, so it works with JavaScript disabled: the endpoint answers
 * a normal POST with a 303 redirect back to the page's success state.
 *
 * With JavaScript on, this intercepts and posts JSON so the visitor stays put
 * and sees the success message inline.
 */
export default function LeadFormClient({ children, formKey, success }) {
  const ref = useRef(null);
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState(null);

  // Time-to-submit stamp. Set from the client so it reflects when this visitor
  // actually saw the form, not when the page was built.
  useEffect(() => {
    const el = ref.current?.querySelector('input[name="t"]');
    if (el) el.value = String(Date.now());
    const back = ref.current?.querySelector('input[name="returnTo"]');
    if (back) back.value = window.location.pathname;
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setState('sending');
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setError(json.error || 'Something went wrong on our end, not yours. Call or text (316) 390-2120 and it will get handled.');
        setState('error');
        return;
      }
      setState('done');
    } catch {
      setError('Something went wrong on our end, not yours. Call or text (316) 390-2120 and it will get handled.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div role="status" className="rounded-lg border border-accent bg-wash p-6 md:p-8">
        <p className="font-display text-xl font-bold">{success?.heading || 'Got it.'}</p>
        <p className="mt-3 max-w-prose leading-relaxed">{success?.body}</p>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <form onSubmit={onSubmit} method="post" action="/api/lead" noValidate={false}>
        <input type="hidden" name="formKey" value={formKey} />
        <input type="hidden" name="t" defaultValue="" />
        <input type="hidden" name="returnTo" defaultValue="" />
        {children}
        {state === 'error' && error ? (
          <p role="alert" className="mt-4 border-l-2 border-accent pl-4 text-sm">{error}</p>
        ) : null}
      </form>
    </div>
  );
}

export function SubmitButton({ label }) {
  return (
    <button
      type="submit"
      className="mt-7 min-h-[52px] w-full rounded-md bg-accent px-6 text-base font-semibold text-ink transition-colors hover:bg-accent-lift"
    >
      {label}
    </button>
  );
}
