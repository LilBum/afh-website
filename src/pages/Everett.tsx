import { Clock, Home as HomeIcon, MapPin, Phone } from 'lucide-react'
import Seo from '../components/Seo'
import Container from '../components/ui/Container'
import Section from '../components/ui/Section'
import Kicker from '../components/ui/Kicker'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import ContactCard from '../components/ui/ContactCard'
import ServiceColumns from '../components/sections/ServiceColumns'
import CtaBand from '../components/sections/CtaBand'
import { site } from '../data/site'

export default function Everett() {
  return (
    <>
      <Seo
        title="Aging with Grace AFH — Adult Family Home in Everett, WA"
        description="Aging with Grace AFH is our family-style adult family home in Everett, WA — 24-hour professional care, private rooms, and home-cooked meals. Photo tour coming soon; visits welcome any time."
      />

      {/* ---------- Hero ---------- */}
      <header className="overflow-hidden pt-[3rem] pb-[3.5rem] sm:pt-[4.5rem] sm:pb-[5rem]">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.9fr] lg:gap-16">
            <div>
              <Kicker>Our Everett home</Kicker>
              <h1 className="mb-[1.2rem]">Aging with Grace AFH</h1>
              <p className="mb-8 max-w-[34rem] text-[1.25rem] text-ink-soft">
                Our Everett home lives up to its name — warm, unhurried, family-style care in a quiet neighborhood. A
                full photo tour is on its way; in the meantime, we'd love to show you around in person.
              </p>
              <div className="flex flex-wrap gap-[0.9rem]">
                <Button href={`tel:${site.phoneTel}`} variant="coral">
                  <Phone size={18} aria-hidden />
                  Schedule a tour
                </Button>
                <Button to="/lynnwood" variant="ghost">
                  See our Lynnwood home
                </Button>
              </div>
              <p className="mt-[1.1rem] text-[0.95rem] font-bold text-ink-soft">Everett, Washington</p>
            </div>

            <div className="relative mx-auto max-w-[560px] lg:max-w-none">
              <div className="grid aspect-[4/3] place-items-center rounded-card bg-gradient-to-br from-teal-tint to-cream-2 p-8 text-center shadow-float">
                <div>
                  <HomeIcon size={84} strokeWidth={1.4} className="mx-auto text-teal" aria-hidden />
                  <p className="mt-[0.6rem] font-extrabold text-teal-deep">Full photo tour coming soon</p>
                  <p className="text-[0.95rem] font-semibold text-ink-soft">Visit us in person any time</p>
                </div>
              </div>
              <div className="absolute -bottom-[1.1rem] -left-[1.1rem] z-[2] flex items-center gap-[0.6rem] rounded-pill bg-white px-[1.2rem] py-[0.65rem] text-[0.95rem] font-extrabold shadow-card">
                <MapPin size={22} className="text-teal" aria-hidden />
                Everett, Washington
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* ---------- Contact cards ---------- */}
      <Section alt>
        <Container>
          <div className="grid grid-cols-1 gap-[1.3rem] lg:grid-cols-3">
            <Reveal className="h-full">
              <ContactCard icon={MapPin} title="Location">
                Everett, Washington — the exact address is shared when you arrange a visit.
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Clock} title="Tours">
                Daily, by appointment. Walk the home, meet the caregivers, and see if it feels right.
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Phone} title="Contact">
                Phone: <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
                <br />
                Cell: <a href={`tel:${site.cellTel}`}>{site.cell}</a>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </ContactCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      <ServiceColumns title="The same full care as our Lynnwood home">
        Aging with Grace shares one standard of care with A&amp;D Home Care — every service below, included, day and
        night.
      </ServiceColumns>

      <CtaBand heading="Visit Aging with Grace in person">
        Photos are coming soon — but the door is already open. Arrange a tour and come see the home for yourself.
      </CtaBand>
    </>
  )
}
