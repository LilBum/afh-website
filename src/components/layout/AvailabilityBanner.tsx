import { Link } from 'react-router-dom'
import { BedDouble, Phone } from 'lucide-react'
import { availability, site } from '../../data/contact'

/**
 * Current openings. Renders nothing when `availability` is null, which is the default.
 *
 * A family calling about an adult family home is usually working to a deadline: a parent is
 * being discharged, or a current placement has fallen through. None of the competing local
 * sites say whether they have room, so saying it is a genuine advantage, as long as it is true.
 */
export default function AvailabilityBanner() {
  if (!availability) return null

  const homePath = availability.home ? `/${availability.home}` : '/#homes'

  return (
    <div className="bg-gold/25 border-b border-gold/40">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-x-[1rem] gap-y-[0.35rem] px-6 py-[0.6rem] text-center text-[0.98rem] font-bold text-ink">
        <span className="flex items-center gap-[0.5rem]">
          <BedDouble size={18} className="shrink-0 text-teal-deep" aria-hidden />
          {availability.text}
        </span>
        <span className="flex items-center gap-[0.9rem]">
          <a href={`tel:${site.phoneTel}`} className="inline-flex items-center gap-[0.35rem] text-teal-deep">
            <Phone size={16} aria-hidden />
            Call {site.phone}
          </a>
          <Link to={homePath} className="text-teal-deep">
            See the home
          </Link>
        </span>
      </div>
    </div>
  )
}
