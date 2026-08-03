import { Check, Clock, MapPin, Phone } from 'lucide-react'
import Seo from '../components/Seo'
import Container from '../components/ui/Container'
import Section from '../components/ui/Section'
import SectionHead from '../components/ui/SectionHead'
import Kicker from '../components/ui/Kicker'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import ContactCard from '../components/ui/ContactCard'
import ResponsiveImage from '../components/ui/ResponsiveImage'
import Gallery from '../components/sections/Gallery'
import ServiceColumns from '../components/sections/ServiceColumns'
import CtaBand from '../components/sections/CtaBand'
import OfficialVerification from '../components/sections/OfficialVerification'
import PracticalDetails from '../components/sections/PracticalDetails'
import { googleBusinessProfile } from '../data/contact'
import { everettChips, everettGallery, site } from '../data/site'

export default function Everett() {
  return (
    <>
      <Seo route="/everett" />

      {/* ---------- Hero ---------- */}
      <header className="overflow-hidden pt-[3rem] pb-[3.5rem] sm:pt-[4.5rem] sm:pb-[5rem]">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.9fr] lg:gap-16">
            <div>
              <Kicker>Aging with Grace AFH, our Everett home</Kicker>
              <h1 className="mb-[1.2rem]">An adult family home in Everett, warm and full of life</h1>
              <p className="mb-8 max-w-[34rem] text-[1.25rem] text-ink-soft">
                Aging with Grace is a Washington-licensed adult family home with 24-hour care in a quiet Everett
                neighborhood, with landscaped gardens, a sunny back deck, and shared meals around the table.
              </p>
              <div className="flex flex-wrap gap-[0.9rem]">
                <Button href={`tel:${site.everett.phoneTel}`} variant="coral">
                  <Phone size={18} aria-hidden />
                  Schedule a tour
                </Button>
                <Button href="#gallery" variant="ghost">
                  See the photos
                </Button>
              </div>
              <p className="mt-[1.1rem] text-[0.95rem] font-bold text-ink-soft">{site.everett.oneLine}</p>
            </div>

            <div className="relative mx-auto max-w-[560px] lg:max-w-none">
              <div
                aria-hidden
                className="absolute -top-3.5 -right-3.5 bottom-3.5 left-3.5 -rotate-[2.5deg] rounded-card bg-teal-tint"
              />
              <ResponsiveImage
                src="/assets/img/everett-exterior.webp"
                alt="The Everett home on a sunny day, with a terraced garden of azaleas and evergreens, a green lawn, and a balcony above the entry"
                fetchPriority="high"
                sizes="(min-width: 1160px) 488px, (min-width: 1024px) calc(46vw - 48px), (min-width: 600px) 560px, calc(100vw - 40px)"
                width={900}
                height={1200}
                className="relative max-h-[540px] w-full rounded-card object-cover shadow-float"
              />
              <div className="absolute -bottom-[1.1rem] -left-[1.1rem] z-[2] flex items-center gap-[0.6rem] rounded-pill bg-white px-[1.2rem] py-[0.65rem] text-[0.95rem] font-extrabold shadow-card">
                <MapPin size={22} className="text-teal" aria-hidden />
                Everett, Washington
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* ---------- Quick-fact chips ---------- */}
      <section className="pt-8 pb-[3.8rem] sm:pb-[5.5rem]">
        <Container>
          <Reveal>
            <div className="flex flex-wrap gap-[0.7rem]">
              {everettChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-[0.5rem] rounded-pill border border-line bg-white px-[1.1rem] py-[0.55rem] text-[0.98rem] font-extrabold text-ink shadow-soft"
                >
                  <Check size={18} strokeWidth={2.4} className="shrink-0 text-teal" aria-hidden />
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <Gallery photos={everettGallery} />

      <ServiceColumns title="Care and daily support at Aging with Grace">
        The owner confirmed every service below for this home. Exact support still depends on assessment, the care
        plan, caregiver scope of practice, provider orders, and nurse delegation or outside-provider coordination
        when required.
      </ServiceColumns>

      <PracticalDetails homeKey="everett" homeName="Aging with Grace AFH" home={site.everett} />

      <OfficialVerification
        homeName="Aging with Grace AFH"
        license={site.everett.license}
        dshsServicesUrl={site.everett.dshsServicesUrl}
        dshsReportsUrl={site.everett.dshsReportsUrl}
        googleProfileUrl={googleBusinessProfile.everett}
      />

      {/* ---------- Visit ---------- */}
      <Section id="visit" alt>
        <Container>
          <SectionHead center kicker="Find us" title="Visit Aging with Grace" />
          <div className="grid grid-cols-1 gap-[1.3rem] lg:grid-cols-3">
            <Reveal className="h-full">
              <ContactCard icon={MapPin} title="Address">
                <a href={site.everett.mapsUrl} target="_blank" rel="noreferrer">
                  {site.everett.street}
                  <br />
                  {site.everett.cityState}
                </a>
                <br />
                Families come to us from Everett, Mukilteo, Lynnwood, and across Snohomish County.
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Phone} title="Phone & email">
                Primary phone: <a href={`tel:${site.everett.phoneTel}`}>{site.everett.phone}</a>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Clock} title="Tours">
                {site.everett.tourPolicy}. Public contact hours are {site.everett.publicContactHours.toLowerCase()}.
              </ContactCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand
        heading="Come see Aging with Grace in person"
        phone={site.everett.phone}
        phoneTel={site.everett.phoneTel}
      >
        The photos tell part of the story. The rest you'll feel when you visit. Meet the caregivers, see the rooms, and
        get every question answered. Tours are free and obligation-free.
      </CtaBand>
    </>
  )
}
