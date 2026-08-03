import { Mail, Phone } from 'lucide-react'
import { site } from '../../data/site'

/**
 * Persistent call/email bar, phones only.
 *
 * On desktop the phone number sits in the navbar, but that button is `hidden md:block`, so on a
 * phone the only always-visible number was small text in the top bar. Most traffic here arrives
 * on a phone from a Google listing, and the action we want is a call.
 */
export default function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] flex gap-2 border-t border-line bg-cream/95 px-3 py-2 backdrop-blur-md md:hidden">
      <a
        href={`tel:${site.phoneTel}`}
        className="flex flex-1 items-center justify-center gap-[0.5rem] rounded-pill bg-coral px-4 py-[0.7rem] text-[1.02rem] font-extrabold text-ink no-underline shadow-card"
      >
        <Phone size={18} aria-hidden />
        Call {site.phone}
      </a>
      <a
        href={`mailto:${site.email}`}
        aria-label="Email us"
        className="grid w-[52px] shrink-0 place-items-center rounded-pill border-2 border-teal bg-white text-teal-deep no-underline"
      >
        <Mail size={20} aria-hidden />
      </a>
    </div>
  )
}
