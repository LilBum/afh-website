import type { ImgHTMLAttributes } from 'react'
import { responsiveImageManifest } from '../../data/responsiveImages'

type ManagedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'>

export type ResponsiveImageProps = ManagedImageProps & {
  src: string
  sizes: string
}

export type OriginalImageProps = ManagedImageProps & {
  src: string
}

function variantPath(src: string, width: number, extension: 'webp' | 'avif') {
  const filename = src.slice('/assets/img/'.length, -'.webp'.length)
  return `/assets/img/responsive/${filename}-${width}.${extension}`
}

function webpSrcSet(src: string) {
  const metadata = responsiveImageManifest[src]
  if (!metadata) return undefined

  return [
    ...metadata.variants.map((width) => `${variantPath(src, width, 'webp')} ${width}w`),
    `${src} ${metadata.width}w`,
  ].join(', ')
}

function avifSrcSet(src: string) {
  const metadata = responsiveImageManifest[src]
  if (!metadata) return undefined

  return [...metadata.variants, metadata.width]
    .map((width) => `${variantPath(src, width, 'avif')} ${width}w`)
    .join(', ')
}

/** Uses generated derivatives while retaining the published original as the fallback. */
export default function ResponsiveImage({ src, sizes, width, height, ...props }: ResponsiveImageProps) {
  const metadata = responsiveImageManifest[src]
  const fallbackSrcSet = webpSrcSet(src)
  const preferredSrcSet = avifSrcSet(src)

  if (!metadata || !fallbackSrcSet || !preferredSrcSet) {
    return <img {...props} src={src} width={width} height={height} />
  }

  return (
    <picture className="contents">
      <source type="image/avif" srcSet={preferredSrcSet} sizes={sizes} />
      <img
        {...props}
        src={src}
        srcSet={fallbackSrcSet}
        sizes={sizes}
        width={width ?? metadata.width}
        height={height ?? metadata.height}
      />
    </picture>
  )
}

/** Loads the original file directly, for full-resolution views such as the gallery lightbox. */
export function OriginalImage({ src, width, height, ...props }: OriginalImageProps) {
  const metadata = responsiveImageManifest[src]

  return <img {...props} src={src} width={width ?? metadata?.width} height={height ?? metadata?.height} />
}
