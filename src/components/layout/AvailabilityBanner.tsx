import { Link } from 'react-router-dom'
import { BedDouble, Phone } from 'lucide-react'
import { formatAvailabilityDate, homeKeys } from '../../data/availability'
import { site } from '../../data/contact'
import { useAvailability } from '../availability/AvailabilityProvider'

/**
 * Current openings. Renders nothing unless the API supplies a current, unexpired opening.
 *
 * A family calling about an adult family home is usually working to a deadline: a parent is
 * being discharged, or a current placement has fallen through. None of the competing local
 * sites say whether they have room, so saying it is a genuine advantage, as long as it is true.
 */
export default function AvailabilityBanner() {
  const availability = useAvailability()
  const availableHomes = homeKeys.filter((key) => availability.homes[key].status === 'available')
  if (availableHomes.length === 0) return null

  return (
    <div className="bg-gold/25 border-b border-gold/40" role="status" aria-live="polite" aria-atomic="true">
      <div className="mx-auto grid max-w-[1120px] gap-y-[0.35rem] px-6 py-[0.6rem] text-center text-[0.98rem] font-bold text-ink">
        {availableHomes.map((homeKey) => {
          const opening = availability.homes[homeKey]
          const home = site[homeKey]
          const headlinePunctuation = /[.!?]$/.test(opening.headline) ? '' : '.'
          const confirmed = opening.confirmedAt ? ` Confirmed ${formatAvailabilityDate(opening.confirmedAt)}.` : ''

          return (
            <div
              key={homeKey}
              className="flex flex-wrap items-center justify-center gap-x-[1rem] gap-y-[0.35rem]"
            >
              <span className="flex items-center gap-[0.5rem]">
                <BedDouble size={18} className="shrink-0 text-teal-deep" aria-hidden />
                {home.name}: {opening.headline}
                {headlinePunctuation}
                {confirmed}
              </span>
              <span className="flex items-center gap-[0.9rem]">
                <a
                  href={`tel:${home.phoneTel}`}
                  className="inline-flex items-center gap-[0.35rem] text-teal-deep"
                >
                  <Phone size={16} aria-hidden />
                  Call {home.phone}
                </a>
                <Link to={`/${homeKey}`} className="text-teal-deep">
                  View details
                </Link>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
