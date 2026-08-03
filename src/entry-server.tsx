/* eslint-disable react-refresh/only-export-components -- This is a build-time server entry, not a Fast Refresh module. */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { MotionConfig } from 'framer-motion'
import { StaticRouter } from 'react-router'
import { AppRoutes } from './App'

export { NOT_FOUND_DESCRIPTION, NOT_FOUND_TITLE } from './components/Seo'

/** Renders the same route tree the browser hydrates, without browser-only router state. */
export function renderRoute(pathname: string): string {
  return renderToString(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <StaticRouter location={pathname}>
          <AppRoutes />
        </StaticRouter>
      </MotionConfig>
    </StrictMode>,
  )
}
