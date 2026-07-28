# Deploy runbook — agentkidd.com + cornerstonemgmt.co

Build Standard §15. **Browser only. No terminal required.**

One repository, one Vercel project, two domains, four hostnames.

> **Nothing in this file has been executed.** This prepares a human to deploy.

**Order of work, decided 27 July: get it live on GitHub and Vercel first, point
DNS later.** That is why DNS is Part B rather than step 0. It works, but it
creates one problem — see step 5 — which is solved by a temporary switch that
must be turned off again in Part B.

---

# PART A — live on Vercel, no DNS

## 1. Create the GitHub repository

1. New **private** repository under the **ProyTech account** (decided 27 July).
2. Name it `kidd-sites`.
3. Do **not** initialise with a README; this repo has one.
4. **Add Justus as a collaborator.** Both sites carry the line *"This site's code
   belongs to its owner"* in the footer, and he asked the ownership question in
   the discovery meeting because a previous vendor burned him. That promise
   should be true on day one rather than on request.

## 2. Upload the files

GitHub's web uploader, drag and drop.

1. Drag the whole project folder in, **except** `node_modules`, `.next` and
   `shots`. All three are gitignored and all three regenerate.
2. Commit directly to `main`.

**Gotcha:** the web uploader is unreliable with deeply nested folders in one
drag. If anything under `src/app/api/` is missing afterwards, use
**Add file → Create new file**, type the full path, and paste the contents.

**Check these four after upload. Each one fails silently if it is wrong:**

- [ ] `src/middleware.js` exists, **in `src/`, not the repository root.** Next.js
      ignores a root-level middleware when `src/` exists, with no error at all:
      the build succeeds, every page returns 200, host routing never happens, and
      **both domains serve Agent Kidd.**
- [ ] `src/app/agent/` and `src/app/cornerstone/` are plain folders, **not**
      `(agent)` / `(cornerstone)`. Route groups create no URL segment, so the
      rewrite would 404 every page.
- [ ] `src/app/api/lead/route.js` and `src/app/api/chat/route.js` are present.
- [ ] `.env.example` is present and **contains no values.**

## 3. Import into Vercel

1. **Add New → Project**, import `kidd-sites`.
2. Framework preset: **Next.js**, auto-detected.
3. Leave build command, output directory and install command at their defaults.
4. **Do not deploy yet.** Environment variables first.

## 4. Environment variables

**Project Settings → Environment Variables**, for Production, Preview and
Development, *before* the first build.

