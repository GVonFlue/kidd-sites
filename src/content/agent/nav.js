// Nav labels and CTA copy. Copy lives here, never in a component.
// Final wording is written in Phase 2.

export const nav = [
  { href: '/buy', label: 'Buy' },
  { href: '/sell', label: 'Sell' },
  { href: '/investors', label: 'Investors' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
];

// Persistent nav CTA. ak_primary_action = book a call, call or text directly.
export const headerCta = { href: '/contact', label: 'Book a call' };

export const routes = {
  '/': {
    title: 'Home',
    purpose: 'Five-second test: what he does, who for, what next. Person-first.',
    paths: [
      'Persistent nav CTA — Book a call',
      'Hero primary — free home valuation (the give)',
      'Hero secondary — call or text directly',
      'Bot, top third of the page',
      'Buyer guide lead magnet with a stacked value list',
      'Cross-brand block — Cornerstone property management (committed scope)',
      'Mid-page conversion block after the trust content',
      'Closing CTA before the footer',
      'Tappable phone in header and footer',
    ],
  },
  '/buy': {
    title: 'Buying a home',
    purpose: 'Serves every readiness level from not-ready to ready.',
    paths: ['Buyer guide download', 'Book a call', 'Search handoff to Lofty', 'Text directly'],
  },
  '/sell': {
    title: 'Selling a home',
    purpose: 'Reciprocity — the free valuation is the primary give.',
    paths: ['Free home valuation', 'Book a call', 'Seller net sheet download'],
  },
  '/investors': {
    title: 'Investors',
    purpose:
      'Highest-value visitor on the site. His self-described strength is numbers and investment analysis on the buy side.',
    paths: [
      'Investment analysis request',
      'Cross-promo to Cornerstone management',
      'Book a call',
    ],
  },
  '/about': {
    title: 'About Justus',
    purpose: 'Trust is a person, not a brand. Slot reserved for the brand video.',
    paths: ['Book a call', 'Free valuation', 'Tappable phone'],
  },
  '/reviews': {
    title: 'Reviews',
    purpose: 'Social proof adjacent to an ask, never quarantined.',
    paths: ['Book a call adjacent to each testimonial', 'Free valuation'],
  },
  '/contact': {
    title: 'Contact',
    purpose: 'No friction for the visitor who wants a human right now.',
    paths: ['Contact form', 'Tappable phone', 'Text', 'Email'],
  },
};

// Footer sitemap. Grouped by what a visitor is trying to do, which is also how
// the pages themselves are organised. Deep links point at real anchors that
// exist on those pages; a footer link to a fragment that is not there is a dead
// link that no crawler reports.
export const siteLinks = [
  {
    heading: 'Buying',
    links: [
      { href: '/buy', label: 'Buying in Wichita' },
      { href: '/buy#guide', label: 'Free buyer guide' },
      { href: '/investors', label: 'Investment property' },
    ],
  },
  {
    heading: 'Selling',
    links: [
      { href: '/sell', label: 'Selling your home' },
      { href: '/sell#valuation', label: 'Free home valuation' },
    ],
  },
  {
    heading: 'About Justus',
    links: [
      { href: '/about', label: 'About Justus Kidd' },
      { href: '/reviews', label: 'Client reviews' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Property management',
    links: [
      { href: 'https://cornerstonemgmt.co', label: 'Cornerstone Management' },
      { href: 'https://cornerstonemgmt.co/property-management', label: 'Management for owners' },
      { href: 'https://cornerstonemgmt.co/availability', label: 'Rentals in Wichita' },
    ],
  },
];
