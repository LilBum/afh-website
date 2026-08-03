import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/nunito'
import './index.css'
import App from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    {/* Respect the visitor's reduced-motion preference, appropriate for this audience. */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>
)

// Production pages arrive pre-rendered. Vite's source index remains empty for fast local dev.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
