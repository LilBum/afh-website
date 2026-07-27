import { useCallback, useEffect, useRef, useState } from 'react'
import { Music, Pause } from 'lucide-react'
import { AmbientMusic } from '../../lib/ambientMusic'
import { cn } from '../../lib/cn'

const PREF_KEY = 'afh-music'

/** Toggles the generative ambient pad. On by default; an explicit "off" is remembered. */
export default function MusicToggle() {
  const engineRef = useRef<AmbientMusic | null>(null)
  const [playing, setPlaying] = useState(false)

  const getEngine = useCallback(() => {
    if (!engineRef.current) engineRef.current = new AmbientMusic()
    return engineRef.current
  }, [])

  const remember = (value: 'on' | 'off') => {
    try {
      localStorage.setItem(PREF_KEY, value)
    } catch {
      /* localStorage may be unavailable */
    }
  }

  const toggle = async () => {
    const engine = getEngine()
    if (playing) {
      engine.stop()
      setPlaying(false)
      remember('off')
      return
    }
    setPlaying(await engine.start())
    remember('on')
  }

  // Start automatically unless the visitor has previously switched it off. Browsers block
  // audio until a user gesture, so retry on the first interaction if the initial try fails.
  useEffect(() => {
    let pref: string | null = null
    try {
      pref = localStorage.getItem(PREF_KEY)
    } catch {
      /* ignore */
    }
    if (pref === 'off') return

    let settled = false
    const attempt = async () => {
      if (settled) return
      if (await getEngine().start()) {
        settled = true
        setPlaying(true)
        removeListeners()
      }
    }
    const removeListeners = () => {
      document.removeEventListener('pointerdown', attempt)
      document.removeEventListener('keydown', attempt)
    }

    void attempt()
    document.addEventListener('pointerdown', attempt)
    document.addEventListener('keydown', attempt)
    return removeListeners
  }, [getEngine])

  const label = playing ? 'Turn off background music' : 'Turn on calming background music'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={label}
      title={label}
      className={cn(
        'relative grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-[transform,background-color] duration-150 hover:-translate-y-0.5 md:h-10 md:w-10',
        playing ? 'music-pulse border-teal bg-teal text-white' : 'border-teal bg-white text-teal-deep',
      )}
    >
      {playing ? <Pause size={17} strokeWidth={2.6} aria-hidden /> : <Music size={18} aria-hidden />}
    </button>
  )
}
