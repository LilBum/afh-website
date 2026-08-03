import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Photo } from '../../data/site'
import Container from '../ui/Container'
import ResponsiveImage, { OriginalImage } from '../ui/ResponsiveImage'
import Section from '../ui/Section'
import SectionHead from '../ui/SectionHead'
import Reveal from '../ui/Reveal'

/** Photo grid + accessible lightbox (replaces the lightbox logic in js/main.js). */
export default function Gallery({ photos }: { photos: Photo[] }) {
  const count = photos.length
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setIndex(null), [])
  const step = useCallback(
    (delta: number) => {
      setIndex((i) => (i === null ? i : (i + delta + count) % count))
    },
    [count],
  )

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return

    const appRoot = document.getElementById('root') as (HTMLElement & { inert: boolean }) | null
    const previousAriaHidden = appRoot?.getAttribute('aria-hidden') ?? null
    const previousInert = appRoot?.inert ?? false
    const previousOverflow = document.body.style.overflow

    closeButtonRef.current?.focus({ preventScroll: true })
    if (appRoot) {
      appRoot.inert = true
      appRoot.setAttribute('aria-hidden', 'true')
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        step(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        step(1)
      } else if (e.key === 'Tab') {
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement

        if (!first || !last) {
          e.preventDefault()
          dialog.focus({ preventScroll: true })
        } else if (e.shiftKey && (active === first || !dialog.contains(active))) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      if (appRoot) {
        appRoot.inert = previousInert
        if (previousAriaHidden === null) appRoot.removeAttribute('aria-hidden')
        else appRoot.setAttribute('aria-hidden', previousAriaHidden)
      }
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus({ preventScroll: true })
    }
  }, [open, close, step])

  const photo = index !== null ? photos[index] : null

  return (
    <Section id="gallery" alt>
      <Container>
        <SectionHead kicker="Photo tour" title="Step inside">
          Every photo below is the actual home. Click any picture to see it full size.
        </SectionHead>
        <div className="grid grid-cols-1 gap-[1.2rem] sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p, i) => (
            <Reveal key={p.src} delay={(i % 3) * 0.05}>
              <button
                type="button"
                onClick={(event) => {
                  returnFocusRef.current = event.currentTarget
                  setIndex(i)
                }}
                className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-card bg-cream-2 shadow-soft"
              >
                <ResponsiveImage
                  src={p.src}
                  alt={p.alt}
                  sizes="(min-width: 1160px) 360px, (min-width: 1024px) calc((100vw - 78px) / 3), (min-width: 640px) calc((100vw - 59px) / 2), calc(100vw - 40px)"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-[1.1rem] pt-9 pb-[0.9rem] text-left text-[0.95rem] font-bold text-white">
                  {p.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      {open &&
        photo &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            aria-describedby="photo-viewer-caption"
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/[0.88] p-8"
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close photo viewer"
              onClick={close}
              className="absolute right-[1.4rem] top-[1.4rem] grid h-[52px] w-[52px] place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
            >
              <X size={22} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation()
                step(-1)
              }}
              className="absolute left-[1.4rem] top-1/2 grid h-[52px] w-[52px] -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
            >
              <ChevronLeft size={24} strokeWidth={2.4} />
            </button>
            <OriginalImage
              src={photo.src}
              alt={photo.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[82vh] max-w-[min(92vw,1100px)] rounded-[12px] object-contain shadow-float"
            />
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation()
                step(1)
              }}
              className="absolute right-[1.4rem] top-1/2 grid h-[52px] w-[52px] -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
            >
              <ChevronRight size={24} strokeWidth={2.4} />
            </button>
            <div
              id="photo-viewer-caption"
              aria-live="polite"
              onClick={(event) => event.stopPropagation()}
              className="absolute bottom-[1.6rem] left-1/2 max-w-[80vw] -translate-x-1/2 text-center font-bold text-white"
            >
              {photo.caption}
            </div>
          </div>,
          document.body,
        )}
    </Section>
  )
}
