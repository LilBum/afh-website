import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'coral' | 'ghost'

type BaseProps = {
  children: ReactNode
  variant?: Variant
  size?: 'md' | 'sm'
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

// Either an internal route (`to`) rendered via React Router, or a plain anchor
// (`href`) for tel:/mailto:/in-page anchors and external links.
type Props = BaseProps & ({ to: string; href?: never } | { href: string; to?: never })

const base =
  'inline-flex items-center justify-center gap-[0.55rem] rounded-pill border-2 font-extrabold no-underline transition-[transform,box-shadow,background-color] duration-150 hover:-translate-y-0.5 active:translate-y-0'

const sizes: Record<NonNullable<BaseProps['size']>, string> = {
  md: 'px-[1.7rem] py-[0.95rem] text-[1.05rem]',
  sm: 'px-5 py-[0.65rem] text-[0.98rem]',
}

const variants: Record<Variant, string> = {
  primary: 'border-transparent bg-teal text-white shadow-[0_6px_18px_rgba(14,124,107,0.35)] hover:bg-teal-deep',
  coral: 'border-transparent bg-coral text-white shadow-[0_6px_18px_rgba(224,120,86,0.35)] hover:bg-coral-hover',
  ghost: 'border-teal bg-white text-teal-deep hover:bg-teal-tint',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  ...rest
}: Props) {
  const classes = cn(base, sizes[size], variants[variant], className)

  if ('to' in rest && rest.to) {
    return (
      <Link to={rest.to} onClick={onClick} className={classes}>
        {children}
      </Link>
    )
  }

  const href = (rest as { href: string }).href
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      onClick={onClick}
      className={classes}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
