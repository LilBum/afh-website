import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { site } from '../../data/site'
import Container from '../ui/Container'
import Button from '../ui/Button'
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
        <nav className="flex items-center gap-6 py-[0.8rem]" aria-label="Main navigation">
          <Link to="/" className="mr-auto flex items-center gap-[0.65rem] no-underline" onClick={() => setOpen(false)}>
            <img src="/assets/favicon.svg" alt="" width={42} height={42} className="rounded-[10px]" />
            <span>
              <b className="block whitespace-nowrap font-head text-[1rem] leading-[1.2] text-ink sm:text-[1.12rem]">
                A&amp;D Home Care
              </b>
              <b className="block whitespace-nowrap font-head text-[1rem] leading-[1.2] text-teal-deep sm:text-[1.12rem]">
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
