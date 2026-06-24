import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import Kicker from './Kicker'

type Props = {
  kicker: string
  title: ReactNode
  children?: ReactNode
  center?: boolean
  className?: string
}

/** Kicker + heading + optional lead — mirrors `.section-head`. */
export default function SectionHead({ kicker, title, children, center, className }: Props) {
  return (
    <div className={cn('mb-12 max-w-[720px]', center && 'mx-auto text-center', className)}>
      <Kicker>{kicker}</Kicker>
      <h2>{title}</h2>
      {children && <p className="mt-[0.9rem] text-[1.15rem] text-ink-soft">{children}</p>}
    </div>
  )
}
