import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Props = {
  children: ReactNode
  id?: string
  alt?: boolean
  className?: string
}

/** Vertical section rhythm — mirrors `.section` / `.section-alt`. */
export default function Section({ children, id, alt, className }: Props) {
  return (
    <section id={id} className={cn('py-[3.8rem] sm:py-[5.5rem]', alt && 'bg-cream-2', className)}>
      {children}
    </section>
  )
}
