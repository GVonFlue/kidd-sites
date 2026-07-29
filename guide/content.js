/**
 * THE CONTENT. Kept separate from the layout script so the words can be argued
 * with without touching the document mechanics.
 *
 * WHAT IS VERIFIED AND WHAT IS NOT.
 * Everything said about Justus here comes from the client-confirmed config that
 * the website is built from: Kansas licence 251163, Real Broker LLC, four years
 * in business, thousands of showings, Cornerstone Management with more than 500
 * doors, seven homeowner associations and more than 1,000 residents.
 *
 * Nothing about his personal history is invented. He is not given a backstory,
 * a hometown story, a former trade or a military record, because none of that
 * was supplied. His differentiator is the one thing that is documented and that
 * no other agent in this market can say: he manages the houses after they sell.
 *
 * Every dollar figure and every price range is marked in VERIFY at the bottom of
 * this file and printed on the last page of the document. They are drafting
 * ballparks, not researched local figures, and they are not to be published
 * until Justus confirms them.
 *
 * FAIR HOUSING. The neighbourhood section deliberately does NOT do what most
 * buyer guides do. It does not rate schools, call anywhere safe, quiet, family
 * friendly, up and coming or good, and it does not describe who lives anywhere.
 * Those statements create liability for a licensed agent regardless of intent,
 * and they are the single most common way a well meant buyer guide becomes an
 * exhibit. School DISTRICT NAMES are facts and are included. School QUALITY is
 * an opinion about people and is not.
 */

const P = '(316) 390-2120';
const E = 'justus@agentkidd.com';

