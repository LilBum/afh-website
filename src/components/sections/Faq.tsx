import { faqs } from '../../data/site'
import Container from '../ui/Container'
import Section from '../ui/Section'
import SectionHead from '../ui/SectionHead'
import Reveal from '../ui/Reveal'

/** Common questions, using native <details> so answers are in the DOM for crawlers. */
export default function Faq() {
  return (
    <Section id="faq" alt>
      <Container>
        <SectionHead center kicker="Common questions" title="What families ask us first">
          If your question is not here, call and ask. We would rather answer it now than have you wonder.
        </SectionHead>
        <div className="mx-auto max-w-[820px]">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={(i % 3) * 0.04}>
              <details className="group mb-[0.9rem] rounded-card border border-line bg-white px-[1.4rem] py-[1.1rem] shadow-soft">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-head text-[1.12rem] font-bold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span
                    aria-hidden
                    className="mt-[0.15rem] shrink-0 text-[1.4rem] leading-none font-bold text-teal transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-[0.8rem] text-[1.02rem] text-ink-soft">{faq.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
