import { pageMetadata } from '@/lib/seo';
import Hero from '@/components/shared/Hero';
import Section from '@/components/shared/Section';
import ItemList from '@/components/shared/ItemList';
import BotPanel from '@/components/shared/BotPanel';
import ClosingCta from '@/components/shared/ClosingCta';
import { H2 } from '@/components/shared/Section';
import { availability } from '@/content/cornerstone/pages';
import { bot } from '@/content/cornerstone/bot';
import ListingsEmbed from '@/components/shared/ListingsEmbed';
import ListingCards from '@/components/shared/ListingCards';
import { listings } from '@/content/cornerstone/listings';
import Button from '@/components/shared/Button';
import { Eyebrow } from '@/components/shared/Section';
import { getBrand } from '@/config';

export const metadata = pageMetadata('cornerstone', '/availability');
const brand = getBrand('cornerstone');

// One source of truth for the listings URL, injected into every button that
// points at it rather than repeated through the content files.
const listingsUrl = brand.external.searchHandoffUrl;
const withListings = (cta) => (cta ? { ...cta, href: cta.href ?? listingsUrl } : cta);

export default function Page() {
  const hero = {
    ...availability.hero,
    primaryCta: withListings(availability.hero.primaryCta),
  };
  const closing = {
    ...availability.closing,
    secondaryCta: withListings(availability.closing.secondaryCta),
  };
  return (<>
    <Hero hero={hero} tone="deep" seed={43} portals={brand.external.portals} />
    {/* Maintenance and leasing questions go to Mason first, which is the whole
        point: it takes load off the phone rather than adding to it. */}
    <Section tone="surface"><BotPanel bot={bot} brandKey="cornerstone" tone="surface" actions={{ hoaReview: '/hoa#review' }} /></Section>
    {/* The vacancies themselves, as high as they can go without displacing the
        maintenance triage the page also exists for. */}
    <Section tone="surface" id="listings">
      <Eyebrow>{availability.listings.eyebrow}</Eyebrow>
      <H2 className="mt-4">{availability.listings.heading}</H2>
      <p className="mt-4 max-w-prose leading-relaxed text-ink/80">{availability.listings.body}</p>

      {brand.external.listingEmbed ? (
        <div className="mt-10">
          <ListingsEmbed html={brand.external.listingEmbed} />
        </div>
      ) : brand.external.listingIframe ? (
        <div className="mt-10 overflow-hidden rounded-frame border border-line">
          <iframe
            src={listingsUrl}
            title="Current rental listings"
            loading="lazy"
            className="block h-[900px] w-full"
          />
        </div>
      ) : (
        /* Neither configured yet: the dated snapshot, so the page that promises
           available rentals actually shows available rentals. Disappears on its
           own the moment listingEmbed is set. */
        <ListingCards listings={listings} href={listingsUrl} />
      )}

      {/* Always present, widget or not. If the embed is missing, blocked or
          slow, this is still the way through to the actual vacancies. */}
      <div className="mt-10">
        <Button href={listingsUrl} level="primary" tone="light">{availability.listings.cta}</Button>
      </div>
      <p className="mt-6 max-w-prose text-sm leading-relaxed text-ink/75">{availability.listings.note}</p>
    </Section>

    <Section tone="wash">
      <H2>{availability.screening.heading}</H2>
      <p className="mt-4 max-w-prose leading-relaxed text-ink/80">{availability.screening.body}</p>
      <ul className="mt-6 space-y-3">
        {availability.screening.items.map((i) => (
          <li key={i} className="flex gap-3"><span aria-hidden="true" className="mt-[9px] h-[6px] w-[6px] shrink-0 bg-accent" />{i}</li>
        ))}
      </ul>
      <p className="mt-8 max-w-prose border-l-2 border-accent pl-5 text-sm leading-relaxed opacity-80">{availability.screening.note}</p>
    </Section>
    <Section tone="surface">
      <ItemList {...availability.residents} columns={3} />
    </Section>
    <Section tone="deep"><ClosingCta block={closing} tone="deep" /></Section>
  </>);
}
