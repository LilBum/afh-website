import type { ReactNode } from 'react'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'

/** Teal gradient call-to-action band shared by the Lynnwood & Everett pages. */
export default function CtaBand({
  heading,
  children,
  phone,
  phoneTel,
}: {
  heading: string
  children: ReactNode
  phone: string
  phoneTel: string
}) {
  return (
    <section id="tour" className="pb-[3.8rem] sm:pb-[5.5rem]">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-8 rounded-[26px] bg-gradient-to-br from-teal-deep to-teal px-[1.6rem] py-[2.2rem] text-white shadow-card sm:px-[2.5rem] sm:py-[3.2rem] lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="mb-[0.6rem] text-white">{heading}</h2>
              <p className="text-[1.1rem] text-[#d4eae5]">{children}</p>
            </div>
            <div className="flex flex-col items-start gap-[0.9rem] lg:items-end">
              <a
                href={`tel:${phoneTel}`}
                className="whitespace-nowrap font-head text-[clamp(1.5rem,3vw,2.1rem)] font-semibold text-white no-underline hover:underline"
              >
                {phone}
              </a>
              <span className="text-[0.95rem] font-bold text-[#bfe0d9]">Tours daily, by appointment</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
