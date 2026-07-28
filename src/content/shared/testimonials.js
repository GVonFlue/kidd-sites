/**
 * Testimonials — VERBATIM, transcribed from the reviews Justus already publishes
 * on agentkidd.com. Not paraphrased, not tidied, not shortened except where a
 * `short` field is given for use in tight placements (and the full text is always
 * available on /reviews).
 *
 * PERMISSION: the onboarding form granted permission for "all three" — written
 * when three were believed to be visible. Six are in fact published on his own
 * site. Confirm the additional three before launch. Marcia Burns left a star
 * rating with no text, so there is nothing to quote.
 *
 * Never publish a testimonial without explicit permission. Never invent one.
 */

export const testimonials = [
  {
    id: 'metzger',
    name: 'Jonathan Metzger',
    context: 'Property owner and painting contractor',
    audience: ['owner', 'agent'],
    quote:
      'Justus Kidd is one of the hardest workers I’ve come across in the real estate industry. As a painting contractor I work with realtors quite regularly and he is extremely knowledgeable and seeks the betterment of his clients not just the quick sale to make commission. As a property manager, he has worked long and hard for getting a tenant in my house despite the distance of the property costing him time and gas money every time he has a showing and he has done it all with a great attitude and working well to educate me through the process. Can’t say enough good things about Justus either as a realtor or a property manager',
    short:
      'He is extremely knowledgeable and seeks the betterment of his clients not just the quick sale to make commission.',
  },
  {
    id: 'amanda-ryan',
    name: 'Amanda Ryan',
    context: 'HOA, rental properties, and home valuation',
    audience: ['hoa', 'owner', 'agent'],
    quote:
      'Justus had helped me with multiple real estate efforts (HOA, rental properties, and home valuation). He is responsive, hard-working and trustworthy. I highly recommend him!',
    short: 'He is responsive, hard-working and trustworthy.',
  },
  {
    id: 'julie-ryan',
    name: 'Julie Ryan',
    context: 'Property owner',
    audience: ['owner'],
    quote:
      'Justus has helped us manage our properties and supported us thru difficult tenant situations, such as eviction. He is honest, ethical and ambitious.',
    short: 'He is honest, ethical and ambitious.',
  },
  {
    id: 'gavin',
    name: 'Gavin',
    context: 'Buyer and seller',
    audience: ['agent', 'owner', 'hoa'],
    quote:
      'Extremely knowledgeable about real estate. And especially the Kansas market. He’s super hard working, answers any and all of my questions (even after hours at times), and is a great person. He’s got experience in HOA, property management, and buying/selling properties. Highly recommend using him for anything real estate related!',
    short:
      'He’s got experience in HOA, property management, and buying/selling properties.',
  },
  {
    id: 'vance-burns',
    name: 'Vance Burns',
    context: 'Time-sensitive transactions',
    audience: ['agent'],
    quote:
      'Justus is a smart dude with limitless energy and integrity! My wife and I are so thankful we reconnected with him to handle some real estate transactions that were time sensitive. Justus gets a ten star rating in my book!',
    short: 'A smart dude with limitless energy and integrity.',
  },
];

/** Pick the testimonial that fits the audience of the CTA it sits next to. */
export function forAudience(audience, exclude = []) {
  return testimonials.filter(
    (t) => t.audience.includes(audience) && !exclude.includes(t.id),
  );
}

export default testimonials;
