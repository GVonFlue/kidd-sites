/**
 * Every conversion surface's copy: field labels, helper text, button text,
 * success states, error states.
 *
 * Rules applied here (Build Standard §7, Build Order copy section):
 *  - Every input has a real label. Placeholder text is never a label.
 *  - Buttons state the outcome, not the mechanism. Never "Submit".
 *  - Optional fields are marked optional AND say why they are wanted.
 *  - Expectations are set at the point of submission: what arrives, how fast,
 *    from whom. No timeframe is claimed that the client did not supply, so the
 *    promises here are about WHAT arrives, never HOW FAST.
 *  - Errors explain what to fix. Success states say what happens next.
 */

export const fieldLabels = {
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  phoneOptional: 'Phone (optional, so Justus can text you back instead of calling)',
  address: 'Property address',
  addressHelp: 'Street and city is enough. It does not have to be exact.',
  units: 'How many units',
  message: 'Anything you want him to know first',
  messageHelp: 'Optional. A sentence is plenty.',
  associationName: 'Association name',
  unitCount: 'How many units in the association',
  role: 'Your role',
  squareFeet: 'Roughly how much space you need',
  moveIn: 'When you would want to move in',
};

export const errors = {
  nameRequired: 'Add your name so he knows who he is replying to.',
  emailRequired: 'Add an email address so the report has somewhere to go.',
  emailInvalid: 'That email address is missing something. Check for a typo.',
  phoneInvalid: 'That does not look like a full phone number. Ten digits.',
  addressRequired: 'Add the property address. Street and city is enough.',
  generic:
    'Something went wrong on our end, not yours. Call or text (316) 390-2120 and it will get handled.',
};

/**
 * One entry per lead-capture surface.
 * `source` is the human-readable form identifier sent to /api/lead. It is how
 * the client sees which page actually produces business, so it is distinct per
 * brand and per form (Build Standard §8).
 */
