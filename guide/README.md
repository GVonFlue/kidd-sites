# The buyer guide

The PDF is generated, not hand-laid-out, so it can be regenerated in seconds and
it can never drift from the brand.

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
