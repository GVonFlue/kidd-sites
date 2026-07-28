# kidd-sites

Two brands, two domains, one repository.

| Brand | Domain | Route prefix | Audience |
|---|---|---|---|
| Agent Kidd | `agentkidd.com` | `/agent` | Buyers, sellers, investors |
| Cornerstone Management | `cornerstonemgmt.co` | `/cornerstone` | Owners, residents, HOA boards, commercial tenants |

Built by [ProyTech](https://getproytech.com). **The client owns this code.** No proprietary
lock-in, no obfuscation, no dependency on ProyTech-only infrastructure. It runs on
any host that runs Next.js.

**Status: ready to deploy.** Routes, copy, design, integrations, SEO and
compliance are all done and audited. What remains is credentials and deployment
(Phase 6), plus the client-supplied gaps listed at the bottom of this file.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

On localhost there is no domain to route on, so use the dev-only override:

```
http://localhost:3000/?brand=cornerstone
http://localhost:3000/?brand=agent
```

The choice is pinned to a cookie, so links inside the site stay on that brand until
you switch again. The override is **disabled in production** — there, the brand comes
only from the `Host` header.

```bash
npm run build        # production build
npm start            # serve the production build
```

### Checks

Every claim made about this site is enforced by something runnable. Start the
production server first (`npm run build && npm start`), then:

| Command | What it proves |
|---|---|
| `npm run audit` | Everything below except Lighthouse, in one go |
| `npm run audit:nulls` | Lists every unconfirmed config field by name |
| `npm run audit:copy` | Fair housing (§11), voice (§7), and no invented claims |
| `npm run audit:a11y` | Contrast, labels, focus, landmarks, tap targets, no-JS |
| `npm run test:seo` | Unique titles and descriptions, canonicals, OG, JSON-LD |
| `npm run test:sweep` | Placeholder sweep and the conversion minimums per route |
| `npm run test:links` | Dead links, `tel:` format, internal routes resolving |
| `npm run test:leads` | Every conversion path end to end |
| `npm run test:failures` | Honeypot, timing, CRM down, Sheet down, no-JS submit |
| `npm run test:chat` | Bot degradation, input hygiene, rate limiting |
| `npm run test:prompt` | 51 fair-housing and scope assertions on the system prompts |
| `npm run lighthouse` | Lighthouse on all 15 routes |
| `npm run shoot` | Screenshots at 375, 390, 768, 1280, 1920 |
| `npm run og` | Regenerates the Open Graph images |

The copy and accessibility auditors are **negative-tested**: injecting a known
violation makes them fail, and removing it makes them pass. An auditor that
cannot fail is not an auditor.

---

## How it is put together

```
src/
├── middleware.js          Host -> brand routing. MUST live in src/, not the repo root
│                          (Next ignores a root middleware.js when src/ exists).
├── app/
│   ├── agent/             Real path segment, not a route group — the middleware
│   ├── cornerstone/       rewrites to /<brand>, which a (group) would not create.
│   └── api/
│       ├── lead/          One endpoint, every form, both brands (Phase 4)
│       └── chat/          Chatbot (Phase 4)
├── components/
│   ├── shared/            Header, Footer, PhoneLink — used by both brands
│   ├── agent/
│   └── cornerstone/
├── config/                FACTS. Phone numbers, licence, address, stats, tokens.
└── content/               COPY. Every word that appears on a page.
```

### The one rule that keeps this maintainable

**No component ever contains a hardcoded fact or a hardcoded string of client copy.**

Facts live in `src/config/`. Copy lives in `src/content/`. Components read from both.
That is what lets a phone number change in one place, and a typo get fixed without
anyone touching JSX.

If you find yourself typing a phone number, a person's name, or a sentence of
marketing copy inside a component — stop. It belongs in config or content.

### Unconfirmed values are `null`, never guessed

Anything not verified with the client is `null` in the config and rendered as a
visible `NEEDS …` marker, so a missing legal disclosure can never quietly disappear
from a page. `npm run audit:nulls` lists them all.

---

## Editing content

| To change | Edit |
|---|---|
| A phone number, address, licence number, stat | `src/config/<brand>.config.js` |
| Nav labels, the header button, page copy | `src/content/<brand>/` |
| Colours, type scale | `tailwind.config.js` (values traced to the approved design plan) |
| Which domain maps to which brand | `src/middleware.js` |

---

## Environment variables

Names only in `.env.example`. **Never commit a value** — not in a comment, not in an
example file, not temporarily. Real values go in Vercel project settings.

| Variable | What it is | Status |
|---|---|---|
| `ANTHROPIC_API_KEY` | Chatbot. Server-side only, never in the client bundle | Phase 4 |
| `SHEETS_WEBHOOK_URL` | Google Apps Script endpoint. **Source of truth for every lead** | Phase 4 |
| `CRM_API_KEY` | Lofty | Phase 4 |
| `GHL_WEBHOOK_URL` | Skipped silently when unset | Later |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, per domain, for metadata and sitemaps | Phase 5 |
| `APPFOLIO_API_KEY` | Rental listing feed | Blocked on a vendor API request |

---

## Deploying

Full runbook: **`deploy/DEPLOY.md`**. Browser only, no terminal.

It is split into Part A (live on Vercel, no DNS) and Part B (pointing the
domains), because that is the order this build is being launched in.

**Three things that must not be missed.**

1. **`ALLOW_BRAND_OVERRIDE=1` while there is no DNS, and deleted the moment there
   is.** Brand routing comes from the `Host` header, so on a `.vercel.app` URL
   only one brand is reachable without it. While it is set, every page is served
   `noindex` so the preview cannot be indexed. **Leaving it on after launch keeps
   both real domains `noindex` and invisible to Google.**
2. **Attach the apex *and* `www` for both domains and verify all four resolve.**
   `agentkidd.com` does not resolve at the apex today; only `www` does. That fault
   is invisible to the site's owner and fatal to anyone typing the domain without
   `www`.
3. **Capture the full DNS zone for both domains before changing anything.** Email
   runs on the domain through AppFolio. Moving records without the existing MX
   entries written down stops mail being delivered.

---

## Notes for whoever picks this up next

Two places where this build deliberately departs from the ProyTech Build Standard's
own diagrams, because following them literally produces a broken site:

- **§3 shows `(brand)/` route groups; §5's middleware rewrites to `/${brand}`.**
  Those contradict — a parenthesised route group creates no URL segment, so the
  rewrite would 404 on every page. Real directories are used instead.
- **§3 places `middleware.js` at the repository root next to `src/`.** Next.js
  ignores it there when a `src/` directory exists. It lives in `src/`.

Both were caught by building and requesting the routes, not by reading the code.


---

## Leads

Every form on both brands posts to `POST /api/lead`. One endpoint, ten distinct
source tags, so the client can see which page actually produces business.

Delivery order, and what happens when a step fails:

1. **Validate**, honeypot, and a minimum time on the form. No CAPTCHA.
2. **Google Sheet** — the source of truth. `deploy/leads-apps-script.gs` is the
   script that receives it; deploy instructions are in its header.
3. **CRM** (Lofty). Failures are logged and swallowed.
4. **GHL**. Skipped silently while `GHL_WEBHOOK_URL` is unset.

A downstream failure is **never** shown to the visitor and never loses the lead.
If nothing durable accepts a lead, the whole payload is written to the server log
prefixed `[lead] NOT PERSISTED`, which is recoverable from Vercel. That is a net,
not a floor: set `SHEETS_WEBHOOK_URL`.

External record IDs are always handled as **strings**. Several real estate CRMs
use 64-bit integers, and `Number(9007199254740993)` is `9007199254740992` — a
record ID quietly becoming a different record ID.

## The chatbot

`POST /api/chat`, Claude Haiku, `ANTHROPIC_API_KEY` server-side only.

The system prompt is **built from the config and content files**, so the bot
cannot contradict the site. Fair housing prohibitions are written into it as
absolute and are covered by 51 assertions in `npm run test:prompt`. With no API
key set it degrades honestly: it says it is not connected and gives the right
phone number for that brand.

On Cornerstone the bot is also the maintenance intake: it runs the screening
questions before escalating, and routes gas, fire or flooding straight to 911
without screening.

## SEO

- Unique `<title>` and description on all 15 routes, per-route, never global
- Canonical URLs pointing at each brand's own apex domain
- `RealEstateAgent` and `LocalBusiness` JSON-LD with real NAP data, plus a shared
  `Person` node linking the two brands to the same operator
- One sitemap per domain, host-aware, at `/sitemap.xml`
- Per-domain `robots.txt`, each pointing at its own sitemap
- Open Graph images per brand at 1200x630, drawn from the site's own motif

**An honest note to pass on to the client:** two separate domains do not merge
domain authority just because they share a repository. The real wins here are
working technical foundations, correct metadata, a resolving apex domain, local
schema, and cross-linking. Do not promise consolidated authority.

## Still needed from the client

`npm run audit:nulls` is the current list. As of Phase 5:

- The HOA review deliverable (what the board receives, what is examined, how long, cost)
- Commercial space details (address, size, type, rent, availability)
- The third HVAC screening question
- AppFolio portal and listing URLs
- A Google Calendar booking URL
- The Google Business Profile URL, and which domain carries the profile
- Registrar access and the current DNS zone for both domains
- Property photography, and the Agent Kidd logo