export const forms = {
  valuation: {
    brand: 'agent',
    source: 'Agent Kidd - Home Valuation',
    eyebrow: 'Free, no obligation',
    heading: 'What is your home actually worth right now?',
    body:
      'Justus will pull the comparable sales on your street, look at what is currently listed against you, and send you a number with the reasoning attached. If the answer is that now is a bad time to sell, he will tell you that.',
    valueStack: [
      'Recent comparable sales within your immediate area',
      'What is currently on the market competing with your home',
      'The price range he would list it in, and why',
      'What he would fix first, and what he would leave alone',
    ],
    fields: ['name', 'email', 'phoneOptional', 'address', 'message'],
    button: 'Send me my home value',
    consent:
      'By sending this you are asking for one valuation. You are not signing up for a drip campaign.',
    success: {
      heading: 'Got it.',
      body:
        'Justus puts these together himself rather than sending you an automated estimate, so it arrives as a real email from him with the comparable sales attached. If you would rather just talk it through, call or text (316) 390-2120.',
    },
  },

  buyerGuide: {
    brand: 'agent',
    source: 'Agent Kidd - Buyer Guide',
    eyebrow: 'Free guide',
    heading: 'Buying in Wichita without getting talked into something',
    body:
      'The guide Justus wrote for people who are months out, not weeks. No agent contact required to read it.',
    valueStack: [
      'What the whole process costs, itemised, including the parts nobody mentions until closing',
      'How to read a seller disclosure and what the silences mean',
      'The inspection findings worth walking away over, and the ones that are normal',
      'What a new build warranty actually covers',
      'Questions to ask before you sign with any agent, including him',
    ],
    fields: ['name', 'email'],
    button: 'Send me the guide',
    consent: 'One email with the guide attached.',
    success: {
      heading: 'On its way.',
      body:
        'The guide is in your inbox. Read it, ignore it, forward it to a friend who is buying. When you want to talk, Justus is at (316) 390-2120.',
    },
  },

  investorAnalysis: {
    brand: 'agent',
    source: 'Agent Kidd - Investment Analysis',
    eyebrow: 'Free analysis',
    heading: 'Run the numbers on a property before you offer',
    body:
      'Send an address. Justus will model what it rents for, what it costs to hold, and what it looks like after management, because he manages 500 doors and knows what the line items really are.',
    valueStack: [
      'Realistic rent based on what comparable units in the area are actually leasing for',
      'Operating costs modelled from a real portfolio, not a rule of thumb',
      'What turnover and vacancy have historically looked like on that kind of property',
      'What it looks like managed, and what it looks like if you self manage',
    ],
    fields: ['name', 'email', 'phoneOptional', 'address', 'message'],
    button: 'Run the numbers on this one',
    consent: 'One analysis. He will tell you if the deal is bad.',
    success: {
      heading: 'Sending it over.',
      body:
        'Justus builds these by hand. If the numbers do not work he will say so plainly rather than talk you into it.',
    },
  },

  rentAnalysis: {
    brand: 'cornerstone',
    source: 'Cornerstone - Rent Analysis',
    eyebrow: 'Free, no obligation',
    heading: 'Find out what your property should be renting for',
    body:
      'Send the address. You get back what comparable units in the area are leasing for right now, what it would take to get there, and what management would cost you.',
    valueStack: [
      'What comparable units nearby are currently leasing for',
      'What your property would likely rent for as it stands today',
      'What we would change first to move that number',
      'A plain breakdown of what management costs and what it covers',
    ],
    fields: ['name', 'email', 'phoneOptional', 'address', 'units', 'message'],
    button: 'Send me my rent analysis',
    consent:
      'You are asking for one analysis. There is no obligation to sign anything.',
    success: {
      heading: 'Got it.',
      body:
        'We put these together by hand rather than running an automated estimate. If you would rather talk it through first, leasing is at (316) 390-1009.',
    },
  },

  ownerGuide: {
    brand: 'cornerstone',
    source: 'Cornerstone - Owner Guide',
    eyebrow: 'Free guide',
    heading: 'What a vacant month actually costs you',
    body:
      'Written for owners with somewhere between one and twenty doors who are deciding whether to keep self managing.',
    valueStack: [
      'The real arithmetic on a vacant month, turnover, and a bad placement',
      'What screening criteria are lawful to apply, and what is not',
      'Which maintenance calls need an owner decision and which do not',
      'What to look for in a management agreement before you sign it',
    ],
    fields: ['name', 'email'],
    button: 'Send me the guide',
    consent: 'One email with the guide attached.',
    success: {
      heading: 'On its way.',
      body: 'Check your inbox. No follow up sequence, no calls unless you ask.',
    },
  },

  hoaBoardGuide: {
    brand: 'cornerstone',
    source: 'Cornerstone - HOA Board Guide',
    eyebrow: 'Free, for boards',
    heading: 'Questions to ask your management company before you renew',
    body:
      'A one page document your board can forward and read in a meeting. It is written to be useful whether or not you ever speak to us.',
    valueStack: [
      'What your management agreement should say about reserves, and what to do if it does not',
      'Which financial reports a board is entitled to, and how often',
      'How to tell whether maintenance is being coordinated or just logged',
      'What a transition to a new manager involves, honestly, including the disruption',
    ],
    fields: ['name', 'email', 'associationName'],
    button: 'Send me the board guide',
    consent:
      'One email. Nothing else, and nobody will call your board about a contract.',
    success: {
      heading: 'On its way.',
      body:
        'Forward it to the rest of your board. It is written to be read by people who are volunteering their evenings.',
    },
  },

  hoaReview: {
    brand: 'cornerstone',
    source: 'Cornerstone - HOA Review Request',
    eyebrow: 'For boards considering a change',
    heading: 'Request an HOA review',
    body:
      'A written review of how your association is currently being managed, prepared for your board.',
    // NEEDS VERIFICATION: hoa_notes came back "NA, client will provide soon".
    // What the board receives, how long it takes, and whether it costs anything
    // are all unknown. These four lines are a STRUCTURE, not claims. They must be
    // replaced with the real deliverable before this page ships.
    valueStack: [
      '[NEEDS VERIFICATION: what document the board actually receives]',
      '[NEEDS VERIFICATION: what is examined - reserves, vendor contracts, financials?]',
      '[NEEDS VERIFICATION: how long it takes]',
      '[NEEDS VERIFICATION: whether there is any cost]',
    ],
    fields: ['name', 'email', 'phoneOptional', 'associationName', 'unitCount', 'role', 'message'],
    button: 'Request the review',
    consent:
      'A review request, not a proposal. Your board is not agreeing to anything by asking.',
    success: {
      heading: 'Received.',
      body:
        'Justus prepares these himself. If it turns out your current manager is doing a decent job, the review will say so.',
    },
  },

  commercialInquiry: {
    brand: 'cornerstone',
    source: 'Cornerstone - Commercial Leasing Inquiry',
    eyebrow: 'Commercial',
    heading: 'Tell us what you need and we will tell you what we have',
    body: 'Office and commercial space in the Wichita metro.',
    valueStack: [],
    fields: ['name', 'email', 'phone', 'squareFeet', 'moveIn', 'message'],
    button: 'Send my space requirements',
    consent: null,
    success: {
      heading: 'Received.',
      body:
        'If we do not have something that fits, we will say so rather than showing you space that does not work.',
    },
  },

  contactAgent: {
    brand: 'agent',
    source: 'Agent Kidd - Contact',
    eyebrow: null,
    heading: 'Talk to Justus',
    body: 'Call, text, or send this. All three reach the same person.',
    valueStack: [],
    fields: ['name', 'email', 'phoneOptional', 'message'],
    button: 'Send this to Justus',
    consent: null,
    success: {
      heading: 'Sent.',
      body: 'If it is urgent, call or text (316) 390-2120 rather than waiting on email.',
    },
  },

  contactCornerstone: {
    brand: 'cornerstone',
    source: 'Cornerstone - Contact',
    eyebrow: null,
    heading: 'Get in touch',
    body:
      'Leasing questions go to (316) 390-1009. Ownership, HOA and commercial go to (316) 390-2120. This form reaches both.',
    valueStack: [],
    fields: ['name', 'email', 'phoneOptional', 'message'],
    button: 'Send this',
    consent: null,
    success: {
      heading: 'Sent.',
      body:
        'If you are a resident with a maintenance issue, the chat on any page can log it and send it to the trade without waiting for anyone to read an email.',
    },
  },
};

export default forms;
