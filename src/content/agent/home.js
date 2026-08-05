/**
 * Agent Kidd — homepage copy.
 *
 * FIVE-SECOND TEST, answered as a visitor on a phone would:
 *   What does this business do?  Residential real estate in Wichita. He represents
 *                               buyers and sellers, and he analyses investments.
 *   Who is it for?               People buying, selling or investing in Kansas.
 *   What do I do next?           Get a free valuation, or call and text him.
 *
 * PRIMARY CTA PRINCIPLE: Reciprocity. The valuation is a genuine give, delivered
 * by hand. This is also what lets a client who dislikes self-promotion convert
 * without pitching, which the discovery call named as a real constraint.
 *
 * TRANSACTION COUNT IS DELIBERATELY ABSENT. Client decision, 2026-07-27.
 * The live Lofty site claims "decades of experience"; that is false at four years
 * in business and it does not appear anywhere here.
 */

export const home = {
  hero: {
    eyebrow: 'Wichita, Kansas',
    // Headline makes a claim, does not describe a category.
    heading: 'Most agents sell houses. I also manage five hundred of them.',
    // One phrase of the headline lifted into brass. The substring must appear
    // verbatim in `heading` above — reword one and reword the other.
    accent: 'five hundred of them',
    body:
      'I am Justus Kidd. I have run thousands of showings across Wichita, and my management company looks after more than 500 doors in the same city. So when we walk a property together I can tell you what it costs to own it, not just what it costs to buy it.',
    primaryCta: { label: 'Get a free home valuation', href: '/sell#valuation' },
    secondaryCta: { label: 'Call or text Justus', href: 'tel:+13163902120' },
    // Photograph of Justus. No stock imagery anywhere on this build.
    //
    // `cutout` is the background-free PNG and drives the desktop hero: he stands
    // directly on the parcel grid and passes behind the section below on scroll.
    // Transparency is why it must stay a PNG and cannot be re-encoded as JPEG.
    //
    // `avatar` is a head-and-shoulders crop of THE SAME cutout, used at phone
    // and tablet widths where a full-height figure would collide with the
    // buttons. Cut from the same file on purpose: the earlier square was a
    // different photograph, so a phone and a laptop showed two different
    // pictures of the same man on the same page.
    image: {
      cutout: '/agent/justus-cutout.png',
      avatar: '/agent/justus-avatar.png',
      alt: 'Justus Kidd',
    },
  },

  // Numbers, set in tabular figures. Authority through specificity.
  proof: {
    heading: 'The short version',
    stats: [
      { figure: '500+', label: 'doors under management' },
      { figure: '1,000+', label: 'residents in homes and associations we manage' },
      { figure: '7', label: 'homeowner associations' },
      { figure: '4', label: 'years running the business' },
    ],
    credentials: [
      'Licensed in Kansas, brokered by Real Broker, LLC',
      'Elite Certified Agent',
      'Wichita State University 25 Under 25, 2024',
      'Economics and finance, with a mathematics minor',
    ],
  },

  // Serhant axis: reduce the visitor's first job to one choice from a small set.
  lanes: {
    heading: 'What brings you here?',
    items: [
      {
        label: 'I am buying',
        line: 'First home, next home, or a new build you want someone to read the warranty on.',
        href: '/buy',
      },
      {
        label: 'I am selling',
        line: 'Start with what it is worth. The valuation is free and he writes it himself.',
        href: '/sell',
      },
      {
        label: 'I am investing',
        line: 'Send an address and get the real operating numbers back, from a portfolio not a spreadsheet template.',
        href: '/investors',
      },
    ],
  },

  // The differentiator, stated plainly rather than boasted about.
  differentiator: {
    heading: 'Why the management side matters to you',
    body: [
      'Running 500 doors means I see what happens to a house after the sale. I know which roofs in this city are at the end of their life, what a turnover really costs, and which builders answer the phone two years later.',
      'That is not a sales pitch, it is just the arithmetic I do every day for other people. On the buying side it means I can tell you what a property costs to hold. On the selling side it means I know what buyers in Wichita are actually walking away from.',
    ],
  },

  crossBrand: {
    eyebrow: 'The other half of the business',
    heading: 'He does not stop at the sale. Cornerstone Management.',
    body:
      'If you own property you would rather not manage yourself, that is the same company, the same person, and the same phone. Single family homes, apartment buildings, and seven homeowner associations across the Wichita metro, including the subsidised programmes most managers in this market decline.',
    // The same figures the Cornerstone site leads with. Evidence, not a claim.
    stats: [
      { figure: '500+', label: 'doors under management' },
      { figure: '7', label: 'homeowner associations' },
      { figure: '1,000+', label: 'residents' },
    ],
    cta: { label: 'See how management works', href: 'https://cornerstonemgmt.co' },
    secondaryCta: { label: 'Available rentals', href: 'https://cornerstonemgmt.co/availability' },
  },

  closing: {
    heading: 'Start with a number, not a commitment.',
    body:
      'The valuation costs nothing and comes with the comparable sales attached so you can check the work. If it says now is a bad time to sell, that is what it will say.',
    primaryCta: { label: 'Get a free home valuation', href: '/sell#valuation' },
    secondaryCta: { label: 'Call or text (316) 390-2120', href: 'tel:+13163902120' },
  },
};

export default home;
