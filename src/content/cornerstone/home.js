/**
 * Cornerstone Management — homepage copy.
 *
 * FIVE-SECOND TEST, answered as a visitor on a phone would:
 *   What does this business do?  Manages rental property and homeowner
 *                               associations in the Wichita metro.
 *   Who is it for?               Owners, investors, HOA boards, and the residents
 *                               who already live in what they manage.
 *   What do I do next?           Get a free rent analysis, or call leasing.
 *
 * PRIMARY CTA PRINCIPLE: Reciprocity, with loss aversion underneath it. The rent
 * analysis is a genuine give; the arithmetic of a vacant month is what makes an
 * owner act on it.
 *
 * STRUCTURAL DECISION, from committed scope and confirmed 2026-07-27:
 * this page leads with information and story, NOT the rental search bar. Owners
 * and boards are the business. Residents are served immediately, one tap away,
 * in the lane band and in the nav.
 */

export const home = {
  hero: {
    eyebrow: 'Wichita and south central Kansas',
    // A photograph of Wichita, behind the hero. Client-supplied only: there is
    // no stock fallback anywhere on this build, and a city skyline pulled off a
    // search result is a licensing problem, not a design choice.
    //
    // Drop the file at public/cornerstone/wichita.jpg and uncomment. The scrim
    // in Hero.jsx is built to hold AA contrast over any image, so no other
    // change is needed.
    // backdrop: { src: '/cornerstone/wichita.jpg', position: 'center 40%' },
    heading:
      'We manage five hundred doors in Wichita, including the programs most companies will not take on.',
    body:
      'Cornerstone Management looks after single family homes, apartment buildings, and seven homeowner associations across the metro. That includes Section 8, HOPE VI, RAD and LIHTC compliance, which is detailed work most managers in this market decline.',
    primaryCta: { label: 'Get a free rent analysis', href: '/property-management#analysis' },
    secondaryCta: { label: 'Call leasing', href: 'tel:+13163901009' },
    image: { src: null, alt: null }, // NEEDS: photography of properties actually managed
  },

  proof: {
    heading: 'What we actually run',
    stats: [
      { figure: '500+', label: 'doors under management' },
      { figure: '170+', label: 'single family homes' },
      { figure: '7', label: 'homeowner associations, 66 to 250 units each' },
      { figure: '1,000+', label: 'residents' },
    ],
  },

  // The pick-your-door band. Four audiences, four parcels, one line each.
  // Owners first. Residents third, not absent.
  lanes: {
    heading: 'Who are you?',
    items: [
      {
        label: 'I own property',
        line: 'Find out what it should be renting for, and what management would cost.',
        href: '/property-management',
      },
      {
        label: 'I am on an HOA board',
        line: 'Start with the questions to ask your current manager. No contact required.',
        href: '/hoa',
      },
      {
        label: 'I rent from you',
        line: 'Pay rent, report maintenance, or reach a person.',
        href: '/availability',
      },
      {
        label: 'I am looking at an investment',
        line: 'Send an address and get the real operating numbers back.',
        href: 'https://agentkidd.com/investors',
      },
    ],
  },

  services: {
    heading: 'What management covers',
    body:
      'Everything below is included rather than priced separately, so the monthly figure you are quoted is the figure you pay.',
    items: [
      { label: 'Marketing and leasing', line: 'Listed on our site and syndicated to the major rental portals.' },
      { label: 'Resident screening', line: 'Credit, income verification, and rental payment history, applied consistently to every applicant.' },
      { label: 'Rent collection', line: 'Electronic payment by bank transfer or card, deposited directly to you.' },
      { label: 'Maintenance coordination', line: 'Work orders raised, dispatched to the trade, and tracked to completion.' },
      { label: 'Owner reporting', line: 'Statements available in your portal whenever you want them, not once a quarter.' },
      { label: 'Association management', line: 'Budgeting, reserves, vendor contracts, and meeting support for boards.' },
      { label: 'Commercial leasing', line: 'Office and commercial space across the metro.' },
      { label: 'Subsidized housing compliance', line: 'Section 8, HOPE VI, RAD and LIHTC programs administered end to end.' },
    ],
  },

  // Loss aversion, stated as arithmetic rather than as fear.
  cost: {
    heading: 'What an empty month costs',
    body:
      'Most of what we manage rents between five hundred and nine hundred dollars. A single vacant month on a seven hundred dollar door is seven hundred dollars you do not get back, and a bad placement costs considerably more than that once you count the turn. Marketing, screening and turnaround are where management pays for itself, and it is worth doing the arithmetic on your own property before you decide.',
    cta: { label: 'Get a free rent analysis', href: '/property-management#analysis' },
  },

  // Committed scope: the agent block, with his face and his story.
  crossBrand: {
    eyebrow: 'The same person, the other half of the business',
    heading: 'Justus Kidd, licensed agent',
    body:
      'Cornerstone is run by a licensed Kansas agent, which is unusual and it matters. When an owner decides to sell, when a board member is moving, or when a resident is ready to buy their first home, that does not have to become somebody else’s transaction handled by somebody who does not know the property.',
    // The same studio cutout the Agent Kidd hero uses. One photograph of him
    // across both brands: a visitor who crosses from one site to the other
    // should recognise the same person, not meet him twice.
    image: { cutout: '/cornerstone/justus-cutout.png', alt: 'Justus Kidd' },
    cta: { label: 'Meet Justus', href: 'https://agentkidd.com/about' },
  },

  closing: {
    heading: 'Start with the number.',
    body:
      'Send an address and find out what your property should be renting for. It is free, it is written by hand rather than generated, and there is nothing to sign.',
    primaryCta: { label: 'Get a free rent analysis', href: '/property-management#analysis' },
    secondaryCta: { label: 'Call leasing (316) 390-1009', href: 'tel:+13163901009' },
  },
};

export default home;
