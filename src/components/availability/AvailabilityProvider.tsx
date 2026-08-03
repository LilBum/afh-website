/* eslint-disable react-refresh/only-export-components -- The provider and its typed hooks share one private context. */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  enforceAvailabilityExpiry,
  parseAvailabilityPayload,
  safeAvailabilitySnapshot,
  type AvailabilitySnapshot,
  type HomeKey,
} from '../../data/availability'

const AvailabilityContext = createContext<AvailabilitySnapshot>(safeAvailabilitySnapshot)

const REFRESH_INTERVAL_MS = 5 * 60 * 1000
const EXPIRY_CHECK_INTERVAL_MS = 60 * 1000
const REQUEST_TIMEOUT_MS = 8000

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [availability, setAvailability] = useState<AvailabilitySnapshot>(safeAvailabilitySnapshot)

  useEffect(() => {
    let active = true
    let requestController: AbortController | null = null

    const refresh = async () => {
      requestController?.abort()
      const controller = new AbortController()
      requestController = controller
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

      try {
        const response = await fetch('/api/availability', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Availability request failed with ${response.status}`)

        const parsed = parseAvailabilityPayload(await response.json())
        if (active) setAvailability(parsed)
      } catch {
        if (active) setAvailability(safeAvailabilitySnapshot)
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void refresh()
    const refreshInterval = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS)
    const expiryInterval = window.setInterval(
      () => setAvailability((current) => enforceAvailabilityExpiry(current)),
      EXPIRY_CHECK_INTERVAL_MS,
    )

    return () => {
      active = false
      requestController?.abort()
      window.clearInterval(refreshInterval)
      window.clearInterval(expiryInterval)
    }
  }, [])

  return <AvailabilityContext.Provider value={availability}>{children}</AvailabilityContext.Provider>
}

export const useAvailability = () => useContext(AvailabilityContext)

export const useHomeAvailability = (home: HomeKey) => useAvailability().homes[home]
