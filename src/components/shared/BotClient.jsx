'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * The live conversational surface. Build Standard §9.
 * Embedded in the page body, not a floating corner bubble.
 *
 * Full history is sent on every request because the API is stateless.
 * The opening message and the chips are server-rendered by BotPanel, so the bot
 * is visible and readable before this component hydrates and with JS disabled.
 */
export default function BotClient({ brand, botName, chips, greeting, tone, actions = {} }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const sessionId = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    sessionId.current = `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }, []);

  useEffect(() => {
    if (logRef.current && messages.length) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

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

  function onChip(chip) {
    if (chip.action && actions[chip.action]) { window.location.href = actions[chip.action]; return; }
    send(chip.label);
  }

  return (
    <div className="px-5 py-6">
      <div
        ref={logRef}
        aria-live="polite"
        aria-atomic="false"
        className={messages.length ? 'max-h-[340px] overflow-y-auto' : ''}
      >
        <p className="max-w-prose leading-relaxed">{greeting}</p>
        {messages.map((m, i) => (
          <p
            key={i}
            className={`mt-4 max-w-prose leading-relaxed ${
              m.role === 'user'
                ? `rounded-lg px-4 py-3 ${deep ? 'bg-white/10' : 'bg-surface'}`
                : ''
            }`}
          >
            {m.role === 'user' ? <span className="sr-only">You said: </span> : <span className="sr-only">{botName} said: </span>}
            {m.content}
          </p>
        ))}
        {busy ? <p className="mt-4 text-sm text-ink/75">{botName} is typing</p> : null}
      </div>

      {messages.length === 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip.label}>
              <button
                type="button"
                onClick={() => onChip(chip)}
                className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors ${
                  chip.kind === 'conversion'
                    ? 'border-accent bg-accent font-semibold text-ink'
                    : deep
                      ? 'border-white/25 hover:bg-white/10'
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
        className={`mt-6 flex items-center gap-2 rounded-md border px-3 ${deep ? 'border-white/20' : 'border-line bg-surface'}`}
      >
        <label htmlFor="bot-input" className="sr-only">Ask {botName} a question</label>
        <input
          id="bot-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${botName} anything`}
          maxLength={1500}
          className="min-h-[48px] w-full bg-transparent text-base outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-accent font-mono text-ink disabled:opacity-50"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </form>
    </div>
  );
}
