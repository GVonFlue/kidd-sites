# The buyer guide

The PDF is generated, not hand-laid-out, so it can be regenerated in seconds and
it can never drift from the brand.

Two outputs from the same words:

- `node design.mjs` → **PDF**, for sending and printing.
- `node slides.mjs` → **.pptx**, which becomes fully editable Google Slides when
  dropped in Drive. This is the one the client works in.

- `content.js` — every word. Edit here.
- `brand.mjs`  — the design system. Same tokens, fonts and parcel grid as the site.
- `design.mjs` — page-by-page layout, and the Chromium render.

    cd guide && npm i playwright && node design.mjs

Produces `AgentKidd_Homebuyer_Guide.pdf` and `guide-branded.html`. The HTML is a
single self-contained file with the fonts and images embedded, so it can also be
opened in a browser and printed to PDF without this toolchain.

Two things that broke during the build and will break again if touched:

1. `.page > *:not(.abs)` — anything absolutely positioned as a direct child of a
   page must carry the `abs` class. Without it that rule outscores the element's
   own `position:absolute` and silently drops it into flow.
2. `preferCSSPageSize: true` plus `html,body{width:8.5in}` is what keeps one
   `.page` div equal to exactly one PDF page.
3. In `slides.mjs`, block heights are FIXED SLOTS, never computed from character
   counts. The estimate is a guess about the renderer's font metrics, it was
   wrong often enough to run body text through the row beneath it, and it would
   be wrong again the moment the client edits a sentence in Slides.
4. `head()` takes a declared `lines` count for the title. The preview substitutes
   the brand fonts, so a title that fits one line here can wrap to two in Slides
   and drop the brass rule on top of its own second word.
