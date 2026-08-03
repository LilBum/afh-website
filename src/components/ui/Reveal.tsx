import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useSyncExternalStore, type ReactNode } from 'react'

const variants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

const subscribe = () => () => undefined
const getClientSnapshot = () => true
const getServerSnapshot = () => false

type Props = {
  children: ReactNode
  delay?: number
  className?: string
}

/** Fades + slides its children in once they scroll into view (replaces the old `.reveal`). */
export default function Reveal({ children, delay = 0, className }: Props) {
  const enhanced = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={false}
      animate={enhanced ? 'hidden' : 'visible'}
      whileInView={enhanced ? 'visible' : undefined}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
