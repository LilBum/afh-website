import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import TopBar from './components/layout/TopBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import MusicToggle from './components/layout/MusicToggle'
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
  return (
    <div className="overflow-x-hidden">
      <ScrollManager />
      <TopBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MusicToggle />
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
