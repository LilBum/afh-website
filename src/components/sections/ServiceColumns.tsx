import type { ReactNode } from 'react'
import { servicesFull } from '../../data/site'
import Container from '../ui/Container'
import Section from '../ui/Section'
import SectionHead from '../ui/SectionHead'
import Card from '../ui/Card'
import Reveal from '../ui/Reveal'

type Props = {
  title: string
  children?: ReactNode
  alt?: boolean
}

/** The full four-column service list shared by the Lynnwood & Everett pages. */
export default function ServiceColumns({ title, children, alt }: Props) {
  return (
    <Section id="services" alt={alt}>
      <Container>
        <SectionHead center kicker="Care & services" title={title}>
          {children}
        </SectionHead>
        <div className="grid grid-cols-1 gap-[1.3rem] sm:grid-cols-2 lg:grid-cols-4">
          {servicesFull.map((col, i) => (
            <Reveal key={col.title} delay={(i % 4) * 0.05} className="h-full">
              <Card className="h-full px-[1.5rem] py-[1.7rem]">
                <h3 className="mb-[0.9rem] flex items-center gap-[0.6rem] border-b-2 border-dashed border-line pb-[0.8rem] text-teal-deep">
                  <col.icon size={22} className="shrink-0 text-coral" aria-hidden />
                  {col.title}
                </h3>
                <ul className="space-y-[0.45rem]">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="relative pl-[1.3rem] text-base font-semibold text-ink-soft before:absolute before:left-0 before:font-black before:text-teal before:content-['✓']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
