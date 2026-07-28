import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollSmoother, ScrollTrigger } from '../lib/gsap'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const SMOOTH_MOTION_QUERY = '(prefers-reduced-motion: no-preference)'

type InitialScrollStyles = Readonly<{
  documentElement: string
  body: string
  wrapper: string
  content: string
}>

export function useSmoothScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const initialScrollStylesRef = useRef<InitialScrollStyles>(null)
  const [isScrollReady, setIsScrollReady] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current

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
    const wrapper = wrapperRef.current
    const content = contentRef.current

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

  return { wrapperRef, contentRef, isScrollReady, prefersReducedMotion }
}
