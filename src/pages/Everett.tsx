import { Check, Clock, MapPin, Phone } from 'lucide-react'
import Seo from '../components/Seo'
import Container from '../components/ui/Container'
import Section from '../components/ui/Section'
import SectionHead from '../components/ui/SectionHead'
import Kicker from '../components/ui/Kicker'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import ContactCard from '../components/ui/ContactCard'
import Gallery from '../components/sections/Gallery'
import ServiceColumns from '../components/sections/ServiceColumns'
import CtaBand from '../components/sections/CtaBand'
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
                Aging with Grace lives up to its name: family-style care in a quiet Everett neighborhood, with
                landscaped gardens, a sunny back deck, and a table that's always set for a shared meal or a birthday.
              </p>
              <div className="flex flex-wrap gap-[0.9rem]">
                <Button href={`tel:${site.phoneTel}`} variant="coral">
                  <Phone size={18} aria-hidden />
                  Schedule a tour
                </Button>
                <Button href="#gallery" variant="ghost">
                  See the photos
                </Button>
              </div>
              <p className="mt-[1.1rem] text-[0.95rem] font-bold text-ink-soft">{site.everett.cityState}</p>
            </div>

            <div className="relative mx-auto max-w-[560px] lg:max-w-none">
              <div
                aria-hidden
                className="absolute -top-3.5 -right-3.5 bottom-3.5 left-3.5 -rotate-[2.5deg] rounded-card bg-teal-tint"
              />
              <img
                src="/assets/img/everett-exterior.webp"
                alt="The Everett home on a sunny day, with a terraced garden of azaleas and evergreens, a green lawn, and a balcony above the entry"
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

      <ServiceColumns title="The same full care as our Lynnwood home">
        Aging with Grace shares one standard of care with A&amp;D Home Care. Every service below is included, day and
        night.
      </ServiceColumns>

      {/* ---------- Visit ---------- */}
      <Section id="visit" alt>
        <Container>
          <SectionHead center kicker="Find us" title="Visit Aging with Grace" />
          <div className="grid grid-cols-1 gap-[1.3rem] lg:grid-cols-3">
            <Reveal className="h-full">
              <ContactCard icon={MapPin} title="Location">
                Everett, Washington. The exact address is shared when you arrange a visit.
                <br />
                Families come to us from Everett, Mukilteo, Lynnwood, and across Snohomish County.
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Phone} title="Phone & email">
                Phone: <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Clock} title="Tours">
                Daily, by appointment. Walk the home, meet the caregivers, and see if it feels right.
              </ContactCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand heading="Come see Aging with Grace in person">
        The photos tell part of the story. The rest you'll feel when you visit. Meet the caregivers, see the rooms, and
        get every question answered. Tours are free and obligation-free.
      </CtaBand>
    </>
  )
}
