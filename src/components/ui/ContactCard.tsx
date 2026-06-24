import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import Card from './Card'
import IconBadge from './IconBadge'

/** Icon + heading + free-form content — used in the contact / visit sections. */
export default function ContactCard({
  icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
}) {
  return (
    <Card className="h-full px-[1.5rem] py-[1.7rem]">
      <IconBadge icon={icon} size={50} className="mb-[0.9rem]" />
      <h3 className="mb-[0.4rem]">{title}</h3>
      <div className="text-[1.02rem] text-ink-soft [&_a]:font-extrabold">{children}</div>
    </Card>
  )
}
