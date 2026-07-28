import { brandJsonLd, clean } from '@/lib/seo';

/** Structured data, rendered server-side so it is crawlable. */
export default function JsonLd({ brandKey }) {
  const nodes = brandJsonLd(brandKey).map(clean);
  return (
    <>
      {nodes.map((n, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(n) }}
        />
      ))}
    </>
  );
}
