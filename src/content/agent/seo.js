/**
 * Per-route metadata. Build Standard §12: unique title and description on every
 * route, never one global title. Copy lives in content, not in components.
 * Descriptions are written for a human reading a search result, not stuffed.
 */
export const seo = {
  '/': {
    title: 'Justus Kidd, Wichita real estate agent who also manages 500 doors',
    description:
      'Licensed Kansas agent in Wichita. Thousands of showings, and a management company running more than 500 doors, so you find out what a house costs to own. Free home valuation.',
  },
  '/buy': {
    title: 'Buying a home in Wichita | Agent Kidd',
    description:
      'What the process really costs, what an inspection finding is worth walking away over, and what a new build warranty covers. Free buyer guide, no agent contact required.',
  },
  '/sell': {
    title: 'Free home valuation in Wichita | Agent Kidd',
    description:
      'A number with the comparable sales attached, written by hand rather than generated. If it is a bad time to sell, the valuation will say so.',
  },
  '/investors': {
    title: 'Investment property analysis in Wichita | Agent Kidd',
    description:
      'Send an address and get back what it rents for, what it costs to hold, and what it looks like after management. Operating figures from a real 500-door portfolio.',
  },
  '/about': {
    title: 'About Justus Kidd, REALTOR® in Wichita, Kansas',
    description:
      'Licensed Kansas agent with Real Broker, LLC. Founded Cornerstone Management four years ago. Economics and finance, Wichita State. Elite Certified Agent, 25 Under 25.',
  },
  '/reviews': {
    title: 'Reviews for Justus Kidd | Agent Kidd',
    description:
      'What buyers, sellers and property owners in Wichita have written about working with Justus Kidd, quoted as they wrote it.',
  },
  '/contact': {
    title: 'Contact Justus Kidd | Agent Kidd, Wichita',
    description:
      'Call or text (316) 390-2120, or send a message. All three reach Justus rather than a call centre.',
  },
};
export default seo;
