/**
 * Cornerstone — interior page copy.
 * The psychological principle driving each primary CTA is named on every page.
 * HOA lives in its own file because it carries a hard tonal constraint.
 */

export const propertyManagement = {
  principle:
    'Loss aversion, with reciprocity as the door. A vacant month is a real number on a real door, and the rent analysis is what lets an owner check it against their own property.',
  hero: {
    eyebrow: 'For owners',
    heading: 'Find out what your property should be renting for.',
    body:
      'Free, written by hand, and there is nothing to sign. You get what comparable units nearby are leasing for, what yours would likely get as it stands, and what management would cost you.',
    primaryCta: { label: 'Get a free rent analysis', href: '#analysis' },
    secondaryCta: { label: 'Call (316) 390-1009', href: 'tel:+13163901009' },
  },
  cost: {
    heading: 'The arithmetic worth doing first',
    body:
      'Most of what we manage rents between five hundred and nine hundred dollars a month. One empty month on a seven hundred dollar door is seven hundred dollars that never comes back, and a placement that does not work out costs considerably more once you count the turn, the re-marketing and the days empty in between. That is the number worth putting against a management fee, rather than the fee on its own.',
  },
  included: {
    heading: 'What is included',
    body: 'All of it, in the monthly figure. Not itemised back to you afterwards.',
    items: [
      { label: 'Marketing and leasing', line: 'Listed and syndicated to the major rental portals.' },
      { label: 'Resident screening', line: 'Credit, income verification and rental payment history, applied the same way to every applicant.' },
      { label: 'Rent collection', line: 'Electronic payment, deposited directly to your account.' },
      { label: 'Maintenance coordination', line: 'Work orders raised, dispatched to the trade and tracked to completion.' },
      { label: 'Owner reporting', line: 'Statements in your portal whenever you want them.' },
      { label: 'Renewals and turnover', line: 'Handled without you having to prompt it.' },
    ],
  },
  // cs_services includes "Tenant placement only", which is a different product
  // from full management and had no representation on the site.
  placementOnly: {
    heading: 'If you would rather manage it yourself',
    body:
      'Placement only is a real option here. We market the property, screen applicants against the same criteria, and hand you a signed lease and a resident. After that it is yours to run. It suits owners with one or two doors who want the hard part done properly and are happy to take the phone calls themselves.',
  },
  subsidized: {
    heading: 'Subsidized housing programmes',
    // Describes the WORK, never the residents. Fair housing.
    body:
      'We administer Section 8, HOPE VI, RAD and LIHTC compliance. This is detailed, deadline driven work with its own inspection and reporting requirements, and it is the reason a number of owners came to us in the first place. If your property participates in one of these programmes, or you are considering it, that is a conversation worth having with someone who already does it.',
  },
  analysis: { id: 'analysis', formKey: 'rentAnalysis' },
  guide: { formKey: 'ownerGuide' },
  proofTestimonialId: 'julie-ryan',
  closing: {
    heading: 'Start with the number.',
    body: 'Send an address. There is no obligation attached to finding out.',
    primaryCta: { label: 'Get a free rent analysis', href: '#analysis' },
    secondaryCta: { label: 'Call (316) 390-2120', href: 'tel:+13163902120' },
  },
};

export const commercial = {
  principle: 'Cognitive fluency. A commercial tenant is comparing options, so state the space and the terms plainly and get out of the way.',
  hero: {
    eyebrow: 'Commercial',
    heading: 'Office and commercial space in the Wichita metro.',
    body:
      'Tell us roughly how much space you need and when you would want it, and we will tell you whether we have something that fits. If we do not, we will say so rather than showing you space that does not work.',
    primaryCta: { label: 'Send my space requirements', href: '#inquiry' },
    secondaryCta: { label: 'Call (316) 390-2120', href: 'tel:+13163902120' },
  },
  // NEEDS VERIFICATION: the discovery call says Justus holds commercial office
  // space that is currently vacant and actively costing him. The onboarding form
  // left commercial_space blank. Location, square footage, type, and asking rent
  // are all unknown, so this page cannot yet name the actual space.
  available: {
    heading: 'Currently available',
    body: '[NEEDS VERIFICATION: address, square footage, type of space, asking rent, availability date]',
    items: [],
  },
  inquiry: { id: 'inquiry', formKey: 'commercialInquiry' },
  closing: {
    heading: 'Tell us what you need.',
    body: 'A rough square footage and a date is enough to start.',
    primaryCta: { label: 'Send my space requirements', href: '#inquiry' },
    secondaryCta: { label: 'Call (316) 390-2120', href: 'tel:+13163902120' },
  },
};

