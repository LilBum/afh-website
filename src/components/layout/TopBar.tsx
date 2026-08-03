import { site } from '../../data/site'

/** Thin teal announcement bar above the nav. */
export default function TopBar() {
  return (
    <div className="bg-teal-deep px-4 py-[0.45rem] text-center text-[0.92rem] font-bold text-[#dff0ec]">
      Tours daily by appointment &nbsp;·&nbsp;{' '}
      <a
        href={`tel:${site.phoneTel}`}
        className="whitespace-nowrap text-white underline decoration-2 underline-offset-2"
      >
        Call {site.phone}
      </a>
    </div>
  )
}
