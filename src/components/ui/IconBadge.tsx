import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

type Props = {
  icon: LucideIcon
  tone?: 'teal' | 'coral'
  size?: number
  className?: string
}

const tones = {
  teal: 'bg-teal-tint text-teal-deep',
  coral: 'bg-coral-tint text-coral',
}

/** Rounded-square icon chip used on value / service / contact cards (`.ico`). */
export default function IconBadge({ icon: Icon, tone = 'teal', size = 52, className }: Props) {
  return (
    <div
      className={cn('grid place-items-center rounded-2xl', tones[tone], className)}
      style={{ width: size, height: size }}
    >
      <Icon size={26} aria-hidden />
    </div>
  )
}