export const owners = {
  principle: 'Two audiences, two jobs. Existing owners need their portal in one tap; prospective owners need the give.',
  hero: {
    eyebrow: 'Owners',
    heading: 'Your statements, your properties, your portal.',
    body: 'If you already own with us, everything is in the owner portal. If you are considering it, start with the rent analysis.',
    primaryCta: { label: 'Owner portal', href: null }, // NEEDS: AppFolio owner portal URL
    secondaryCta: { label: 'Get a free rent analysis', href: '/property-management#analysis' },
  },
  portalHelp: {
    heading: 'What is in the portal',
    items: [
      'Statements, available whenever you want them rather than once a quarter',
      'Work orders raised on your properties and where each one has got to',
      'Lease documents and renewal dates',
      'Payments made to you, with dates',
    ],
  },
  proofTestimonialId: 'metzger',
  closing: {
    heading: 'Not with us yet?',
    body: 'Find out what your property should be renting for. It is free and there is nothing to sign.',
    primaryCta: { label: 'Get a free rent analysis', href: '/property-management#analysis' },
    secondaryCta: { label: 'Call (316) 390-2120', href: 'tel:+13163902120' },
  },
};

export const availability = {
  principle: 'Remove friction. A resident or applicant wants a listing or a person, and neither should take more than one tap.',
  hero: {
    eyebrow: 'Rentals',
    heading: 'Available rentals across the Wichita metro.',
    body:
      'Single family homes and apartments. Applications are handled through our resident system, so the apply button will take you there.',
    primaryCta: { label: 'See available rentals', href: null }, // NEEDS: AppFolio listing URL
    secondaryCta: { label: 'Call leasing (316) 390-1009', href: 'tel:+13163901009' },
  },
  // Screening criteria stated factually and applied to every applicant equally.
  // Never phrased as a description of who is wanted. Fair housing.
  screening: {
    heading: 'What we look at on an application',
    body: 'The same three things for everybody who applies.',
    items: [
      'Credit history',
      'Income verification',
      'Rental payment history',
    ],
    note:
      'We do business in accordance with the Fair Housing Act. If you need a reasonable accommodation at any point in the application process, tell us and we will arrange it.',
  },
  residents: {
    heading: 'Already renting from us',
    items: [
      { label: 'Pay rent', line: 'Bank transfer, card, or cash at a participating retailer.', href: null },
      { label: 'Report maintenance', line: 'The chat on this page can log it and send it to the trade without waiting for anyone to read an email.', href: null },
      { label: 'Emergencies', line: 'Gas, fire, flooding or anything dangerous: call 911 first, then (316) 390-1009.', href: 'tel:+13163901009' },
    ],
  },
  closing: {
    heading: 'Questions before you apply?',
    body: 'Leasing will answer them. So will the chat, and it does not put you on hold.',
    primaryCta: { label: 'Call leasing (316) 390-1009', href: 'tel:+13163901009' },
    secondaryCta: { label: 'See available rentals', href: null },
  },
};

export const about = {
  principle: 'Authority through specificity. The numbers do the arguing.',
  hero: {
    eyebrow: 'About',
    heading: 'A small company running five hundred doors.',
    body:
      'Cornerstone Management is based in Wichita and serves the metro and south central Kansas. It was founded by Justus Kidd four years ago and he still runs it.',
  },
  story: {
    heading: 'What that actually means',
    body: [
      'Five hundred doors, seven homeowner associations of between 66 and 250 units, more than a thousand residents, and two apartment buildings. Several of the associations are in communities still being built out, which brings its own problems: first boards inherit reserve studies and vendor arrangements they had no hand in setting up.',
      'We also administer Section 8, HOPE VI, RAD and LIHTC compliance. It is deadline driven work with its own inspection regime and most managers in this market do not take it on.',
      'Cornerstone is run by a licensed Kansas agent, which is less common than it sounds and it matters in practice. When an owner decides to sell, or a resident is ready to buy, that does not have to become somebody else’s transaction handled by somebody who has never seen the property.',
    ],
  },
  serviceArea: {
    heading: 'Where we work',
    body:
      'The Wichita metro is the core of it, and we work across south central Kansas. We do take on properties elsewhere in the state, though a new area has to reach a certain size before it makes sense for either of us.',
    // NEEDS VERIFICATION: service_area said "new locations require a minimum" —
    // a minimum of what? Doors, revenue, distance? Sentence above is deliberately
    // vague because the specific is unknown. Replace it with the real threshold.
  },
  proofTestimonialId: 'amanda-ryan',
  closing: {
    heading: 'Start with the number.',
    body: 'A rent analysis is free and it commits you to nothing.',
    primaryCta: { label: 'Get a free rent analysis', href: '/property-management#analysis' },
    secondaryCta: { label: 'Call (316) 390-2120', href: 'tel:+13163902120' },
  },
};

export const contact = {
  principle: 'Remove friction, and route correctly. Two lines exist for a reason.',
  hero: {
    eyebrow: 'Contact',
    heading: 'Two numbers, so you reach the right person first time.',
    body:
      'Leasing, applications and maintenance: (316) 390-1009. Ownership, associations and commercial: (316) 390-2120.',
  },
  formKey: 'contactCornerstone',
  closing: {
    heading: 'Or start with the number.',
    body: 'A rent analysis is free, written by hand, and commits you to nothing.',
    primaryCta: { label: 'Get a free rent analysis', href: '/property-management#analysis' },
    secondaryCta: { label: 'Call leasing (316) 390-1009', href: 'tel:+13163901009' },
  },
};

export default { propertyManagement, commercial, owners, availability, about, contact };
