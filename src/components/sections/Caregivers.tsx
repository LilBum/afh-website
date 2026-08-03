import { Award, HeartHandshake, Stethoscope, UserCheck } from 'lucide-react'
import { team } from '../../data/contact'
import Container from '../ui/Container'
import Section from '../ui/Section'
import SectionHead from '../ui/SectionHead'
import Card from '../ui/Card'
import IconBadge from '../ui/IconBadge'
import Reveal from '../ui/Reveal'

/** "a, b, and c" rather than the bare comma list a join() would give. */
const listWithAnd = (items: readonly string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`

const credentials = [
  {
    icon: Award,
    stat: `${team.ownerYears} years`,
    label: 'Senior care & AFH ownership',
    detail: `${team.ownerName} founded both homes, has ${team.ownerYears} years of experience in ${team.ownerExperience}, and is a ${team.ownerCredential}.`,
  },
  {
    icon: Stethoscope,
    stat: 'RN support',
    label: 'Delegation & consultation',
    detail: 'A registered nurse serves both homes as a delegating nurse and consultant.',
  },
  {
    icon: UserCheck,
    stat: 'Credentialed staff',
    label: 'Current care team',
    detail: `The current caregiving team includes ${listWithAnd(team.staffCredentials)}.`,
  },
  {
    icon: HeartHandshake,
    stat: 'The same faces',
    label: 'Day after day',
    detail: 'With a handful of residents, your family member is cared for by people who know them.',
  },
]

/**
 * Who provides the care, with credentials.
 *
 * The competing local sites say "professional, caring staff" and stop. The one that ranks best
 * leads with its owner's nursing credential, because that is the decision families are actually
 * making. Every figure here comes from the owners; nothing is inferred.
 */
export default function Caregivers() {
  return (
    <Section id="caregivers">
      <Container>
        <SectionHead center kicker="Who looks after your family" title="A small, credentialed team">
          Choosing a home is really choosing the people in it. {team.ownerName} founded A&amp;D Home Care in 2007 and
          Aging with Grace AFH in 2017, with {team.ownerYears} years in senior care and adult family home ownership.
        </SectionHead>
        <div className="grid grid-cols-1 gap-[1.2rem] sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((item, i) => (
            <Reveal key={item.label} delay={(i % 4) * 0.05} className="h-full">
              <Card className="flex h-full flex-col px-[1.5rem] py-[1.7rem]">
                <IconBadge icon={item.icon} size={54} className="mb-4" />
                <p className="font-head text-[1.35rem] leading-tight font-bold text-teal-deep">{item.stat}</p>
                <p className="mb-[0.7rem] text-[0.85rem] font-extrabold tracking-[0.1em] text-ink-soft uppercase">
                  {item.label}
                </p>
                <p className="text-[1.02rem] text-ink-soft">{item.detail}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
