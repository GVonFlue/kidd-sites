/**
 * Agent Kidd — interior page copy.
 * The psychological principle driving each primary CTA is named on every page.
 */

export const buy = {
  principle: 'Commitment ladder. The guide is a low friction micro conversion offered before any ask to talk.',
  hero: {
    eyebrow: 'Buying',
    heading: 'Know what the house costs to own before you fall in love with it.',
    body:
      'Plenty of agents can open a door. What is harder to find is someone who can tell you what the roof has left in it, what the taxes do after the sale, and what that new build warranty actually covers once the builder stops answering.',
    primaryCta: { label: 'Send me the buyer guide', href: '#guide' },
    secondaryCta: { label: 'Call or text Justus', href: 'tel:+13163902120' },
  },
  process: {
    heading: 'How it goes',
    // Anxiety reduction. A genuine sequence, so numbering it is honest.
    steps: [
      { label: 'We talk first', line: 'Fifteen minutes on what you want and what you can spend. No obligation to keep going.' },
      { label: 'Financing', line: 'If you do not have a lender, Justus will point you at two or three and let you pick.' },
      { label: 'Looking', line: 'He has run thousands of showings. He will tell you what is wrong with a house while you are standing in it.' },
      { label: 'Offer', line: 'What to offer and why, including what to ask for beyond price.' },
      { label: 'Inspection', line: 'Which findings are worth renegotiating over and which are normal for the age of the house.' },
      { label: 'Closing', line: 'What you sign, what you pay, and what to check before you do.' },
    ],
  },
  // ak_services includes "New construction" and "Commercial". Both were checked
  // on the form and neither appeared anywhere on the site until now. A checked
  // service with no representation is a service the client sells and the site
  // does not.
  alsoCovers: {
    heading: 'Two things worth saying out loud',
    items: [
      {
        label: 'New construction',
        line: 'He works new builds, which is a different job from resale. Different contract, different inspection timing, and a warranty that is worth reading before you sign rather than after.',
      },
      {
        label: 'Commercial',
        line: 'He represents commercial buyers and tenants as well. If you are looking for space rather than a house, that is the same phone number.',
      },
    ],
  },
  guide: { id: 'guide', formKey: 'buyerGuide' },
  proofTestimonialId: 'gavin',
  closing: {
    heading: 'Ready to talk, or nowhere near ready?',
    body: 'Both are fine. The guide is there for one, the phone is there for the other.',
    // The phone is primary here, NOT the guide. The guide's own form sits a
    // screen above this block, so a second brass button pointing back at it put
    // the same offer on screen twice and gave the visitor a choice between a
    // thing and itself.
    primaryCta: { label: 'Call or text (316) 390-2120', href: 'tel:+13163902120' },
    secondaryCta: { label: 'Send me the buyer guide', href: '#guide' },
  },
};

export const sell = {
  principle: 'Reciprocity. The valuation is a real give, done by hand, delivered before anything is asked in return.',
  hero: {
    eyebrow: 'Selling',
    heading: 'Start with what it is worth, not with a listing agreement.',
    body:
      'Justus writes these himself instead of sending you an automated estimate, and attaches the comparable sales so you can check the reasoning. If the number says wait, he will tell you to wait.',
    primaryCta: { label: 'Get a free home valuation', href: '#valuation' },
    secondaryCta: { label: 'Call or text Justus', href: 'tel:+13163902120' },
  },
  what: {
    heading: 'What you get back',
    body:
      'Not a range generated from public records. A number with the working shown.',
  },
  valuation: { id: 'valuation', formKey: 'valuation' },
  proofTestimonialId: 'vance-burns',
  closing: {
    heading: 'One number, no commitment.',
    body: 'You are asking for a valuation. You are not agreeing to list with anybody.',
    primaryCta: { label: 'Get a free home valuation', href: '#valuation' },
    secondaryCta: { label: 'Call or text (316) 390-2120', href: 'tel:+13163902120' },
  },
};

