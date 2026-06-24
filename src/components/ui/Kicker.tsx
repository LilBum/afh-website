import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** Small uppercase eyebrow pill — mirrors `.kicker`. */
export default function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'mb-[1.1rem] inline-block rounded-pill bg-teal-tint px-[0.9rem] py-[0.35rem] text-[0.85rem] font-extrabold uppercase tracking-[0.14em] text-teal',
        className,
      )}
    >
      {children}
    </span>
  )
}
