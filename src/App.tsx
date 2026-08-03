import { useEffect } from 'react'
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import TopBar from './components/layout/TopBar'
import Navbar from './components/layout/Navbar'
import AvailabilityBanner from './components/layout/AvailabilityBanner'
import Footer from './components/layout/Footer'
import MobileCallBar from './components/layout/MobileCallBar'
import { AvailabilityProvider } from './components/availability/AvailabilityProvider'
import Seo from './components/Seo'
import Home from './pages/Home'
import Lynnwood from './pages/Lynnwood'
import Everett from './pages/Everett'

/** Scrolls to the hash target on navigation, or to the top on a plain route change. */
function ScrollManager() {
  // `key` changes on every navigation, so clicking the same hash link twice still re-scrolls.
  const { hash, key } = useLocation()
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
      return
    }
    window.scrollTo(0, 0)
  }, [hash, key])
  return null
}

function Layout() {
  // Bottom padding on phones so the fixed call bar never covers the end of the footer.
  return (
    <div className="overflow-x-hidden pb-[4.6rem] md:pb-0">
      <ScrollManager />
      <TopBar />
      <Navbar />
      <AvailabilityBanner />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  )
}

function NotFound() {
  return (
    <>
      <Seo notFound />
      <section className="px-6 py-24 text-center sm:py-32">
        <p className="mb-3 text-sm font-extrabold tracking-[0.14em] text-teal-deep uppercase">404 · Page not found</p>
        <h1 className="mx-auto mb-5 max-w-[760px]">We could not find that page</h1>
        <p className="mx-auto mb-8 max-w-[620px] text-ink-soft">
          The address may have changed or been typed incorrectly. You can return home or choose one of our two adult
          family homes from the navigation above.
        </p>
        <Link
          to="/"
          className="inline-flex rounded-pill bg-teal px-6 py-3 font-extrabold text-white no-underline shadow-card transition-colors hover:bg-teal-deep"
        >
          Return to the home page
        </Link>
      </section>
    </>
  )
}

export function AppRoutes() {
  return (
    <AvailabilityProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lynnwood" element={<Lynnwood />} />
          <Route path="/everett" element={<Everett />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AvailabilityProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
