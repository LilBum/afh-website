import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import TopBar from './components/layout/TopBar'
import Navbar from './components/layout/Navbar'
import AvailabilityBanner from './components/layout/AvailabilityBanner'
import Footer from './components/layout/Footer'
import MobileCallBar from './components/layout/MobileCallBar'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lynnwood" element={<Lynnwood />} />
          <Route path="/everett" element={<Everett />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
