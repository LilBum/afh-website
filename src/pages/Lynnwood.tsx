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
import { lynnwoodChips, lynnwoodGallery, site } from '../data/site'

export default function Lynnwood() {
  return (
    <>
      <Seo route="/lynnwood" />

      {/* ---------- Hero ---------- */}
      <header className="overflow-hidden pt-[3rem] pb-[3.5rem] sm:pt-[4.5rem] sm:pb-[5rem]">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.9fr] lg:gap-16">
            <div>
              <Kicker>A&amp;D Home Care, our Lynnwood home</Kicker>
              <h1 className="mb-[1.2rem]">An adult family home in Lynnwood, built for comfort</h1>
              <p className="mb-8 max-w-[34rem] text-[1.25rem] text-ink-soft">
                A&amp;D Home Care is a Washington-licensed adult family home with 24-hour care. Vaulted ceilings, an
                open kitchen, a big family living room, and a sunny back deck give residents room to live.
              </p>
              <div className="flex flex-wrap gap-[0.9rem]">
                <Button href={`tel:${site.lynnwood.phoneTel}`} variant="coral">
                  <Phone size={18} aria-hidden />
                  Schedule a tour
                </Button>
                <Button href="#gallery" variant="ghost">
                  See the photos
                </Button>
              </div>
              <p className="mt-[1.1rem] text-[0.95rem] font-bold text-ink-soft">{site.lynnwood.oneLine}</p>
            </div>

            <div className="relative mx-auto max-w-[560px] lg:max-w-none">
              <div
                aria-hidden
                className="absolute -top-3.5 -right-3.5 bottom-3.5 left-3.5 -rotate-[2.5deg] rounded-card bg-teal-tint"
              />
              <ResponsiveImage
                src="/assets/img/lynnwood-exterior.webp"
                alt="The Lynnwood home behind cherry trees in full white blossom, with a stone fountain in the front lawn, a Welcome sign, and a wheelchair ramp to the front door"
                fetchPriority="high"
                sizes="(min-width: 1160px) 488px, (min-width: 1024px) calc(46vw - 48px), (min-width: 600px) 560px, calc(100vw - 40px)"
                width={1184}
                height={1200}
                className="relative max-h-[540px] w-full rounded-card object-cover shadow-float"
              />
              <div className="absolute -bottom-[1.1rem] -left-[1.1rem] z-[2] flex items-center gap-[0.6rem] rounded-pill bg-white px-[1.2rem] py-[0.65rem] text-[0.95rem] font-extrabold shadow-card">
                <MapPin size={22} className="text-teal" aria-hidden />
                Lynnwood, Washington
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
              {lynnwoodChips.map((chip) => (
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

      <Gallery photos={lynnwoodGallery} />

      <ServiceColumns title="Care and daily support at A&D Home Care">
        The owner confirmed every service below for this home. Exact support still depends on assessment, the care
        plan, caregiver scope of practice, provider orders, and nurse delegation or outside-provider coordination
        when required.
      </ServiceColumns>

      <PracticalDetails homeKey="lynnwood" homeName="A&D Home Care" home={site.lynnwood} />

      <OfficialVerification
        homeName="A&D Home Care"
        license={site.lynnwood.license}
        dshsServicesUrl={site.lynnwood.dshsServicesUrl}
        dshsReportsUrl={site.lynnwood.dshsReportsUrl}
        googleProfileUrl={googleBusinessProfile.lynnwood}
      />

      {/* ---------- Visit ---------- */}
      <Section id="visit" alt>
        <Container>
          <SectionHead center kicker="Find us" title="Visit A&D Home Care" />
          <div className="grid grid-cols-1 gap-[1.3rem] lg:grid-cols-3">
            <Reveal className="h-full">
              <ContactCard icon={MapPin} title="Address">
                <a href={site.lynnwood.mapsUrl} target="_blank" rel="noreferrer">
                  {site.lynnwood.street}
                  <br />
                  {site.lynnwood.cityState}
                </a>
                <br />
                Minutes from Edmonds, Mountlake Terrace, and Brier.
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Phone} title="Phone & email">
                Primary phone: <a href={`tel:${site.lynnwood.phoneTel}`}>{site.lynnwood.phone}</a>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Clock} title="Tours">
                {site.lynnwood.tourPolicy}. Public contact hours are {site.lynnwood.publicContactHours.toLowerCase()}.
              </ContactCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand
        heading="Come walk through A&D Home Care"
        phone={site.lynnwood.phone}
        phoneTel={site.lynnwood.phoneTel}
      >
        Meet the caregivers, see the rooms, and get every question answered. Tours are free, friendly, and
        obligation-free.
      </CtaBand>
    </>
  )
}
