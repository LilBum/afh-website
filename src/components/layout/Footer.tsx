import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import Container from '../ui/Container'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#221e19] pt-14 pb-8 text-[#c9c0b4]">
      <Container>
        <div className="grid grid-cols-1 gap-10 border-b border-[#3a342c] pb-9 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="mb-[0.9rem] flex items-center gap-[0.6rem]">
              <img src="/assets/favicon.svg" alt="" width={38} height={38} className="rounded-[9px]" />
              <b className="font-head text-[1.2rem] text-white">A&amp;D Home Care &amp; Aging with Grace AFH</b>
            </div>
            <p className="text-[0.98rem]">
              Two family-style adult family homes caring for seniors in Lynnwood and Everett, Washington, with
              compassion, respect, and 24-hour professional care.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-body text-[0.85rem] font-extrabold uppercase tracking-[0.12em] text-gold">
              Our Homes
            </h4>
            <ul className="space-y-[0.55rem] text-[0.98rem]">
              <li>
                <FooterLink to="/lynnwood">A&amp;D Home Care, Lynnwood</FooterLink>
              </li>
              <li>
                <FooterLink to="/everett">Aging with Grace AFH, Everett</FooterLink>
              </li>
              <li>
                <FooterLink to="/#services">Care &amp; services</FooterLink>
              </li>
              <li>
                <FooterLink to="/#why-afh">Why an adult family home?</FooterLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-body text-[0.85rem] font-extrabold uppercase tracking-[0.12em] text-gold">
              Contact
            </h4>
            <ul className="space-y-[0.55rem] text-[0.98rem]">
              <li>
                <a href={`tel:${site.phoneTel}`} className="font-bold text-[#e8e1d6] no-underline hover:text-white hover:underline">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="font-bold text-[#e8e1d6] no-underline hover:text-white hover:underline">
                  {site.email}
                </a>
              </li>
              <li>{site.lynnwood.oneLine}</li>
              <li>Tours daily by appointment</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 pt-[1.6rem] text-[0.9rem]">
          <span>
            © {year} A&amp;D Home Care · Aging with Grace AFH. All rights reserved.
          </span>
          <span>Licensed Adult Family Homes, Washington State</span>
        </div>
      </Container>
    </footer>
  )
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="font-bold text-[#e8e1d6] no-underline hover:text-white hover:underline">
      {children}
    </Link>
  )
}
