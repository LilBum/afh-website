import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** White rounded card with hairline border + soft shadow, the site's base surface. */
export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-card border border-line bg-white shadow-soft', className)}>
      {children}
    </div>
  )
}
