'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * The live conversation. Build Standard §9.
 *
 * Opens on a short scripted sample so the panel demonstrates rather than just
 * invites. The sample is labelled "Sample" on every line and is cleared the
 * instant a real message is sent, so it can never be mistaken for a real
 * customer exchange.
 *
 * Full history is sent on every request because the API is stateless.
 */
export default function BotClient({ brand, botName, chips, greeting, demo = [], tone, actions = {} }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const sessionId = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    sessionId.current = `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }, []);

  // Reveal the sample one line at a time, so the panel reads as a conversation
  // happening rather than a block of text. Under reduced motion the whole
  // sample appears at once instead.
  useEffect(() => {
    if (!demo.length || messages.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDemoStep(demo.length); return; }
    if (demoStep >= demo.length) return;
    const gap = demoStep === 0 ? 700 : demo[demoStep].from === 'bot' ? 1100 : 800;
    const t = setTimeout(() => setDemoStep((n) => n + 1), gap);
    return () => clearTimeout(t);
  }, [demoStep, demo, messages.length]);

  // Keep the newest line in view — during the scripted sample as well as during
  // a real conversation, since the log is height-capped in both states.
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, demoStep, busy]);

  async function send(text) {
    const clean = text.trim();
    if (!clean || busy) return;
    const next = [...messages, { role: 'user', content: clean }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, sessionId: sessionId.current, messages: next }),
      });
      const json = await res.json().catch(() => ({}));
      setMessages([...next, { role: 'assistant', content: json.reply || 'Call or text and you will get a person.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'I could not reach my end just then. Please call or text.' }]);
    } finally {
      setBusy(false);
    }
  }

  const deep = tone === 'deep';
  const started = messages.length > 0;

  function onChip(chip) {
    if (chip.action && actions[chip.action]) { window.location.href = actions[chip.action]; return; }
    send(chip.label);
  }

  const bubbleThem = deep ? 'bg-white/10 text-white' : 'border border-line bg-surface text-ink';
  const bubbleBot = deep ? 'bg-accent/20 text-white' : 'bg-accent/15 text-ink';

  return (
    <div className="min-w-0 px-4 py-4 sm:px-5 sm:py-5">
      {/* The log is ALWAYS height-capped, not just once a real conversation
          starts. The scripted sample is six bubbles long, and uncapped it made
          the card taller than a laptop viewport — the panel ran off the bottom
          of the screen and the section below it was pushed out of reach. A
          capped, auto-scrolling log also reads more like a live chat window. */}
      <div
        ref={logRef}
        aria-live="polite"
        className="min-w-0 space-y-3 overflow-y-auto overscroll-contain [scrollbar-width:thin] max-h-[min(58vh,340px)] lg:max-h-[min(46vh,380px)]"
      >
        <p className={`max-w-prose leading-relaxed ${deep ? 'text-white/90' : 'text-ink/90'}`}>{greeting}</p>

        {!started && demo.slice(0, demoStep).map((m, i) => (
          <div key={i} className={m.from === 'bot' ? '' : 'flex justify-end'}>
            <div className={`max-w-[92%] break-words rounded-2xl px-3.5 py-2.5 sm:max-w-[88%] sm:px-4 sm:py-3 ${m.from === 'bot' ? bubbleBot : bubbleThem}`}>
              <span className={`mb-1 block font-mono text-[10px] uppercase tracking-[0.09em] ${deep ? 'text-white/70' : 'text-ink/70'}`}>
                {m.from === 'bot' ? botName : 'Sample'}
              </span>
              <span className="block text-[15px] leading-relaxed">{m.text}</span>
              {m.meta ? (
                <span className={`mt-1.5 block font-mono text-[10px] uppercase tracking-[0.09em] ${deep ? 'text-accent-lift' : 'text-accent-ink'}`}>
                  &#10003; {m.meta}
                </span>
              ) : null}
            </div>
          </div>
        ))}

        {!started && demoStep < demo.length ? (
          <div className="flex gap-1 px-1 pt-1" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-accent opacity-60 motion-safe:animate-bounce"
                style={{ animationDelay: `${i * 140}ms` }}
              />
            ))}
          </div>
        ) : null}

        {messages.map((m, i) => (
          <div key={i} className={m.role === 'assistant' ? '' : 'flex justify-end'}>
            <div className={`max-w-[92%] break-words rounded-2xl px-3.5 py-2.5 sm:max-w-[88%] sm:px-4 sm:py-3 ${m.role === 'assistant' ? bubbleBot : bubbleThem}`}>
              <span className={`mb-1 block font-mono text-[10px] uppercase tracking-[0.09em] ${deep ? 'text-white/70' : 'text-ink/70'}`}>
                {m.role === 'assistant' ? botName : 'You'}
              </span>
              <span className="block text-[15px] leading-relaxed">{m.content}</span>
            </div>
          </div>
        ))}

        {busy ? <p className={`px-1 text-sm ${deep ? 'text-white/75' : 'text-ink/75'}`}>{botName} is typing</p> : null}
      </div>

      {!started ? (
        <ul className="mt-5 flex min-w-0 flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip.label}>
              <button
                type="button"
                onClick={() => onChip(chip)}
                className={`min-h-[44px] rounded-pill border px-4 text-sm transition-colors ${
                  chip.kind === 'conversion'
                    ? 'border-accent bg-accent font-semibold text-ink hover:bg-accent-lift'
                    : deep
                      ? 'border-white/25 text-white hover:bg-white/10'
                      : 'border-line bg-surface hover:bg-wash'
                }`}
              >
                {chip.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className={`mt-5 flex min-w-0 items-center gap-2 rounded-pill border py-1 pl-4 pr-1 ${
          deep ? 'border-white/20 bg-white/5' : 'border-line bg-surface'
        }`}
      >
        <label htmlFor="bot-input" className="sr-only">Ask {botName} a question</label>
        <input
          id="bot-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${botName} anything`}
          maxLength={1500}
          className="min-h-[48px] w-full min-w-0 bg-transparent text-base outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-ink transition-colors hover:bg-accent-lift disabled:opacity-50"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </form>
    </div>
  );
}
