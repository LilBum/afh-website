import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { site } from '../../data/site'
import Container from '../ui/Container'
import Button from '../ui/Button'
import MusicToggle from './MusicToggle'
import { cn } from '../../lib/cn'

const links = [
  { label: 'Home', to: '/', end: true },
  { label: 'Lynnwood Home', to: '/lynnwood', end: false },
  { label: 'Everett Home', to: '/everett', end: false },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    cn(
      'border-b-[3px] py-[0.3rem] text-base font-extrabold no-underline transition-colors',
      isActive ? 'border-coral text-teal-deep' : 'border-transparent text-ink-soft hover:text-teal-deep',
    )

  const mobileLink = ({ isActive }: { isActive: boolean }) =>
    cn(
      'block border-b border-line px-[0.3rem] py-[0.8rem] text-base font-extrabold no-underline transition-colors',
      isActive ? 'text-teal-deep' : 'text-ink-soft hover:text-teal-deep',
    )

  return (
    <div className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-md">
      <Container>
        {/* Tightest point is 768px, where the desktop links appear but the container is still
            narrow, so the gap only opens up at lg. */}
        <nav className="flex items-center gap-3 py-[0.8rem] md:gap-4 lg:gap-6" aria-label="Main navigation">
          {/* min-w-0 lets this shrink; without it the nowrap brand set a hard floor that pushed
              the menu button off the edge of a 320px screen. */}
          <Link
            to="/"
            className="mr-auto flex min-w-0 items-center gap-[0.5rem] no-underline sm:gap-[0.65rem]"
            onClick={() => setOpen(false)}
          >
            <img
              src="/assets/favicon.svg"
              alt=""
              width={42}
              height={42}
              className="h-9 w-9 shrink-0 rounded-[10px] sm:h-[42px] sm:w-[42px]"
            />
            <span className="min-w-0">
              <b className="block font-head text-[0.92rem] leading-[1.2] text-ink sm:whitespace-nowrap sm:text-[1.12rem]">
                A&amp;D Home Care
              </b>
              <b className="block font-head text-[0.92rem] leading-[1.2] text-teal-deep sm:whitespace-nowrap sm:text-[1.12rem]">
                &amp; Aging with Grace AFH
              </b>
            </span>
          </Link>

          <div className="hidden items-center gap-[1.4rem] md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={desktopLink}>
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/#contact"
              className="border-b-[3px] border-transparent py-[0.3rem] text-base font-extrabold text-ink-soft no-underline transition-colors hover:text-teal-deep"
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:block">
            <Button href={`tel:${site.phoneTel}`} variant="coral" size="sm">
              <Phone size={18} aria-hidden />
              {site.phone}
            </Button>
          </div>

          <MusicToggle />

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-[10px] p-[0.4rem] text-ink md:hidden"
          >
            {open ? <X size={28} strokeWidth={2.4} /> : <Menu size={28} strokeWidth={2.4} />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-cream shadow-card md:hidden"
          >
            <Container>
              <div className="py-2">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => setOpen(false)}
                    className={mobileLink}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link
                  to="/#contact"
                  onClick={() => setOpen(false)}
                  className="block px-[0.3rem] py-[0.8rem] text-base font-extrabold text-ink-soft no-underline hover:text-teal-deep"
                >
                  Contact
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
