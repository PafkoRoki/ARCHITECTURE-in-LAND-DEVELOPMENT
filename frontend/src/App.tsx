import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AppLoader from './components/AppLoader'
import ScrubbedBentoGallery from './components/ScrubbedBentoGallery'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const SMOOTH_MOTION_QUERY = '(prefers-reduced-motion: no-preference)'

function App() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null)
  const smoothContentRef = useRef<HTMLDivElement>(null)
  const initialScrollStylesRef = useRef<{
    documentElement: string
    body: string
    wrapper: string
    content: string
  } | null>(null)
  const [isScrollReady, setIsScrollReady] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useLayoutEffect(() => {
    const wrapper = smoothWrapperRef.current
    const content = smoothContentRef.current

    if (!wrapper || !content) return

    initialScrollStylesRef.current ??= {
      documentElement: document.documentElement.style.cssText,
      body: document.body.style.cssText,
      wrapper: wrapper.style.cssText,
      content: content.style.cssText,
    }

    const media = gsap.matchMedia()
    media.add(
      {
        reduced: REDUCED_MOTION_QUERY,
        smooth: SMOOTH_MOTION_QUERY,
      },
      (context) => {
        setPrefersReducedMotion(Boolean(context.conditions?.reduced))

        if (!context.conditions?.smooth) return

        const smoother = ScrollSmoother.create({
          wrapper,
          content,
          smooth: 1,
          smoothTouch: 0,
        })

        return () => smoother.kill()
      },
    )

    const contentFrame = window.requestAnimationFrame(() => {
      setIsScrollReady(true)
    })

    return () => {
      window.cancelAnimationFrame(contentFrame)
      media.revert()
    }
  }, [])

  useLayoutEffect(() => {
    const styles = initialScrollStylesRef.current
    const wrapper = smoothWrapperRef.current
    const content = smoothContentRef.current

    if (
      !isScrollReady ||
      !prefersReducedMotion ||
      !styles ||
      !wrapper ||
      !content
    ) {
      return
    }

    document.documentElement.style.cssText = styles.documentElement
    document.body.style.cssText = styles.body
    wrapper.style.cssText = styles.wrapper
    content.style.cssText = styles.content
    ScrollTrigger.refresh()
  }, [isScrollReady, prefersReducedMotion])

  return (
    <>
      <AppLoader />
      <div id="smooth-wrapper" ref={smoothWrapperRef}>
        <div id="smooth-content" ref={smoothContentRef}>
          <ScrubbedBentoGallery
            key={prefersReducedMotion ? 'reduced-motion' : 'smooth-motion'}
            isScrollReady={isScrollReady}
          />
        </div>
      </div>
    </>
  )
}

export default App