export const investors = {
  principle:
    'Authority through specificity. The credibility here is a real portfolio, so the give is the operating arithmetic that comes with running one.',
  hero: {
    eyebrow: 'Investors',
    heading: 'The operating numbers come from a real portfolio, not a rule of thumb.',
    body:
      'Send an address. You get back what it is likely to rent for, what it costs to hold, and what it looks like after management. Justus manages more than 500 doors in this city, so the line items are the ones he actually pays.',
    primaryCta: { label: 'Run the numbers on a property', href: '#analysis' },
    secondaryCta: { label: 'Call or text Justus', href: 'tel:+13163902120' },
  },
  edge: {
    heading: 'Why this is different from a spreadsheet',
    body: [
      'Most investment analysis you will be shown uses a percentage for maintenance and a percentage for vacancy, and both are guesses. Cornerstone manages 500 doors across Wichita, most renting between five hundred and nine hundred dollars a month, so those figures come out of a portfolio rather than out of the air.',
      'Justus studied economics and finance with a mathematics minor, and the buy side arithmetic is the part of this business he actually enjoys. If a deal does not work he will say so rather than talk you into it.',
    ],
  },
  analysis: { id: 'analysis', formKey: 'investorAnalysis' },
  crossBrand: {
    heading: 'And if you buy it, the same company can run it',
    body:
      'Cornerstone Management handles single family and multifamily across the Wichita metro. Buying and managing under one roof means the person who underwrote the deal is the person who has to live with the numbers.',
    cta: { label: 'See how management works', href: 'https://cornerstonemgmt.co' },
  },
  proofTestimonialId: 'julie-ryan',
  closing: {
    heading: 'Send an address.',
    body: 'You will get the real numbers back, including the ones that make a deal look worse.',
    primaryCta: { label: 'Run the numbers on a property', href: '#analysis' },
    secondaryCta: { label: 'Call or text (316) 390-2120', href: 'tel:+13163902120' },
  },
};

export const about = {
  principle: 'Trust is a person, not a brand. The ask is deliberately soft here.',
  hero: {
    eyebrow: 'About',
    heading: 'Justus Kidd',
    body:
      'Licensed Kansas agent, brokered by Real Broker, LLC. He founded Cornerstone Management four years ago and it now looks after more than 500 doors and seven homeowner associations across the Wichita metro.',
    // The same cutout as the home hero, at the LARGE size. On every other page
    // the photograph is the second element and the headline is the first; on the
    // page that is entirely about him, they are co-equal. `size: 'lg'` is what
    // widens the figure, narrows the text column to make room, and gives the
    // section a floor tall enough to contain him — see Hero.jsx.
    image: {
      cutout: '/agent/justus-cutout.png',
      avatar: '/agent/justus-avatar.png',
      alt: 'Justus Kidd',
      size: 'lg',
    },
  },
  story: {
    heading: 'The short version',
    body: [
      'Justus studied economics and finance with a real estate focus and a mathematics minor at Wichita State. He started managing property, kept managing property, and the licence followed because the two halves of the job kept running into each other.',
      'The result is an agent who has seen what happens to houses after closing. He has run thousands of showings, and he has also handled the turnover, the maintenance calls at nine at night, and the conversations nobody enjoys having. That is a different education from a listing course.',
      'The part of the work he is best at, by his own account, is the arithmetic on the buy side and calming down a situation that has got heated. Those turn out to be the two things this job mostly consists of.',
    ],
  },
  credentials: {
    heading: 'On paper',
    items: [
      'Kansas real estate licence 251163, brokered by Real Broker, LLC',
      'REALTOR®, member of the National Association of REALTORS®',
      'Elite Certified Agent',
      'Wichita State University 25 Under 25, 2024',
      'Economics and finance with a real estate focus, mathematics minor, Wichita State University',
    ],
  },
  // Slot for the videographer piece recommended in discovery. Nothing scheduled.
  video: { src: null, poster: null, caption: null },
  proofTestimonialId: 'metzger',
  closing: {
    heading: 'Easiest first step is a conversation.',
    body: 'No script, no presentation, and you will not get added to anything.',
    primaryCta: { label: 'Call or text (316) 390-2120', href: 'tel:+13163902120' },
    secondaryCta: { label: 'Get a free home valuation', href: '/sell#valuation' },
  },
};

export const reviews = {
  principle: 'Social proof adjacency. Every testimonial on this page has an ask sitting next to it.',
  hero: {
    eyebrow: 'Reviews',
    heading: 'What people have actually written.',
    body:
      'These are the Google reviews as they were written, not edited into pull quotes.',
  },
  closing: {
    heading: 'Want to talk to him?',
    body: 'Call or text. The number reaches Justus, not a call centre.',
    primaryCta: { label: 'Call or text (316) 390-2120', href: 'tel:+13163902120' },
    secondaryCta: { label: 'Get a free home valuation', href: '/sell#valuation' },
  },
};

export const contact = {
  principle: 'Remove friction entirely. This page exists for the person who wants a human right now.',
  hero: {
    eyebrow: 'Contact',
    heading: 'Call, text, or send a message.',
    body: 'All three reach Justus. The phone is usually faster.',
  },
  formKey: 'contactAgent',
  closing: {
    heading: 'Or skip the form.',
    body: 'The number reaches Justus, not a call centre. Texting is usually faster than emailing.',
    primaryCta: { label: 'Call or text (316) 390-2120', href: 'tel:+13163902120' },
    secondaryCta: { label: 'Get a free home valuation', href: '/sell#valuation' },
  },
};

export default { buy, sell, investors, about, reviews, contact };
