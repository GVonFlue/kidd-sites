// Agent Kidd — brand config
// Build Standard §4. Every field here is a VERIFIED fact or null.
// Never guess a value. If it isn't confirmed, it stays null and gets reported
// at the checkpoint by name.

export const brand = {
  // ── Identity ────────────────────────────────────
  key: 'agent',
  name: 'Agent Kidd',
  legalName: 'Real Broker, LLC',
  personName: 'Justus Kidd',
  shortName: 'Agent Kidd',           // used in the nav pill, where space is tight
  tagline: null,                     // written in Phase 2
  domain: 'agentkidd.com',

  // ── Contact ─────────────────────────────────────
  // Sales line. Confirmed by client 2026-07-27.
  phone: { display: '(316) 390-2120', href: '+13163902120', label: 'Call or text' },
  altPhone: null,
  email: 'justus@agentkidd.com',     // confirmed by client 2026-07-27 as canonical
  address: {
    street: '309 S Laura',
    city: 'Wichita',
    state: 'KS',
    zip: '67211',
  },

  // ── Compliance (Build Standard §10) ─────────────
  compliance: {
    brokerage: 'Real Broker, LLC',
    licenseName: 'Justus Kidd',
    licenseId: '251163',             // confirmed by client 2026-07-27
    licenseState: 'KS',
    equalHousing: true,
    realtorLogo: true,               // nar_member = Yes on onboarding form
    idxDisclaimer: null,             // not required: no MLS data displayed
    mlsName: 'SCK MLS',              // Tier A. Only matters if MLS data is ever displayed.
  },

  // ── Social ──────────────────────────────────────
  // Real profile URLs, sourced from the client brief in the Drive folder.
  // Build Standard §16: every icon must point at a real profile, never a bare homepage.
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100008046796707',
    instagram: 'https://www.instagram.com/jtkidd99',
    linkedin: 'https://www.linkedin.com/in/justuskidd',
    x: 'https://x.com/JustusAMDG',
    google: null,                    // No GBP on this domain. cornerstonemgmt.co carries the single profile (client decision 2026-07-27).
  },

  // ── External systems ────────────────────────────
  external: {
    crm: 'lofty',
    leadSourceTag: 'ProyTech Site — Agent Kidd',
    // BLOCKER: Lofty currently serves agentkidd.com itself. Once this build takes
    // the domain, IDX search needs a new home (subdomain or Lofty-hosted URL).
    searchHandoffUrl: null,
    portals: [],
    booking: null,                   // calendar URL — bot books directly against it (Phase 4)
  },

  // ── Design tokens ───────────────────────────────
  // Sampled from the live site 2026-07-27. See Checkpoint 0 §5.
  theme: {
    colors: {
      ink: '#1A1D1F',
      surface: '#FFFFFF',
      surfaceDeep: '#16191B',
      wash: '#F2F3F3',
      line: '#DCDEDF',
      accent: '#9A5F40',             // copper, measured off the live buttons
      accentInk: '#8A5C13',          // brass, AA-safe as text on light grounds
      accentLift: '#D9A648',         // brass, AA-safe on dark grounds
    },
    fonts: { display: 'Archivo', body: 'IBM Plex Sans', mono: 'IBM Plex Mono' },
  },

  // ── Chatbot (Build Standard §9) ─────────────────
  bot: {
    name: 'Mason',                   // client pick 2026-07-27
    greeting: null,                  // Phase 2
    chips: [],                       // Phase 2
    enabled: true,
  },

  // ── Verified stats ──────────────────────────────
  // Transaction count deliberately omitted — client decision 2026-07-27.
  stats: {
    doors: '500+',
    residents: '1,000+',
    showings: 'thousands',
    yearsInBusiness: 4,
  },

  // Real photograph, from the client folder in Drive. No stock imagery anywhere.
  photos: {
    portrait: '/agent/justus-portrait.jpg',
    square: '/agent/justus-square.jpg',
    alt: 'Justus Kidd',
  },

  // Tier A, from the onboarding form. Only these are offered, and each one is
  // represented somewhere on the site.
  services: [
    'Buyer representation',
    'Seller representation',
    'Investment analysis',
    'First-time buyers',
    'Commercial',
    'New construction',
  ],

  awards: [
    'Elite Certified Agent',
    'Wichita State University 2024 25 Under 25',
    // 'Layman L. Clark / Kansas CCIM Chapter Scholarship' — live site only, unconfirmed
  ],

  // ── Section toggles ─────────────────────────────
  sections: {
    reviews: true,
    crossPromo: true,                // committed scope: property management block on the agent site
    listings: false,                 // search hands off to Lofty
  },
};

export default brand;
