/**
 * CURRENT VACANCIES — the on-site snapshot.
 *
 * READ THIS BEFORE EDITING.
 *
 * AppFolio is the system of record. There is no public feed to render from:
 * `/listings.json` and `/listings.rss` are both disallowed by AppFolio's
 * robots.txt, and parsing their HTML would break silently the first time they
 * change a class name — the failure mode being a rentals page that quietly
 * shows nothing, which is the worst outcome on this page.
 *
 * So there are three layers, in priority order, and the page picks the first
 * one that exists:
 *
 *   1. `listingEmbed` in cornerstone.config.js — the AppFolio-generated embed
 *      snippet. THIS IS THE REAL ANSWER. It self-updates. Paste the snippet
 *      from inside the AppFolio account and it takes over automatically; the
 *      snapshot below stops rendering the moment it is set.
 *   2. `listingIframe: true` — the AppFolio listings page in a frame. Only
 *      works if AppFolio does not send X-Frame-Options for the account.
 *   3. This file — a dated snapshot, shown with its verification date visible
 *      so nobody is misled about how fresh it is.
 *
 * EVERY FIGURE BELOW WAS READ OFF THE LIVE APPFOLIO LISTINGS PAGE on the date
 * in `verifiedOn`. Nothing here is invented or estimated. If you cannot verify
 * a field, delete the field — do not guess at a rent or a square footage.
 *
 * FAIR HOUSING. These entries describe the PROPERTY and nothing else. No
 * statement about who lives nearby, who the home would suit, schools, safety,
 * or neighbourhood character. Copy the factual tone exactly.
 */

export const listings = {
  // Shown on the page, in plain words, whenever the snapshot is what is
  // rendering. An undated list is the thing residents stop trusting.
  verifiedOn: '2026-08-03',

  items: [
    {
      address: '348 S Derby Ave',
      city: 'Derby, KS 67037',
      beds: '5 bd',
      baths: '2 ba',
      sqft: '2,100 sq ft',
      rent: '$1,800/mo',
      available: 'Available now',
      line: 'Five bedroom, two bath house.',
    },
    {
      address: '1928 S Millwood Ave',
      city: 'Wichita, KS 67213',
      beds: '3 bd',
      baths: '1 ba',
      sqft: '1,100 sq ft',
      rent: '$1,200/mo',
      available: 'Available now',
      line: 'Three bedroom, one bath house.',
    },
    {
      address: '1710 E Victor St #5',
      city: 'Wichita, KS 67214',
      beds: '1 bd',
      baths: '1 ba',
      sqft: '410 sq ft',
      rent: '$725/mo',
      available: 'Available now',
      line: 'One bedroom, one bath apartment just east of downtown.',
    },
    {
      address: '309 S Laura',
      city: 'Wichita, KS 67211',
      // Commercial. Rent is deliberately absent: the AppFolio listing shows no
      // asking price, and inventing one to fill the column would be a lie a
      // tenant could act on.
      beds: 'Office suites',
      baths: null,
      sqft: null,
      rent: 'Ask for pricing',
      available: 'Available now',
      line: 'Furnished private office suites with high-speed Wi-Fi included.',
    },
  ],
};

export default listings;
