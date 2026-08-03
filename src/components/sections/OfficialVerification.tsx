import { BadgeCheck, ExternalLink, UserCheck } from 'lucide-react'
import { team } from '../../data/contact'
import Container from '../ui/Container'
import Section from '../ui/Section'
import SectionHead from '../ui/SectionHead'
import Card from '../ui/Card'
import IconBadge from '../ui/IconBadge'
import Reveal from '../ui/Reveal'

type Props = {
  homeName: string
  license: string
  dshsServicesUrl: string
  dshsReportsUrl: string
  googleProfileUrl?: string
}

const listWithAnd = (items: readonly string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`

const recordLinkClass =
  'inline-flex items-center gap-2 font-extrabold text-teal-deep no-underline hover:underline'

export default function OfficialVerification({
  homeName,
  license,
  dshsServicesUrl,
  dshsReportsUrl,
  googleProfileUrl,
}: Props) {
  return (
    <Section id="verification">
      <Container>
        <SectionHead center kicker="People & public records" title="Meet the team. Check the record.">
          Learn who provides care, then review the official information available for {homeName} before you visit.
        </SectionHead>

        <div className="grid grid-cols-1 gap-[1.3rem] lg:grid-cols-2">
          <Reveal className="h-full">
            <Card className="flex h-full flex-col px-[1.6rem] py-[1.8rem]">
              <IconBadge icon={UserCheck} size={54} className="mb-4" />
              <h3 className="mb-[0.7rem]">The people behind the care</h3>
              <p className="text-[1.02rem] text-ink-soft">
                {team.ownerName}, founder of both homes, is a {team.ownerCredential}. The care team includes{' '}
                {listWithAnd(team.staffCredentials)}. A registered nurse serves both homes as a delegating nurse and
                consultant.
              </p>
              <p className="mt-4 text-[1.02rem] text-ink-soft">
                A tour gives your family time to meet caregivers and ask how the team would approach your specific
                needs.
              </p>
            </Card>
          </Reveal>

          <Reveal className="h-full">
            <Card className="flex h-full flex-col px-[1.6rem] py-[1.8rem]">
              <IconBadge icon={BadgeCheck} tone="coral" size={54} className="mb-4" />
              <h3 className="mb-[0.7rem]">Washington DSHS license & records</h3>
              <p className="mb-4 text-[1.02rem] text-ink-soft">
                {homeName} is listed under Washington adult family home license <strong>#{license}</strong>.
              </p>
              <div className="flex flex-col items-start gap-3">
                <RecordLink href={dshsServicesUrl}>DSHS services & specialties</RecordLink>
                <RecordLink href={dshsReportsUrl}>DSHS inspection reports</RecordLink>
                {googleProfileUrl && <RecordLink href={googleProfileUrl}>Google profile</RecordLink>}
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

function RecordLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={recordLinkClass}>
      {children}
      <ExternalLink size={16} aria-hidden />
    </a>
  )
}
