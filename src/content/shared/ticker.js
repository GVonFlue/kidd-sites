/**
 * THE CREDENTIAL TICKERS.
 *
 * EVERY LINE HERE IS ALREADY SUBSTANTIATED ELSEWHERE ON THE SITE. A ticker is
 * the single easiest place on a website for an unverified boast to appear —
 * it scrolls past, it looks like decoration, and nobody reviews it the way
 * they review a paragraph. Treat it like body copy: if a claim is not on a
 * real page with real backing, it does not go here.
 *
 * Sources, item by item:
 *   agent  — pages.js `about.credentials` and home.js `proof`
 *   cs     — cornerstone.config.js `knowsAbout` and home.js `proof`
 *
 * NO SERVICE-AREA LIST YET. The obvious version of this band is a run of metro
 * city names, and it would be the better one for local search. It is not here
 * because the site currently asserts only "the Wichita metro" and Derby, and
 * naming eight more towns would be inventing a claim about where the man
 * actually works. Ask Justus for the real list and swap `areas` in below — the
 * component takes any array of strings, so it is a one-line change.
 */

// Ready for the confirmed list. Populate and pass to <Marquee items={areas} />.
export const areas = [];

export const agentTicker = [
  'Licensed in Kansas',
  'Brokered by Real Broker, LLC',
  'REALTOR®',
  'Elite Certified Agent',
  'WSU 25 Under 25, 2024',
  '500+ doors under management',
  'Economics and finance, WSU',
];

export const cornerstoneTicker = [
  'Single family management',
  'Multifamily management',
  '7 homeowner associations',
  'Commercial leasing',
  'Section 8',
  'HOPE VI',
  'RAD',
  'LIHTC',
];
