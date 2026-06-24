import type { ReactNode } from 'react'

type Props = {
  title: string
  description: string
  children?: ReactNode
}

/**
 * Per-route document metadata. React 19 hoists rendered <title>/<meta> into
 * <head>; `children` is for extra tags like JSON-LD structured data.
 */
export default function Seo({ title, description, children }: Props) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {children}
    </>
  )
}
