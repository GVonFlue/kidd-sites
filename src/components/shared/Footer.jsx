import PhoneLink from './PhoneLink';

/**
 * Footer — carries EVERY required disclosure, on EVERY page.
 * Build Standard §10. These are legal requirements, not design preferences.
 *
 *   - Brokerage name          (an agent may not advertise without it)
 *   - Agent license number    (required in Kansas)
 *   - Office address
 *   - Equal Housing Opportunity
 *   - REALTOR(R) mark         (only when NAR membership is confirmed)
 *   - IDX disclaimer          (only when MLS data is displayed — not on this build)
 *
 * If a value is null it renders a visible, obviously-unfinished marker rather
 * than silently disappearing. A missing disclosure must never be invisible.
 */

function Missing({ field }) {
  return (
    <span className="bg-[#8A5C13] px-1 font-mono text-[11px] uppercase tracking-wide text-white">
      needs {field}
    </span>
  );
}

export default function Footer({ brand, otherBrand }) {
  const c = brand.compliance;
  const a = brand.address;
  const year = 2026;

  return (
    <footer className="mt-auto border-t border-line bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Contact */}
          <div>
            <p className="font-display text-lg font-semibold">{brand.name}</p>
            <address className="mt-3 not-italic leading-relaxed text-white/80">
              {a ? (
                <>
                  {a.street}
                  <br />
                  {a.city}, {a.state} {a.zip}
                </>
              ) : (
                <Missing field="address" />
              )}
            </address>
            <div className="mt-3 flex flex-col items-start text-white/90">
              <PhoneLink phone={brand.phone} showLabel />
              <PhoneLink phone={brand.altPhone} showLabel />
              {brand.email ? (
                <a href={`mailto:${brand.email}`} className="min-h-[44px] py-2">
                  {brand.email}
                </a>
              ) : (
                <Missing field="email" />
              )}
            </div>
          </div>

          {/* Cross-brand link — committed scope: the two brands reference each other */}
          <div>
            {otherBrand ? (
              <>
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-white/60">
                  Also from Justus Kidd
                </p>
                <a
                  href={`https://${otherBrand.domain}`}
                  className="mt-3 inline-flex min-h-[44px] items-center font-display text-lg font-semibold underline underline-offset-4"
                >
                  {otherBrand.name}
                </a>
              </>
            ) : null}
          </div>

          {/* Compliance */}
          <div className="text-sm leading-relaxed text-white/80">
            <p>
              {c.licenseName || <Missing field="license name" />}
              {c.realtorLogo ? ', REALTOR®' : null}
            </p>
            <p>
              Brokered by {c.brokerage || <Missing field="brokerage" />}
            </p>
            <p>
              {c.licenseState || <Missing field="license state" />} license{' '}
              <span className="font-mono tabular-nums">
                {c.licenseId || <Missing field="license number" />}
              </span>
            </p>
            {c.equalHousing ? (
              <p className="mt-4 flex items-start gap-2">
                <span aria-hidden="true" className="mt-[2px] font-mono text-base">
                  &#8962;
                </span>
                <span>
                  Equal Housing Opportunity. We do business in accordance with the
                  Fair Housing Act.
                </span>
              </p>
            ) : null}
            {c.idxDisclaimer ? <p className="mt-3 text-xs">{c.idxDisclaimer}</p> : null}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/60 md:flex-row md:justify-between">
          <p>
            &copy; {year} {brand.legalName || brand.name}. All rights reserved.
          </p>
          <p>
            Built by{' '}
            <a href="https://getproytech.com" className="underline underline-offset-2">
              ProyTech
            </a>
            . This site&rsquo;s code belongs to its owner.
          </p>
        </div>
      </div>
    </footer>
  );
}
