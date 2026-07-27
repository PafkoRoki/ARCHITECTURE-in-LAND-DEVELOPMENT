import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { ExpoScaleEase, Flip, gsap, ScrollTrigger } from '../lib/gsap'

type UseBentoGalleryAnimationOptions = Readonly<{
  enhancedScrollEnabled: boolean
  galleryRef: RefObject<HTMLDivElement | null>
  galleryWrapperRef: RefObject<HTMLDivElement | null>
  isScrollReady: boolean
}>

export function useBentoGalleryAnimation({
  enhancedScrollEnabled,
  galleryRef,
  galleryWrapperRef,
  isScrollReady,
}: UseBentoGalleryAnimationOptions) {
  useLayoutEffect(() => {
    const gallery = galleryRef.current
    const galleryWrapper = galleryWrapperRef.current

    if (
      !enhancedScrollEnabled ||
      !gallery ||
      !galleryWrapper ||
      !isScrollReady
    ) {
      return
    }

    let flipContext: ReturnType<typeof gsap.context> | undefined
    const refreshCall = gsap
      .delayedCall(0, () => ScrollTrigger.refresh())
      .pause()

    const createTween = () => {
      flipContext?.revert()
      gallery.classList.remove('gallery--final')

      flipContext = gsap.context(() => {
        gallery.classList.add('gallery--final')
        const flipState = Flip.getState(galleryItems)
        gallery.classList.remove('gallery--final')

        const flip = Flip.to(flipState, {
          simple: true,
          ease: ExpoScaleEase.config(1, 5),
        })

        gsap
          .timeline({
            scrollTrigger: {
              trigger: gallery,
              start: 'center center',
              end: '+=100%',
              scrub: true,
              pin: galleryWrapper,
            },
          })
          .add(flip)

        return () => gsap.set(galleryItems, { clearProps: 'all' })
      }, gallery)

      refreshCall.restart(true)
    }

    const galleryItems = Array.from(
      gallery.querySelectorAll<HTMLElement>('.gallery__item'),
    )
    const resizeCall = gsap.delayedCall(0.2, createTween).pause()
    const handleResize = () => resizeCall.restart(true)

    createTween()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeCall.kill()
      refreshCall.kill()
      flipContext?.revert()
      gallery.classList.remove('gallery--final')
    }
  }, [enhancedScrollEnabled, galleryRef, galleryWrapperRef, isScrollReady])
}
