import { getBrand } from '@/config';
import { seo as agentSeo } from '@/content/agent/seo';
import { seo as cornerstoneSeo } from '@/content/cornerstone/seo';

const SEO = { agent: agentSeo, cornerstone: cornerstoneSeo };

/**
 * Metadata for one route on one brand. Build Standard §12.
 *
 * Canonical URLs are absolute and point at the brand's OWN apex domain. That is
 * deterministic per route because each brand lives under its own path prefix, so
 * nothing has to read the Host header and no page has to become dynamic to get a
 * correct canonical.
 *
 * Apex, not www, is the canonical form on both domains. That has to match the
 * redirect configured in Vercel or the two forms compete with each other.
 */
export function pageMetadata(brandKey, route) {
  const b = getBrand(brandKey);
  const entry = SEO[brandKey][route];
  if (!entry) throw new Error(`No SEO entry for ${brandKey} ${route}. Every route needs a unique title and description.`);

  const origin = `https://${b.domain}`;
  const url = route === '/' ? origin : `${origin}${route}`;
  const ogImage = `${origin}/${brandKey}/og.jpg`;

  return {
    metadataBase: new URL(origin),
    title: entry.title,
    description: entry.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: b.name,
      locale: 'en_US',
      url,
      title: entry.title,
      description: entry.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: b.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.title,
      description: entry.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * JSON-LD. Build Standard §12 requires LocalBusiness or RealEstateAgent schema
 * per brand with REAL NAP data. Organization schema alone is not sufficient for
 * local search.
 *
 * Every value here comes from config, so the structured data cannot drift away
 * from what the footer says. Nothing is emitted that is not verified: a null in
 * config means the property is absent rather than guessed.
 */
export function brandJsonLd(brandKey) {
  const b = getBrand(brandKey);
  const origin = `https://${b.domain}`;

  const sameAs = Object.values(b.social || {}).filter(Boolean);

  const telephones = [b.phone, b.altPhone].filter(Boolean);

  const node = {
    '@context': 'https://schema.org',
    '@type': brandKey === 'agent' ? 'RealEstateAgent' : 'LocalBusiness',
    '@id': `${origin}/#business`,
    name: b.name,
    url: origin,
    telephone: b.phone.display,
    email: b.email || undefined,
    image: b.photos?.square ? `${origin}${b.photos.square}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address.street,
      addressLocality: b.address.city,
      addressRegion: b.address.state,
      postalCode: b.address.zip,
      addressCountry: 'US',
    },
    areaServed: [
      { '@type': 'City', name: 'Wichita' },
      { '@type': 'State', name: 'Kansas' },
    ],
    sameAs: sameAs.length ? sameAs : undefined,
  };

  if (telephones.length > 1) {
    node.contactPoint = telephones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.display,
      contactType: p.label,
      areaServed: 'US',
      availableLanguage: 'English',
    }));
  }

  if (brandKey === 'agent') {
    node.description =
      'Licensed Kansas real estate agent in Wichita representing buyers and sellers and analysing investment property.';
    node.parentOrganization = { '@type': 'Organization', name: b.compliance.brokerage };
    node.knowsAbout = ['Residential real estate', 'Investment property analysis', 'New construction'];
  } else {
    node.description =
      'Property management, homeowner association management and commercial leasing across the Wichita metro.';
    node.additionalType = 'https://schema.org/RealEstateAgent';
    node.knowsAbout = [
      'Single family property management',
      'Multifamily property management',
      'Homeowner association management',
      'Commercial leasing',
      ...(b.subsidizedPrograms || []).map((p) => `${p} compliance`),
    ];
  }

  // The person behind both brands, linked from each, which is how the two
  // domains signal to search that they are the same operator without either
  // claiming the other's authority.
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://agentkidd.com/#justus',
    name: b.compliance.licenseName,
    jobTitle: brandKey === 'agent' ? 'Real estate agent' : 'Founder and property manager',
    worksFor: { '@id': `${origin}/#business` },
    url: 'https://agentkidd.com/about',
    image: b.photos?.square ? `${origin}${b.photos.square}` : undefined,
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      recognizedBy: { '@type': 'Organization', name: 'Kansas Real Estate Commission' },
      identifier: b.compliance.licenseId,
    },
    sameAs: sameAs.length ? sameAs : undefined,
  };

  return [node, person];
}

/** Strip undefined so no empty properties end up in the emitted JSON-LD. */
export function clean(obj) {
  return JSON.parse(JSON.stringify(obj));
}
