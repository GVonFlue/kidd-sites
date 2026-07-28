// Nav labels and CTA copy. Copy lives here, never in a component.
// Final wording is written in Phase 2.

export const nav = [
  { href: '/property-management', label: 'Management' },
  { href: '/hoa', label: 'HOA' },
  { href: '/commercial', label: 'Commercial' },
  { href: '/owners', label: 'Owners' },
  { href: '/availability', label: 'Rentals' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

// Persistent nav CTA. cs_primary_action = request an HOA review.
export const headerCta = { href: '/hoa', label: 'HOA review' };

export const routes = {
  '/': {
    title: 'Home',
    purpose:
      'Owners first, renters one tap away. Leads with information and story, not the rental search bar — committed scope.',
    paths: [
      'Persistent nav CTA — Request an HOA review',
      'Hero primary — free rent analysis (the give)',
      'Hero secondary — call leasing',
      'Bot (Mason), top third — also the maintenance triage door',
      'Pick your door band — Owner / Resident / HOA board / Investor',
      'Owner lead magnet with a stacked value list',
      'Cross-brand block — Justus as agent, with his face and story (committed scope)',
      'Mid-page conversion block',
      'Closing CTA before the footer',
      'Tappable leasing and sales phones',
    ],
  },
  '/property-management': {
    title: 'Property management',
    purpose: 'Loss aversion — a vacant month on a $900 door is a real number.',
    paths: ['Free rent analysis', 'Book a call', 'Owner guide download', 'Tappable phone'],
  },
  '/hoa': {
    title: 'HOA management',
    purpose:
      'Value first. Hard constraint from the client: no pitching, only a small factual credential block. A board is a committee, so the give has to be forwardable.',
    paths: [
      'Give-first resource: questions to ask your management company (no ask attached)',
      'Request an HOA review — delivered as a document',
      'Book a board consult',
      'Tappable sales phone',
    ],
  },
  '/commercial': {
    title: 'Commercial leasing',
    purpose:
      'He holds vacant office space that is actively costing him. Needs specifics before this page can be real.',
    paths: ['Space requirements form', 'Request a leasing consult', 'Tappable sales phone'],
  },
  '/owners': {
    title: 'Owners',
    purpose: 'Existing owners find their portal; prospective owners find the give.',
    paths: ['Owner portal handoff', 'Free rent analysis', 'Book a call'],
  },
  '/availability': {
    title: 'Rentals',
    purpose:
      'Residents and applicants. Listing replication is blocked on AppFolio API access; apply-now going offsite is fine.',
    paths: ['Handoff to AppFolio listings', 'Leasing phone', 'Bot'],
  },
  '/about': {
    title: 'About Cornerstone',
    purpose: 'Trust-building. Subsidized housing capability belongs here and on the service page.',
    paths: ['Book a call', 'Free rent analysis', 'Tappable phone'],
  },
  '/contact': {
    title: 'Contact',
    purpose: 'Two lines, deliberately routed: leasing and sales.',
    paths: ['Contact form', 'Leasing phone', 'Sales phone', 'Email'],
  },
};