| Variable | Value comes from | Set it now? |
|---|---|---|
| `ALLOW_BRAND_OVERRIDE` | Type `1`. **Temporary — see step 5.** | **Yes, while there is no DNS** |
| `SHEETS_WEBHOOK_URL` | Deploy the Apps Script (in the client's Drive folder, and at `deploy/leads-apps-script.gs`), paste the `/exec` URL | **Yes, before anyone is told the site exists** |
| `ANTHROPIC_API_KEY` | ProyTech's own Anthropic account | Only when Mason should answer |
| `CRM_API_KEY` | Justus, in Lofty: **Settings → Integrations → API** | No |
| `CRM_ENDPOINT_URL` | The Lofty endpoint matching that key | No |
| `GHL_WEBHOOK_URL` | Empty until GHL is live | No |
| `NEXT_PUBLIC_SITE_URL` | **Nothing reads this** | No |
| `APPFOLIO_API_KEY` | **Nothing reads this yet** | No |

**Never commit a value to the repository.** Not in a comment, not in
`.env.example`, not temporarily.

## 5. The problem with deploying before DNS, and the switch that fixes it

Brand routing comes from the `Host` header. On a `.vercel.app` URL there is only
one host, so **without intervention the preview URL can only ever show Agent
Kidd.** Cornerstone would be unreviewable until DNS is pointed.

`ALLOW_BRAND_OVERRIDE=1` fixes that. With it set:

```
https://<project>.vercel.app/?brand=cornerstone     Cornerstone
https://<project>.vercel.app/?brand=agent           Agent Kidd
```

The choice is pinned to a cookie, so links inside the site stay on that brand.

**While the flag is on, every page is served `x-robots-tag: noindex, nofollow`.**
That is deliberate. A public, indexable `.vercel.app` copy of the site would
compete with the real domains in search and is genuinely hard to clean up
afterwards. The flag and the noindex are the same switch on purpose so they
cannot get out of step.

Without the flag, `?brand=` is ignored in production and nothing is noindexed.
Both states are tested.

## 6. Deploy

1. Deploy.
2. Open the `.vercel.app` URL. You should see **Agent Kidd**.
3. Add `?brand=cornerstone`. You should see **Cornerstone Management**.
4. Confirm the noindex header is present:
   `curl -sI https://<project>.vercel.app/ | grep -i x-robots-tag`
   Expect `noindex, nofollow`. If it is missing, the flag did not take, and the
   preview is publicly indexable. Fix that before sharing the URL.

## 7. Review

The site is now live and reviewable. Every route works, every form submits, and
if `SHEETS_WEBHOOK_URL` is set, leads land in the Sheet and email Justus.

**Send this URL to Justus for the first-draft review.** Tell him two things:
the `?brand=` switch is how he sees the management side, and the domains are not
pointed yet, so this address is temporary.

---

# PART B — pointing the domains

Do this when Justus has produced registrar access.

## 8. First: capture the DNS. Do not skip this.

His email runs on the domain through **AppFolio**. Replace or move records
without the existing MX records written down and **his mail stops arriving**,
possibly for days before anyone notices.

For **both** `agentkidd.com` and `cornerstonemgmt.co`:

1. Sign in to the registrar.
2. Open the DNS zone editor.
3. **Screenshot the entire zone.** Every record, every type.
4. Save both screenshots into the client's Drive folder.
5. Write down every **MX** and **TXT** record specifically (SPF, DKIM, DMARC).
   Those are the ones that carry email and email authentication, and the ones a
   careless migration destroys.

Also establish **who the registrar actually is.** The onboarding form says only
"bought through my website company," and the sites run on Lofty and AppFolio. If
a vendor holds the domains, expect a transfer or an authorisation step first.

**Known fault to fix here:** `agentkidd.com` does **not** resolve at the apex
today. Only `www` works. Justus found this out live in the discovery meeting.
Anyone typing the domain without `www` currently gets nothing.

## 9. Attach the domains in Vercel

Project Settings → **Domains**. Add all four:

1. `agentkidd.com`
2. `www.agentkidd.com`
3. `cornerstonemgmt.co`
4. `www.cornerstonemgmt.co`

**Apex is canonical on both**, matching the canonical tags the site emits
(`https://agentkidd.com/buy`). Set each `www` host to **redirect to the apex**.
Backwards, and the tags and the redirect disagree, and the two forms compete.

## 10. DNS records, at the registrar

> **Read both values off Vercel's own domain card for this project. Do not copy
> an IP from memory or from an older runbook.** `76.76.21.21` was the universal
> answer for years, but Vercel now draws apex IPs from a pool matched to the plan
> and project, so a newer project shows something else such as `216.198.79.1`.
> The value shown next to *your* domain in *your* project is the only right one.

For **each** domain:

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | the IP on that domain's card in Vercel | 3600 |
| `CNAME` | `www` | the CNAME target on that domain's card | 3600 |

`ALIAS` or `ANAME` if the registrar cannot do a bare apex `A`.

**Leave every MX and TXT record exactly as it is.** Step 8 is why you can.

**Do not switch to Vercel nameservers** unless you first recreate every email
record inside Vercel's DNS. The A-and-CNAME method avoids the problem entirely,
which is why it is the method here.

## 11. Turn the review switch off

**Delete `ALLOW_BRAND_OVERRIDE` from Vercel and redeploy.**

Leaving it on means `?brand=` keeps working on the real domains, and — worse —
**every page stays `noindex` and neither site can rank at all.** This is the
single easiest way to launch a site that is invisible to Google.

Confirm afterwards:

```
curl -sI https://agentkidd.com/ | grep -i x-robots-tag
```

Expect **nothing**. Any output means the flag is still set.

## 12. Verify

```bash
npm run verify:live
```

Checks apex and www on both domains, `http` upgrading to `https`, all 15 routes
serving the right brand, the compliance footer on every page, canonicals,
per-domain sitemaps and robots, and both OG images. Exits non-zero on any
failure and prints a by-hand checklist for the things a script must not do, such
as submitting a real lead into the client's Sheet.

## 13. Search Console

1. Add **both** domains as properties.
2. Submit `https://agentkidd.com/sitemap.xml`.
3. Submit `https://cornerstonemgmt.co/sitemap.xml`.
4. Run Google's **Rich Results Test** on both homepages. The JSON-LD is built and
   self-tested but has never been checked by Google, because that needs a public
   URL. This is the one Definition-of-Done line that cannot close before launch.

## 14. Google Business Profile

The single profile goes on **cornerstonemgmt.co** (decided 27 July). Once set,
paste the profile URL into `social.google` in
`src/config/cornerstone.config.js` so it joins the `sameAs` list in the schema.

---

## Launch checklist

- [ ] Repo private, under ProyTech, **Justus added as collaborator**
- [ ] All four silent-failure checks from step 2 passed
- [ ] `SHEETS_WEBHOOK_URL` set, and a test lead reached the Sheet and the inbox
- [ ] Test rows deleted from the Sheet
- [ ] DNS zone screenshots saved for both domains **before** any change
- [ ] All four hostnames resolve
- [ ] `www` redirects to apex on both
- [ ] **`ALLOW_BRAND_OVERRIDE` deleted and redeployed**
- [ ] **`x-robots-tag` gone from the live domains**
- [ ] `npm run verify:live` passes
- [ ] Both sitemaps submitted
- [ ] Rich Results Test run on both homepages
- [ ] An email sent from an outside account to `justus@agentkidd.com` arrives

---

## What is deliberately still switched off

| Off | Why | On when |
|---|---|---|
| Mason answers | No API key in Vercel | The key is added |
| Leads reaching Lofty | No CRM key | Justus generates it in Lofty |
| Rental listings on site | AppFolio API not granted | Vendor request completes |
| Portal buttons | No URLs | AppFolio provides them |
| Book a call against a calendar | No calendar URL | Justus shares his Google Calendar link |
| Search homes | Lofty deliberately unlinked for v1 | A destination is chosen |
| HOA review value stack | Deliverable not defined | The sit-down |
| Commercial space detail | Not supplied | The sit-down |

None of these show an error or a dead control. Each either withholds the section
or falls back to a phone number.
