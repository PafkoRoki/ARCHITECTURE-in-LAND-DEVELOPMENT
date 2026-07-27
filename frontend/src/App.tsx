import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AppLoader from './components/AppLoader'
import ScrubbedBentoGallery from './components/ScrubbedBentoGallery'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

function App() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null)
  const smoothContentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrapper = smoothWrapperRef.current
    const content = smoothContentRef.current

    if (!wrapper || !content) return

    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const smoother = ScrollSmoother.create({
        wrapper,
        content,
        smooth: 1,
        smoothTouch: 0,
      })

      return () => smoother.kill()
    })

    return () => media.revert()
  }, [])

  return (
    <>
      <AppLoader />
      <div id="smooth-wrapper" ref={smoothWrapperRef}>
        <div id="smooth-content" ref={smoothContentRef}>
          <ScrubbedBentoGallery />
        </div>
      </div>
    </>
  )
}

export default App
