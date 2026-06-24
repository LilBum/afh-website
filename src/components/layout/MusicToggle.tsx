import { useEffect, useRef, useState } from 'react'
import { Music, Pause } from 'lucide-react'
import { AmbientMusic } from '../../lib/ambientMusic'
import { cn } from '../../lib/cn'

const PREF_KEY = 'afh-music'

/** Floating button that toggles the generative ambient pad (replaces js/music.js). */
export default function MusicToggle() {
  const engineRef = useRef<AmbientMusic | null>(null)
  const [playing, setPlaying] = useState(false)

  const getEngine = () => {
    if (!engineRef.current) engineRef.current = new AmbientMusic()
    return engineRef.current
  }

  const toggle = () => {
    const engine = getEngine()
    if (playing) {
      engine.stop()
      setPlaying(false)
      try {
        localStorage.setItem(PREF_KEY, 'off')
      } catch {
        /* localStorage may be unavailable */
      }
    } else {
      engine.start()
      setPlaying(true)
      try {
        localStorage.setItem(PREF_KEY, 'on')
      } catch {
        /* localStorage may be unavailable */
      }
    }
  }

  // If music was on during a previous visit, resume on the first interaction
  // (browsers require a user gesture before audio can start).
  useEffect(() => {
    let pref: string | null = null
    try {
      pref = localStorage.getItem(PREF_KEY)
    } catch {
      /* ignore */
    }
    if (pref !== 'on') return

    const resume = () => {
      getEngine().start()
      setPlaying(true)
      cleanup()
    }
    const cleanup = () => {
      document.removeEventListener('pointerdown', resume)
      document.removeEventListener('keydown', resume)
    }
    document.addEventListener('pointerdown', resume, { once: true })
    document.addEventListener('keydown', resume, { once: true })
    return cleanup
  }, [])

  const label = playing ? 'Pause background music' : 'Play calming background music'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={label}
      title={label}
      className={cn(
        'fixed bottom-[1.2rem] right-[1.2rem] z-[60] grid h-14 w-14 place-items-center rounded-full border-2 shadow-card transition-[transform,background-color] duration-150 hover:-translate-y-0.5',
        playing ? 'music-pulse border-teal bg-teal text-white' : 'border-teal bg-white text-teal-deep',
      )}
    >
      {playing ? <Pause size={22} strokeWidth={2.6} aria-hidden /> : <Music size={24} aria-hidden />}
    </button>
  )
}
