import { useRef } from 'react'
import { GALLERY_IMAGES } from '../content/landingPageContent'
import { useBentoGalleryAnimation } from '../hooks/useBentoGalleryAnimation'

type BentoGalleryProps = Readonly<{
  enhancedScrollEnabled: boolean
  isScrollReady: boolean
}>

/*
 * Scrubbed Bento Gallery by GreenSock:
 * https://codepen.io/GreenSock/pen/vYMzKZx
 * Public Pen source used under the MIT license.
 */
export function BentoGallery({
  enhancedScrollEnabled,
  isScrollReady,
}: BentoGalleryProps) {
  const galleryWrapperRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useBentoGalleryAnimation({
    enhancedScrollEnabled,
    galleryRef,
    galleryWrapperRef,
    isScrollReady,
  })

  return (
    <div ref={galleryWrapperRef} className="gallery-wrap" aria-hidden="true">
      <div
        ref={galleryRef}
        className="gallery gallery--bento gallery--switch"
      >
        {GALLERY_IMAGES.map((src) => (
          <div className="gallery__item" key={src}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </div>
  )
}
