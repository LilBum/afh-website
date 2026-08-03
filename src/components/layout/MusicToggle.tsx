import { useCallback, useRef, useState } from 'react'
import { Music, Pause } from 'lucide-react'
import { cn } from '../../lib/cn'

type AmbientMusicEngine = import('../../lib/ambientMusic').AmbientMusic

/** Loads and starts the ambient pad only after the visitor explicitly asks for it. */
export default function MusicToggle() {
  const engineRef = useRef<AmbientMusicEngine | null>(null)
  const engineLoadRef = useRef<Promise<AmbientMusicEngine> | null>(null)
  const busyRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [busy, setBusy] = useState(false)

  const getEngine = useCallback(async () => {
    if (engineRef.current) return engineRef.current
    if (!engineLoadRef.current) {
      engineLoadRef.current = import('../../lib/ambientMusic')
        .then(({ AmbientMusic }) => {
          const engine = new AmbientMusic()
          engineRef.current = engine
          return engine
        })
        .catch((error: unknown) => {
          engineLoadRef.current = null
          throw error
        })
    }
    return engineLoadRef.current
  }, [])

  const toggle = async () => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    try {
      const engine = await getEngine()
      if (engine.isPlaying) {
        engine.stop()
        setPlaying(false)
      } else {
        setPlaying(await engine.start())
      }
    } catch {
      setPlaying(false)
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  const label = busy
    ? 'Loading calming background music'
    : playing
      ? 'Turn off background music'
      : 'Turn on calming background music'

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={playing}
      aria-busy={busy || undefined}
      aria-label={label}
      title={label}
      className={cn(
        'relative grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-[transform,background-color] duration-150 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 md:h-10 md:w-10',
        playing ? 'music-pulse border-teal bg-teal text-white' : 'border-teal bg-white text-teal-deep',
      )}
    >
      {playing ? <Pause size={17} strokeWidth={2.6} aria-hidden /> : <Music size={18} aria-hidden />}
    </button>
  )
}
