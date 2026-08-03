import { BedDouble, Clock, CreditCard, Phone } from 'lucide-react'
import { site } from '../../data/contact'
import { formatAvailabilityDate, type HomeKey } from '../../data/availability'
import { useHomeAvailability } from '../availability/AvailabilityProvider'
import Card from '../ui/Card'
import Container from '../ui/Container'
import IconBadge from '../ui/IconBadge'
import Reveal from '../ui/Reveal'
import Section from '../ui/Section'
import SectionHead from '../ui/SectionHead'

type HomeInfo = typeof site.lynnwood | typeof site.everett

const listWithAnd = (items: readonly string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`

export default function PracticalDetails({
  homeKey,
  homeName,
  home,
}: {
  homeKey: HomeKey
  homeName: string
  home: HomeInfo
}) {
  const availability = useHomeAvailability(homeKey)

  return (
    <Section id="current-details" alt>
      <Container>
        <SectionHead center kicker="Current information" title="Availability, contact hours & payment">
          Availability is updated separately by the owner
          {availability.confirmedAt ? ` and was confirmed on ${formatAvailabilityDate(availability.confirmedAt)}` : ''}.
          It can change quickly, so please call before making plans.
        </SectionHead>

        <div className="grid grid-cols-1 gap-[1.3rem] lg:grid-cols-3">
          <Reveal className="h-full">
            <Card className="flex h-full flex-col px-[1.5rem] py-[1.7rem]">
              <IconBadge icon={BedDouble} size={52} className="mb-4" />
              <div role="status" aria-live="polite" aria-atomic="true">
                <h3 className="mb-[0.6rem]">{availability.headline}</h3>
                <p className="text-[1.02rem] text-ink-soft">{availability.detail}</p>
                <p className="mt-3 text-[0.95rem] font-bold text-ink-soft">
                  {availability.confirmedAt
                    ? `Confirmed ${formatAvailabilityDate(availability.confirmedAt)}.`
                    : 'Not recently confirmed online.'}
                </p>
              </div>
              <p className="mt-3 text-[0.95rem] font-bold text-ink-soft">
                {homeName} is licensed for up to {home.licensedCapacity} residents.
              </p>
            </Card>
          </Reveal>

          <Reveal className="h-full" delay={0.05}>
            <Card className="flex h-full flex-col px-[1.5rem] py-[1.7rem]">
              <IconBadge icon={Clock} size={52} className="mb-4" />
              <h3 className="mb-[0.6rem]">Contact & tours</h3>
              <p className="text-[1.02rem] text-ink-soft">
                Primary phone:{' '}
                <a href={`tel:${home.phoneTel}`} className="font-extrabold text-teal-deep">
                  <Phone size={16} className="mr-1 inline" aria-hidden />
                  {home.phone}
                </a>
              </p>
              <p className="mt-3 text-[1.02rem] text-ink-soft">Public contact hours: {home.publicContactHours}.</p>
              <p className="mt-3 text-[1.02rem] text-ink-soft">
                Prospective-family calls are answered 24/7. Tours are {home.tourPolicy.toLowerCase()}.
              </p>
              <p className="mt-3 text-[0.95rem] font-bold text-ink-soft">
                Trained caregiving coverage is present in the home 24/7.
              </p>
            </Card>
          </Reveal>

          <Reveal className="h-full" delay={0.1}>
            <Card className="flex h-full flex-col px-[1.5rem] py-[1.7rem]">
              <IconBadge icon={CreditCard} tone="coral" size={52} className="mb-4" />
              <h3 className="mb-[0.6rem]">Payment & Medicaid</h3>
              <p className="text-[1.02rem] text-ink-soft">
                The owner reports accepting {listWithAnd(home.payment.acceptedPrograms)}.
              </p>
              <p className="mt-3 text-[1.02rem] text-ink-soft">
                New Medicaid-funded placement is conditional or waitlisted. The owner reports that new placements
                generally require {home.payment.privatePayMonthsBeforeMedicaid} months of private pay before a
                possible transition to Medicaid.
              </p>
              <p className="mt-3 text-[0.95rem] font-bold text-ink-soft">
                Program eligibility, insurance billing, room and board, client responsibility, exceptions, and final
                terms are confirmed individually. Rates are not published.
              </p>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
