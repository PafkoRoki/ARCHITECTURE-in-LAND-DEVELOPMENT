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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useLayoutEffect(() => {
    const wrapper = smoothWrapperRef.current
    const content = smoothContentRef.current

    if (!wrapper || !content) return

    const media = gsap.matchMedia()
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    const syncMotionPreference = () => {
      setPrefersReducedMotion(reducedMotion.matches)
    }

    syncMotionPreference()
    reducedMotion.addEventListener('change', syncMotionPreference)

    media.add(SMOOTH_MOTION_QUERY, () => {
      const smoother = ScrollSmoother.create({
        wrapper,
        content,
        smooth: 1,
        smoothTouch: 0,
      })

      return () => smoother.kill()
    })

    return () => {
      reducedMotion.removeEventListener('change', syncMotionPreference)
      media.revert()
    }
  }, [])

  return (
    <>
      <AppLoader />
      <div id="smooth-wrapper" ref={smoothWrapperRef}>
        <div id="smooth-content" ref={smoothContentRef}>
          <ScrubbedBentoGallery
            key={prefersReducedMotion ? 'reduced-motion' : 'smooth-motion'}
          />
        </div>
      </div>
    </>
  )
}

export default App
