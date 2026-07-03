import { Link } from 'react-router-dom'
import { Clock, Heart, Home as HomeIcon, Mail, MapPin, Phone } from 'lucide-react'
import Seo from '../components/Seo'
import Container from '../components/ui/Container'
import Section from '../components/ui/Section'
import SectionHead from '../components/ui/SectionHead'
import Kicker from '../components/ui/Kicker'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import IconBadge from '../components/ui/IconBadge'
import ContactCard from '../components/ui/ContactCard'
import Reveal from '../components/ui/Reveal'
import { servicesOverview, site, trustStrip, values } from '../data/site'

export default function Home() {
  return (
    <>
      <Seo
        title="A&D Home Care & Aging with Grace AFH — Adult Family Homes in Lynnwood & Everett, WA"
        description={`Two warm, family-style adult family homes for seniors: A&D Home Care in Lynnwood and Aging with Grace AFH in Everett, Washington. 24-hour care, RN on call, private rooms, home-cooked meals. Call ${site.phone} to schedule a tour.`}
      />

      {/* ---------- Hero ---------- */}
      <header className="overflow-hidden pt-[3rem] pb-[3.5rem] sm:pt-[4.5rem] sm:pb-[5rem]">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.9fr] lg:gap-16">
            <div>
              <Kicker>Adult family homes in Lynnwood &amp; Everett, WA</Kicker>
              <h1 className="mb-[1.2rem]">Care that feels like family.</h1>
              <p className="mb-8 max-w-[34rem] text-[1.25rem] text-ink-soft">
                Two warm, family-style homes — <strong>A&amp;D Home Care</strong> in Lynnwood and{' '}
                <strong>Aging with Grace AFH</strong> in Everett — with 24-hour professional care and room to truly
                live.
              </p>
              <div className="flex flex-wrap gap-[0.9rem]">
                <Button href={`tel:${site.phoneTel}`} variant="coral">
                  <Phone size={18} aria-hidden />
                  Call {site.phone}
                </Button>
                <Button to="/lynnwood" variant="ghost">
                  See the Lynnwood home
                </Button>
              </div>
              <p className="mt-[1.1rem] text-[0.95rem] font-bold text-ink-soft">
                Family-style living · RN on call · Private rooms
              </p>
            </div>

            <div className="relative mx-auto max-w-[560px] lg:max-w-none">
              <div
                aria-hidden
                className="absolute -top-3.5 -right-3.5 bottom-3.5 left-3.5 -rotate-[2.5deg] rounded-card bg-teal-tint"
              />
              <img
                src="/assets/img/living-room.jpg"
                alt="The bright living room of our Lynnwood home, with vaulted ceilings, a chandelier, fireplace, and comfortable couches"
                width={1179}
                height={1584}
                className="relative max-h-[540px] w-full rounded-card object-cover shadow-float"
              />
              <div className="absolute -bottom-[1.1rem] -left-[1.1rem] z-[2] flex items-center gap-[0.6rem] rounded-pill bg-white px-[1.2rem] py-[0.65rem] text-[0.95rem] font-extrabold shadow-card">
                <Heart size={22} className="fill-coral text-coral" aria-hidden />
                24-Hour Licensed Care
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* ---------- Trust strip ---------- */}
      <div className="bg-teal">
        <Container>
          <div className="flex flex-wrap justify-center gap-x-[2.4rem] gap-y-[0.6rem] py-[1.1rem]">
            {trustStrip.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-[0.55rem] text-base font-extrabold text-[#eaf6f3]">
                <Icon size={20} className="shrink-0" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* ---------- Why an adult family home? ---------- */}
      <Section id="why-afh">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Kicker>Why an adult family home?</Kicker>
              <h2 className="mb-[1.1rem]">A real home, with real care — day and night</h2>
              <p>
                <strong>Adult family homes</strong> are for those who are forgetful, may fall, need help remembering
                things, need assistance with activities of daily living, or need monitoring and supervision during the
                day and at night.
              </p>
              <p className="mt-4">
                When seniors require 24-hour specialized care and are at risk of injuring themselves, they should
                consider moving to an adult family home — with both day and night professional licensed care, in a house
                that feels like a home instead of a facility.
              </p>
            </Reveal>
            <Reveal>
              <figure>
                <img
                  src="/assets/img/dining-room.jpg"
                  alt="The dining room of our Lynnwood home with a large table, bay window, and natural light"
                  width={1179}
                  height={2556}
                  loading="lazy"
                  className="max-h-[520px] w-full rounded-card object-cover shadow-card"
                />
                <figcaption className="mt-[0.7rem] text-center text-[0.92rem] font-bold text-ink-soft">
                  The dining room at A&amp;D Home Care in Lynnwood
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- Values ---------- */}
      <Section id="we-believe" alt>
        <Container>
          <SectionHead center kicker="We believe…" title="What matters most is the care" />
          <Reveal>
            <p className="mx-auto mb-[2.8rem] max-w-[760px] text-center font-head text-[clamp(1.25rem,2.4vw,1.6rem)] italic text-ink">
              “What matters most is providing the <em>best</em> quality care and services — and the peace of mind that
              comes from knowing your loved one is truly cared for.”
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-[1.1rem] sm:grid-cols-3 lg:grid-cols-5">
            {values.map(({ icon, label }, i) => (
              <Reveal key={label} delay={(i % 5) * 0.05} className="h-full">
                <Card className="h-full px-[1.2rem] py-[1.6rem] text-center">
                  <IconBadge icon={icon} tone="coral" className="mx-auto mb-[0.8rem]" />
                  <h3 className="text-[1.12rem]">{label}</h3>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Services overview ---------- */}
      <Section id="services">
        <Container>
          <SectionHead center kicker="Care & services" title="Everything your loved one needs, under one roof">
            From daily personal care to specialized nursing support — the same full set of services at both of our
            homes.
          </SectionHead>
          <div className="grid grid-cols-1 gap-[1.3rem] sm:grid-cols-2 lg:grid-cols-4">
            {servicesOverview.map((card, i) => (
              <Reveal key={card.title} delay={(i % 4) * 0.05} className="h-full">
                <Card className="flex h-full flex-col px-[1.5rem] py-[1.8rem]">
                  <IconBadge icon={card.icon} size={54} className="mb-4" />
                  <h3 className="mb-[0.7rem]">{card.title}</h3>
                  <ul className="flex-1 space-y-[0.45rem]">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="relative pl-[1.35rem] text-base font-semibold text-ink-soft before:absolute before:left-0 before:top-[0.5em] before:h-[0.55rem] before:w-[0.55rem] before:rounded-full before:bg-coral before:content-['']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 text-[0.98rem] font-extrabold text-teal-deep">
                    <Link to="/lynnwood#services" className="text-teal-deep no-underline hover:underline">
                      Full list →
                    </Link>
                  </span>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Our two homes ---------- */}
      <Section id="homes" alt>
        <Container>
          <SectionHead center kicker="Our two homes" title="Two homes, one standard of care">
            Both homes are family-style houses in quiet neighborhoods — not facilities. Choose the one closest to you.
          </SectionHead>
          <div className="grid grid-cols-1 gap-[1.6rem] sm:grid-cols-2">
            <Reveal className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card">
                <div className="relative aspect-[16/9]">
                  <img
                    src="/assets/img/back-deck.jpg"
                    alt="The sunny back deck of our Lynnwood home with cushioned outdoor seating"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-pill bg-white px-[0.95rem] py-[0.35rem] text-[0.85rem] font-extrabold text-teal-deep shadow-soft">
                    📸 Photo tour available
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-[1.6rem] pt-[1.6rem] pb-[1.8rem]">
                  <h3 className="mb-[0.4rem] text-[1.45rem]">A&amp;D Home Care</h3>
                  <p className="mb-[0.8rem] flex items-center gap-[0.45rem] text-base font-bold text-ink-soft">
                    <MapPin size={18} className="shrink-0" aria-hidden />
                    {site.lynnwood.oneLine}
                  </p>
                  <p className="flex-1 text-[1.02rem] text-ink-soft">
                    A bright, spacious home with a vaulted-ceiling living room, open kitchen, family-style dining, and a
                    sunny back deck — on a quiet residential street.
                  </p>
                  <div className="mt-[1.3rem] self-start">
                    <Button to="/lynnwood" variant="primary">
                      See the Lynnwood home
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>

            <Reveal className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card">
                <div className="relative aspect-[16/9]">
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-teal-tint to-cream-2 text-teal-deep">
                    <HomeIcon size={64} strokeWidth={1.6} aria-hidden />
                  </div>
                  <span className="absolute left-4 top-4 rounded-pill bg-white px-[0.95rem] py-[0.35rem] text-[0.85rem] font-extrabold text-teal-deep shadow-soft">
                    📷 Photos coming soon
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-[1.6rem] pt-[1.6rem] pb-[1.8rem]">
                  <h3 className="mb-[0.4rem] text-[1.45rem]">Aging with Grace AFH</h3>
                  <p className="mb-[0.8rem] flex items-center gap-[0.45rem] text-base font-bold text-ink-soft">
                    <MapPin size={18} className="shrink-0" aria-hidden />
                    Everett, Washington
                  </p>
                  <p className="flex-1 text-[1.02rem] text-ink-soft">
                    Our Everett home offers the same warm, family-style care. A full photo tour is on its way — and
                    you're welcome to visit in person any time.
                  </p>
                  <div className="mt-[1.3rem] self-start">
                    <Button to="/everett" variant="ghost">
                      Visit the Everett page
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------- Contact ---------- */}
      <Section id="contact">
        <Container>
          <SectionHead center kicker="Contact" title="Come see what home feels like">
            The best way to choose a home is to walk through it. Reach out and we'll set up a tour at either home — no
            pressure, no obligation.
          </SectionHead>
          <div className="grid grid-cols-1 gap-[1.3rem] lg:grid-cols-3">
            <Reveal className="h-full">
              <ContactCard icon={Phone} title="Call us">
                Phone: <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
                <br />
                Call or text any time — we're happy to answer questions.
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Mail} title="Email us">
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <br />
                Send a message any time — we'll reply as soon as we can.
              </ContactCard>
            </Reveal>
            <Reveal className="h-full">
              <ContactCard icon={Clock} title="Visit us">
                <strong>A&amp;D Home Care:</strong>{' '}
                <a href={site.lynnwood.mapsUrl} target="_blank" rel="noreferrer">
                  {site.lynnwood.oneLine}
                </a>
                <br />
                <strong>Aging with Grace AFH:</strong> Everett, WA
                <br />
                Tours daily, by appointment.
              </ContactCard>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
