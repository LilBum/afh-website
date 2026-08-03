import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { areasServed, businessIdentity, googleBusinessProfile, site } from '../../data/contact'
import Container from '../ui/Container'

const year = new Date().getFullYear()
const nearbyCities = areasServed.filter((city) => city !== 'Snohomish County')
const footerLinkClass = 'font-bold text-[#e8e1d6] no-underline hover:text-white hover:underline'

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#221e19] pt-14 pb-8 text-[#c9c0b4]">
      <Container>
        <div className="grid grid-cols-1 gap-10 border-b border-[#3a342c] pb-9 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-[0.9rem] flex items-center gap-[0.6rem]">
              <img src="/assets/favicon.svg" alt="" width={38} height={38} className="rounded-[9px]" />
              <b className="font-head text-[1.2rem] text-white">{businessIdentity.publicName}</b>
            </div>
            <p className="text-[0.98rem]">
              The legal parent of A&amp;D Home Care in Lynnwood and Aging with Grace AFH in Everett, providing
              family-style living and 24-hour professional care.
            </p>
            <p className="mt-[0.8rem] text-[0.92rem]">
              Serving {nearbyCities.join(', ')} and the rest of Snohomish County.
            </p>
            <p className="mt-[0.8rem] text-[0.98rem]">
              Email:{' '}
              <a href={`mailto:${site.email}`} className={footerLinkClass}>
                {site.email}
              </a>
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.98rem]">
              <FooterLink to="/#services">Care &amp; services</FooterLink>
              <FooterLink to="/#why-afh">Why an adult family home?</FooterLink>
            </div>
          </div>

          <HomeContact
            name="A&D Home Care"
            city="Lynnwood"
            route="/lynnwood"
            street={site.lynnwood.street}
            cityState={site.lynnwood.cityState}
            mapsUrl={site.lynnwood.mapsUrl}
            phone={site.lynnwood.phone}
            phoneTel={site.lynnwood.phoneTel}
            license={site.lynnwood.license}
            googleProfileUrl={googleBusinessProfile.lynnwood}
          />

          <HomeContact
            name="Aging with Grace AFH"
            city="Everett"
            route="/everett"
            street={site.everett.street}
            cityState={site.everett.cityState}
            mapsUrl={site.everett.mapsUrl}
            phone={site.everett.phone}
            phoneTel={site.everett.phoneTel}
            license={site.everett.license}
            googleProfileUrl={googleBusinessProfile.everett}
          />
        </div>

        <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 pt-[1.6rem] text-[0.9rem]">
          <span>
            © {year} {businessIdentity.legalName} · A&amp;D Home Care · Aging with Grace AFH. All rights reserved.
          </span>
          <span>Washington State licensed adult family homes in Snohomish County.</span>
        </div>
      </Container>
    </footer>
  )
}

type HomeContactProps = {
  name: string
  city: string
  route: string
  street: string
  cityState: string
  mapsUrl: string
  phone: string
  phoneTel: string
  license: string
  googleProfileUrl?: string
}

function HomeContact({
  name,
  city,
  route,
  street,
  cityState,
  mapsUrl,
  phone,
  phoneTel,
  license,
  googleProfileUrl,
}: HomeContactProps) {
  return (
    <section aria-label={`${name} contact details`}>
      <h2 className="mb-4 font-body text-[0.85rem] font-extrabold uppercase tracking-[0.12em] text-gold">
        {city} home
      </h2>
      <address className="not-italic">
        <dl className="space-y-[0.65rem] text-[0.98rem]">
          <div>
            <dt className="font-extrabold text-white">Name</dt>
            <dd>
              <FooterLink to={route}>{name}</FooterLink>
            </dd>
          </div>
          <div>
            <dt className="font-extrabold text-white">Address</dt>
            <dd>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className={footerLinkClass}>
                {street}
                <br />
                {cityState}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-extrabold text-white">Phone</dt>
            <dd>
              <a href={`tel:${phoneTel}`} className={footerLinkClass}>
                {phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-extrabold text-white">License</dt>
            <dd>Washington AFH #{license}</dd>
          </div>
        </dl>
      </address>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[0.95rem]">
        <a href={mapsUrl} target="_blank" rel="noreferrer" className={footerLinkClass}>
          Directions
        </a>
        {googleProfileUrl && (
          <a href={googleProfileUrl} target="_blank" rel="noreferrer" className={footerLinkClass}>
            Google profile
          </a>
        )}
      </div>
    </section>
  )
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={footerLinkClass}>
      {children}
    </Link>
  )
}
