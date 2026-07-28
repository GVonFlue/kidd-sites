/**
 * Cornerstone — HOA page.
 *
 * THIS PAGE HAS A HARD TONAL CONSTRAINT, stated by the client in discovery:
 *
 *   "HOA-facing content must be value first, with only a small
 *    'prepared for Justus Kidd, agent' credential block. No pitching."
 *
 * And underneath it, the reason:
 *
 *   "He explicitly doesn't want to be the guy who shows up to the annual HOA
 *    meeting and pitches himself. He wants to earn the position through
 *    consistent value, then get the business by default."
 *
 * So the page order is deliberately inverted against normal conversion practice.
 * The give comes FIRST and carries no ask. The credential block is small and
 * factual. The request for a review sits at the bottom, stated once, quietly.
 *
 * PRIMARY CTA PRINCIPLE: Reciprocity, taken further than usual. A board is a
 * committee of volunteers, so the give has to be forwardable and readable in a
 * meeting, which is why the lead magnet is a document rather than a call.
 *
 * ALSO KNOWN, and relevant: a board member at one of these associations is
 * himself a licensed agent. Nothing on this page should read as a land grab.
 */

export const hoa = {
  hero: {
    eyebrow: 'For association boards',
    // A claim about the reader's situation, not about us.
    heading: 'What your management company should be doing, and how to check.',
    body:
      'Most boards inherit a management agreement they did not negotiate and never read again. This page is written to be useful to your board whether or not you ever contact us.',
    primaryCta: { label: 'Get the board guide', href: '#board-guide' },
    secondaryCta: { label: 'Call (316) 390-2120', href: 'tel:+13163902120' },
  },

  // THE GIVE. First on the page, no ask attached, no contact required to use it.
  give: {
    id: 'board-guide',
    eyebrow: 'Free, and there is no catch',
    heading: 'Questions to ask your management company before you renew',
    body:
      'One page, written to be forwarded to the rest of your board and read in a meeting. It is deliberately not about us. If you read it, ask your current manager these questions, and get good answers, then you already have the right company.',
    items: [
      'What your agreement should say about reserve funds, and what to do if it is silent',
      'Which financial reports your board is entitled to, and how often they should arrive',
      'How to tell whether maintenance is being coordinated or merely logged',
      'What questions to ask about vendor selection and whether bids are competitive',
      'What a transition to a new manager actually involves, including the disruption',
    ],
    formKey: 'hoaBoardGuide',
  },

  // Plain factual description. No adjectives about ourselves.
  what: {
    heading: 'What we do for the associations we manage',
    body:
      'Seven associations, between 66 and 250 units each, several of them still being built out. Newer communities have a specific problem: the developer hands over control while construction is ongoing, and the first boards inherit reserve studies and vendor arrangements they had no part in setting up.',
    items: [
      { label: 'Financial administration', line: 'Assessments collected, budgets prepared, reserves tracked against the study.' },
      { label: 'Vendor management', line: 'Contracts held, work scheduled, invoices reconciled against what was agreed.' },
      { label: 'Maintenance coordination', line: 'Common area work orders raised and tracked to completion.' },
      { label: 'Meeting support', line: 'Materials prepared ahead of board meetings so decisions happen in the room.' },
      { label: 'Covenant administration', line: 'Enforcement applied consistently and on record, which is what makes it defensible.' },
      { label: 'Developer transition', line: 'Support for boards taking over from a developer while the community is still being built.' },
    ],
  },

  // THE SMALL CREDENTIAL BLOCK. Deliberately short and factual, per the client's
  // hard constraint. Facts only, no adjectives, no case studies, no claims.
  credentials: {
    heading: 'Prepared by',
    lines: [
      'Justus Kidd, licensed Kansas real estate agent, licence 251163, brokered by Real Broker, LLC.',
      'Cornerstone Management LLC, Wichita. Seven associations and more than 500 doors under management.',
    ],
  },

  // THE ASK. Stated once, at the bottom, without pressure.
  ask: {
    id: 'review',
    heading: 'If your board does want an outside read',
    body:
      'We will prepare a written review of how your association is currently being managed. It goes to your board, not to us, and if your current manager is doing a decent job the review will say so.',
    formKey: 'hoaReview',
    // NEEDS VERIFICATION: hoa_notes came back "NA, client will provide soon".
    // What the board receives, how long it takes, and whether it costs anything
    // are all unknown. The value stack in forms.js carries explicit tokens.
  },

  // Social proof adjacent to the ask, not quarantined. Chosen for HOA relevance.
  proofTestimonialId: 'amanda-ryan',
};

export default hoa;
