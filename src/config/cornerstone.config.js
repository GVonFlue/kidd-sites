// Cornerstone Management — brand config
// Build Standard §4. Every field here is a VERIFIED fact or null.

export const brand = {
  // ── Identity ────────────────────────────────────
  key: 'cornerstone',
  name: 'Cornerstone Management',
  legalName: 'Cornerstone Management LLC',
  personName: 'Justus Kidd',
  tagline: null,                     // written in Phase 2
  domain: 'cornerstonemgmt.co',

  // ── Contact ─────────────────────────────────────
  // Two lines, deliberately routed. Leasing is the default; sales carries the
  // HOA, commercial and real estate pages.
  phone: { display: '(316) 390-1009', href: '+13163901009', label: 'Leasing' },
  altPhone: { display: '(316) 390-2120', href: '+13163902120', label: 'Sales & HOA' },
  email: 'justus@agentkidd.com',     // only confirmed address; a @cornerstonemgmt.co alias is worth setting up
  address: {
    street: '309 S Laura',
    city: 'Wichita',
    state: 'KS',
    zip: '67211',
  },

  // ── Compliance (Build Standard §10) ─────────────
  // Kansas does not require a broker's license for residential property management
  // or for HOA/condo association management. It IS required for commercial
  // management and leasing, which Cornerstone offers — conducted under Real Broker.
  compliance: {
    brokerage: 'Real Broker, LLC',
    licenseName: 'Justus Kidd',
    licenseId: '251163',
    licenseState: 'KS',
    equalHousing: true,
    realtorLogo: true,
    idxDisclaimer: null,             // not required unless MLS data is displayed
    mlsName: 'SCK MLS',              // Tier A. Only matters if MLS data is ever displayed.
    pmLicense: null,                 // not required in KS for residential/HOA management
  },

  // ── Social ──────────────────────────────────────
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100008046796707',
    instagram: 'https://www.instagram.com/jtkidd99',
    linkedin: 'https://www.linkedin.com/in/justuskidd',
    x: 'https://x.com/JustusAMDG',
    google: null,                    // GBP URL still needed. THIS domain carries the profile (client decision 2026-07-27).
  },

  // ── External systems ────────────────────────────
  external: {
    crm: 'lofty',
    pmSoftware: 'appfolio',
    leadSourceTag: 'ProyTech Site — Cornerstone',
    searchHandoffUrl: null,          // AppFolio rental listings
    // Real portal URLs not yet captured from the live AppFolio site.
    portals: [],                     // [{ label: 'Resident portal', url }, ...]
    booking: null,
    // Committed scope: replicate AppFolio listing publishing on the new site.
    // Blocked on a formal AppFolio API key request plus the client's login.
    listingFeed: null,
  },

  // ── Design tokens ───────────────────────────────
  // Sampled from the live site 2026-07-27. See Checkpoint 0 §5.
  theme: {
    colors: {
      ink: '#1A1D1F',
      surface: '#FFFFFF',
      surfaceDeep: '#16191B',        // Cornerstone leads dark — existing brand equity
      wash: '#F2F3F3',
      line: '#DCDEDF',
      accent: '#C2832A',             // brass, measured off the live buttons. FILLS ONLY (3.2:1 on white)
      accentInk: '#8A5C13',          // AA-safe as text on light grounds
      accentLift: '#D9A648',         // AA-safe on dark grounds
    },
    fonts: { display: 'Archivo', body: 'IBM Plex Sans', mono: 'IBM Plex Mono' },
  },

  // ── Chatbot (Build Standard §9) ─────────────────
  // On this brand the bot is also the maintenance intake and triage surface.
  bot: {
    name: 'Mason',
    greeting: null,                  // Phase 2
    chips: [],                       // Phase 2
    enabled: true,
    // Screening questions before a maintenance issue escalates to a tech.
    // Third question was never stated in the discovery call — client to supply.
    maintenanceScreening: [
      'Are there batteries in the thermostat?',
      'Have you changed the filter recently?',
      null,
    ],
    dispatchChannel: 'imessage',     // confirmed in discovery, not WhatsApp
  },

  // ── Verified stats ──────────────────────────────
  stats: {
    doors: '500+',                   // client-confirmed 2026-07-27
    singleFamily: '170+',            // live site homepage
    apartmentBuildings: 2,           // live site homepage
    hoas: 7,
    hoaUnitRange: '66–250',
    residents: '1,000+',
    yearsInBusiness: 4,
  },

  photos: {
    portrait: '/cornerstone/justus-portrait.jpg',
    square: '/cornerstone/justus-square.jpg',
    alt: 'Justus Kidd',
  },

  services: [
    'Single-family management',
    'Multifamily management',
    'HOA management',
    'Commercial leasing',
    'Tenant placement only',
    'Maintenance coordination',
    'Rent collection',
    'Owner reporting',
  ],

  // Distinctive and verified from the live site. Describe programs administered,
  // never who lives in the housing — Build Standard §11.
  subsidizedPrograms: ['Section 8', 'HOPE VI', 'RAD', 'LIHTC'],

  serviceArea: {
    primary: 'Wichita metro',
    secondary: 'South-central Kansas',
    statewide: 'Kansas',
    minimumNote: null,               // "new locations require a minimum" — a minimum of what?
  },

  // ── Section toggles ─────────────────────────────
  sections: {
    reviews: true,
    crossPromo: true,                // committed scope: agent block with his face and story
    listings: false,                 // pending AppFolio API access
  },
};

export default brand;