export const guide = {
  brand: 'AGENT KIDD',
  name: 'Justus Kidd',
  role: 'REALTOR® · REAL BROKER, LLC',
  licence: 'Kansas licence 251163',
  phone: P,
  email: E,
  city: 'Wichita, Kansas',
  edition: 'WICHITA EDITION · 2026',

  cover: {
    kicker: 'THE FIRST-TIME',
    title: 'Homebuyer',
    titleItalic: 'Resource Guide',
    sub: 'Everything I wish someone had handed me before my first closing.',
    corner: 'A FREE RESOURCE FOR WICHITA BUYERS',
  },

  letter: {
    eyebrow: 'BEFORE WE BEGIN',
    heading: 'Hey — read this first.',
    paras: [
      'If you are reading this, you are probably somewhere between "I think I want to buy a house" and "I have no idea where to start." That is a normal place to be. Almost everyone who has ever bought a home stood exactly where you are standing, googling things at eleven at night and feeling a little out of their depth.',
      'Here is the part nobody says out loud: buying your first home feels like a lot because it is a lot. It is likely the biggest cheque you have ever written, wrapped in paperwork written by people who get paid by the word, surrounded by advice from everyone who has ever owned a home and a few people who have not. The feeling is not a sign you are not ready. It is a sign you are paying attention.',
      'A little about how I do this. I sell houses, and I also manage them. My company, Cornerstone Management, looks after more than 500 doors and seven homeowner associations here in Wichita, with more than a thousand residents living in them. That means I do not stop thinking about a house on closing day. I am the one who gets the call three years later when the furnace quits in January, and I have read the repair invoice.',
      'That changes what I notice when we walk a property. Most agents can tell you what a house costs to buy. I can tell you what it costs to own, because I own that problem for hundreds of houses in this city every month.',
      'So I made this. Not a brochure. Not a sales pitch dressed up as value. An actual guide that walks you through the whole thing in plain English, with the local parts that only matter if you are buying here.',
      'My commitment is simple. I would rather you make a good decision than a fast one. Read it, mark it up, bring me your questions. Whether you buy next month or next year, whether you use me or not, you will walk away knowing how this actually works.',
      'Let us get into it.',
    ],
    sign: 'Justus',
  },

  contents: [
    ['01', 'Understanding the homebuying process', 'The nine steps, start to keys'],
    ['02', 'The real cost of buying a home', 'Every dollar, laid out'],
    ['03', 'Mortgages made simple', 'Loan types and the words that scare people'],
    ['04', 'Where you might look in Wichita', 'The factual version'],
    ['05', 'My home tour checklist', 'Print it. Bring it to showings.'],
    ['06', 'What owning it actually costs', 'The part I know better than most'],
    ['07', 'Things nobody tells first-time buyers', 'The stuff between the lines'],
    ['08', 'Local resources I trust', 'Your team, in one place'],
    ['09', 'Moving day survival guide', 'From boxes to first night'],
    ['—', 'Why work with me', 'How I actually do this'],
    ['★', 'Your next move', 'One conversation'],
  ],

  steps: [
    ['Get pre-approved',
     'Before you fall in love with anything, you talk to a lender. They look at your income, debts and credit, and tell you what you can actually borrow. A pre-approval letter is what makes a seller take you seriously.',
     'Touring homes before you have talked to a lender, then falling for a place you cannot finance.',
     'The number they approve you for is the ceiling, not the goal. Section 06 is the reason why.'],
    ['Build your search',
     'Now we get specific. Budget, must-haves, deal-breakers, and which parts of town actually fit your commute and your life. I set you up on the MLS feed so you are not refreshing a public app that is three days behind.',
     'Confusing wants with needs. A finished basement is a want. A twenty minute commute might be a need.',
     'Pick your top three areas early. It keeps the search focused and the disappointment low.'],
    ['Tour homes',
     'The fun part. We walk through houses in person, and I am the one looking at the water heater date sticker while you are picturing your couch.',
     'Touring ten houses in one day. They blur together and you start ignoring red flags.',
     'Use my checklist in Section 05. I built it out of the repairs I actually pay for across the properties I manage.'],
    ['Write an offer',
     'Found it? We put together an offer: price, closing date, what we are asking the seller to cover, and the contingencies that protect you. This is where having someone who negotiates for a living pays for itself.',
     'Leading with a lowball to test them on a home you love. You can talk yourself right out of the house.',
     'Terms can matter as much as price. The right closing date or a repair credit can beat a few thousand dollars.'],
    ['Inspection period',
     'Once the offer is accepted you hire an inspector to go through the house top to bottom. You get a report, and a window to ask for repairs, a credit, or to walk away.',
     'Skipping the inspection to win in a fast market. That is how you inherit somebody else’s deferred maintenance.',
     'No house is perfect. We are hunting for the expensive things: roof, foundation, systems. Not chipped paint.'],
    ['Appraisal',
     'Your lender sends an appraiser to confirm the home is worth what you are paying. They protect the bank’s money, and by extension yours.',
     'Assuming a low appraisal kills the deal. It does not have to. There are several ways to handle a gap.',
     'This is a normal step, not a verdict on your taste. Let me handle it if the number comes in light.'],
    ['Final loan approval',
     'Behind the scenes your lender is finishing underwriting, verifying everything one last time. Your only job here is to be boring: do not change anything about your money.',
     'Financing a truck or opening a credit card before closing. It can sink the loan days from the finish line.',
     'Respond to your lender fast. The deals that slow down are usually waiting on a document, not a decision.'],
    ['Closing day',
     'You sit down at the title company, sign a stack of papers, and the home becomes yours. There is a final walkthrough first to make sure it is in the shape you agreed to.',
     'Wiring money based on an email you did not verify by phone. Wire fraud is real. We confirm details out loud.',
     'Bring valid ID and expect your hand to cramp from signing. That is the worst of it. I will be right there.'],
    ['Move in',
     'Keys in hand. Change the locks, set up utilities, and stand in your empty living room for a second. You earned it. Section 09 has the moving playbook.',
     null,
     'Photograph every room the day you move in, before furniture. Useful for insurance and for the memory.'],
  ],

  costTable: [
    ['Down payment', 'Your stake in the home, paid up front', '0–20%'],
    ['Earnest money', 'A good faith deposit that shows you are serious. It counts toward your costs', '~1%'],
    ['Closing costs', 'Lender, title and county fees to finalise', '2–5%'],
    ['Inspection', 'Your independent check of the house', '$350–$550'],
    ['Appraisal', 'The lender’s value check, often rolled into closing', '$500–$700'],
    ['Moving', 'Truck, movers, supplies', '$300–$2,000'],
    ['Utility setup', 'Deposits and connection fees', '$100–$400'],
    ['Repair fund', 'The cushion for the thing that breaks in month one', '$1,000+'],
  ],

  loans: [
    ['Conventional', 'MOST COMMON',
     'The standard loan, not backed by a government programme. Can go as low as 3% down. Stronger credit gets a better rate, and once you reach 20% equity the extra insurance falls off.',
     'Buyers with decent credit and some savings who want flexibility and a clear path to dropping PMI.'],
    ['FHA', 'BUILT FOR FIRST-TIMERS',
     'Government backed and more forgiving. Lower credit scores and as little as 3.5% down can work. The trade-off is mortgage insurance that tends to stay for the life of the loan.',
     'First-time buyers still building credit or savings who want the most accessible door in.'],
    ['VA', 'EARNED IT',
     'For veterans, active duty and many surviving spouses. Zero down, no monthly mortgage insurance, and competitive rates.',
     'Anyone eligible through military service. It is one of the strongest loan products available.'],
    ['USDA', 'ZERO DOWN',
     'Zero-down loans for homes in eligible rural and semi-rural areas, and there are more of those just outside Wichita than people expect. Income limits apply.',
     'Buyers open to the edges of the metro who want in with little cash up front.'],
  ],

  decoder: [
    ['Interest rate', 'The rent you pay on the bank’s money. A small difference compounds over thirty years.'],
    ['Credit score', 'Your financial reputation as a number. Higher score, better rate. You can move it before you buy.'],
    ['Debt-to-income (DTI)', 'How much of your monthly income already goes to debt. Lenders want room left over. Paying down a card gives you breathing room.'],
    ['Escrow', 'A neutral middle-man holding money until everyone does their part. Also the account that spreads taxes and insurance across the year.'],
    ['PMI', 'Private Mortgage Insurance. A fee when you put down less than 20%. It protects the lender, not you, and on most loans it goes away as you build equity.'],
    ['Pre-approval', 'A lender’s written "here is what we will lend you." The difference between window shopping and walking in ready to buy.'],
    ['Contingency', 'A condition that has to be met or you can walk with your earnest money. Inspection and financing are the two that matter most.'],
    ['Title insurance', 'A one-time policy that protects your ownership if someone turns up later with a claim on the property.'],
  ],

  /**
   * AREAS. Read the fair housing note at the top of this file before editing.
   * Housing stock, distance and district NAME are facts. Everything a normal
   * buyer guide says about "good schools", "safe", "quiet" or who lives
   * somewhere is not going in a document with a licence number on it.
   */
  areas: [
    ['East Wichita', 'Older established housing stock, mature trees, more homes with original character. Closer in, so shorter drives to the centre of town.', 'Wichita USD 259'],
    ['West Wichita', 'A lot of the newer building has happened here. Larger lots and more modern floor plans, with retail close by.', 'Wichita USD 259 / Maize USD 266'],
    ['Derby', 'Southeast of Wichita. A separate city with its own downtown, parks and municipal services.', 'Derby USD 260'],
    ['Andover', 'East, in Butler County. Newer construction and a higher average price point than most of the metro.', 'Andover USD 385'],
    ['Maize', 'Northwest. One of the faster-growing parts of the metro, with a lot of recent construction.', 'Maize USD 266'],
    ['Goddard', 'West of the metro. Small-city services with a manageable drive to the west-side employment corridor.', 'Goddard USD 265'],
    ['Bel Aire', 'Northeast. Predominantly newer subdivisions, within easy reach of east-side amenities.', 'Wichita USD 259 / Circle USD 375'],
    ['Park City', 'North of Wichita. Generally the more approachable price points in the metro.', 'Wichita USD 259 / Valley Center USD 262'],
  ],

  checklist: {
    Exterior: ['Siding or brick straight, no major cracks', 'Ground slopes away from the house', 'Gutters and downspouts intact and draining away', 'Driveway and walkways not heaving'],
    Roof: ['Shingles flat, not curling or missing', 'Ask the age. Kansas hail is hard on roofs', 'No sagging in the rooflines'],
    Foundation: ['Walls plumb, no stair-step cracks', 'Basement dry, no musty smell', 'Floors feel level'],
    'Heating and cooling': ['Furnace and A/C age, ten to fifteen year life', 'It actually turns on and runs quiet', 'Even temperatures room to room'],
    'Water heater': ['Check the age sticker, eight to twelve years', 'No rust or pooling at the base', 'Size fits the household'],
    Windows: ['Open and close smoothly', 'No fog between double panes', 'No rot on sills or frames'],
    Electrical: ['Panel labelled and not too old', 'Outlets and switches all work', 'GFCI outlets in kitchen and bathrooms'],
    Plumbing: ['Run every tap, check pressure', 'No slow drains', 'Look under every sink for staining'],
    Layout: ['The flow works for your daily life', 'Enough storage and closets', 'Your furniture actually fits'],
    'Resale potential': ['Would the next buyer want it too', 'No unfixable deal-breakers', 'Lot and location hold value'],
  },

  ownership: {
    heading: 'What owning it actually costs',
    lede: 'This is the section most buyer guides skip, and it is the part I know better than the part before it. Across the properties Cornerstone manages I see these bills every month, on hundreds of houses. Here is what to plan for so nothing surprises you in year one.',
    points: [
      ['The one percent rule', 'Set aside roughly one percent of the home’s value a year for upkeep. On a $250,000 house that is about $2,500 a year, or a little over $200 a month you are not spending on anything fun. Something always needs attention. That is ownership, not bad luck.'],
      ['The big five, and what they cost you when they go', 'Roof, furnace, air conditioner, water heater, sewer line. These are the repairs that hurt. Ask the age of every one of them before you write an offer, and write the ages in the margin of this page. A twelve year old water heater is not a reason to walk. It is a reason to know.'],
      ['Taxes and insurance are not fixed', 'Your payment is principal, interest, taxes and insurance. The last two move. Budget for them to go up, not to stay level.'],
      ['The first month is the expensive one', 'Nobody warns you about this. Between deposits, a mower, a ladder, curtains, tools and the thing you discover on day three, plan on real money in the first thirty days.'],
      ['A house is not an emergency fund', 'Equity is not cash. Keep a separate reserve. The people I watch struggle are not the ones who bought the wrong house, they are the ones who bought a house with nothing left over.'],
    ],
  },

  nobody: [
    ['Do not max out your budget', 'Just because the bank says you can spend it does not mean your life should. Leave room for a life: dinners out, a trip, the surprise vet bill. A house that owns you is not a win.'],
    ['Do not buy anything big before closing', 'No new truck, no furniture on credit, no new cards. It sinks loans days from the finish line. Stay financially boring until you have the keys.'],
    ['Never skip the inspection', 'Even in a fast market. Even on a house that looks perfect. A few hundred dollars now can save you five figures later. This is the hill I will die on.'],
    ['Every house has flaws', 'There is no perfect home. There is the right home with a list you can live with. Chasing perfect is how good buyers lose great houses.'],
    ['Ask what the sellers are taking', 'Appliances, the shed, the mounted television, the curtains. Get it in the contract. It is the smallest fight and the most annoying one.'],
    ['Closing is stressful for everyone', 'The last week always feels chaotic. Last-minute documents, nerves, a hiccup or two. It is normal. It is not a sign anything is wrong.'],
  ],

  vendors: [
    ['PREFERRED LENDER', ['Name', 'Company', 'Phone', 'Email', 'Notes']],
    ['HOME INSPECTOR', ['Name', 'Company', 'Phone', 'Email', 'Notes']],
    ['INSURANCE AGENT', ['Name', 'Company', 'Phone', 'Email', 'Notes']],
    ['TITLE COMPANY', ['Name', 'Company', 'Phone', 'Email', 'Notes']],
  ],

  trades: ['CONTRACTOR', 'HVAC', 'PLUMBER', 'ELECTRICIAN', 'ROOFER', 'HANDYMAN'],

  moving: {
    timeline: [
      ['FOUR WEEKS OUT', 'Book movers or the truck. Start using up the freezer and pantry.'],
      ['TWO WEEKS OUT', 'Schedule utility transfers. File your change of address.'],
      ['ONE WEEK OUT', 'Pack room by room, label by room. Set aside a first night box.'],
      ['MOVE DAY', 'Change the locks first thing. Confirm utilities are on. Photograph the empty house.'],
      ['WEEK ONE', 'Find the water shutoff and the breaker panel. Test the smoke detectors.'],
    ],
    utilities: ['Electric', 'Gas', 'Water and sewer', 'Trash and recycling', 'Internet', 'Home security, if any'],
    address: ['USPS mail forwarding, do this first', 'Driver’s licence and vehicle registration', 'Bank, cards, insurance', 'Employer and payroll', 'Subscriptions and deliveries', 'Doctor, dentist, vet, pharmacy', 'Voter registration'],
    packing: ['Label boxes by room, not by contents', 'Heavy things in small boxes', 'Photograph cord setups before unplugging', 'Pack a day one box: medication, chargers, toilet paper, coffee, basic tools'],
  },

  why: {
    heading: 'Why work with me',
    lede: 'I am not going to give you the award-winning, top-producing speech. Here is the real version of what working together looks like.',
    cols: [
      ['What you can expect', 'Straight answers, fast. If a house is a bad idea I will tell you, even if it means we keep looking. I would rather lose a sale than watch you buy a headache.'],
      ['How I communicate', 'Like a normal person. Text me, call me, send me a listing at midnight. No jargon, no runaround, and I do not disappear once there is a contract.'],
      ['What I bring that is different', 'I manage more than 500 doors in this city. I know what these houses cost to run, which repairs actually hurt, and what a property is worth to hold, not just to buy.'],
      ['My commitment to educating you', 'You just read a guide instead of a pitch. I would rather you understand the decision than take my word for it. Informed buyers make confident ones.'],
    ],
    pull: 'I would rather earn your trust by showing up than talk you into anything.',
    close: 'I am not chasing transactions. I am building a business in a city I am planted in, and the first home you buy with me is not the last conversation we have. When you are ready, I am here.',
  },

  next: {
    kicker: 'YOUR NEXT MOVE',
    heading: 'One conversation, no commitment',
    body: 'You have the map. The only thing left is a plan built around your budget, your timeline and your goals, instead of a generic checklist.',
    steps: [
      ['Reach out', 'Call or text ' + P + ', or email ' + E + '. You will hear back from me.'],
      ['A short conversation', 'We talk budget, timeline and what matters to you. Zero pressure.'],
      ['Your plan', 'I send back a clear next step for your exact situation. Then you decide.'],
    ],
  },

  /** Printed as the last page and meant to be deleted before this goes out. */
  verify: [
    'Every dollar figure in Section 02 is a drafting ballpark, not a researched Wichita figure. Confirm inspection, appraisal, moving and utility numbers against what Justus actually sees, then delete this page.',
    'Confirm the down payment, earnest money and closing cost percentages in Section 02.',
    'Section 08 vendors are intentionally blank. Nothing is invented. Fill in only people Justus actually refers, and add the line about whether he receives anything for a referral.',
    'Confirm the REALTOR® mark is correct for Justus. It is only usable with current NAR membership, and it appears on the cover and in the footer.',
    'Confirm the loan descriptions in Section 03 with his preferred lender before publishing. Loan terms change.',
    'Section 04 deliberately contains no school ratings, no safety statements and no description of who lives anywhere. That is a fair housing decision, not an oversight. Do not add them.',
    'No transaction count, response time, guarantee or market prediction appears anywhere in this document. Keep it that way.',
    'Decide whether to add a QR code on the last page once a booking link exists.',
  ],
};
