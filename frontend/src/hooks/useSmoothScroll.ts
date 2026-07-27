import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollSmoother, ScrollTrigger } from '../lib/gsap'
import {
  ENHANCED_SCROLL_QUERY,
  REDUCED_MOTION_QUERY,
} from '../lib/responsiveMotion'

type InitialScrollStyles = Readonly<{
  documentElement: string
  body: string
  wrapper: string
  content: string
}>

type UseSmoothScrollOptions = Readonly<{
  enabled: boolean
}>

export function useSmoothScroll({ enabled }: UseSmoothScrollOptions) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const initialScrollStylesRef = useRef<InitialScrollStyles>(null)
  const [isScrollReady, setIsScrollReady] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )
  const [enhancedScrollEnabled, setEnhancedScrollEnabled] = useState(() =>
    window.matchMedia(ENHANCED_SCROLL_QUERY).matches,
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

    const restoreInitialStyles = () => {
      const styles = initialScrollStylesRef.current

      if (!styles) return

      document.documentElement.style.cssText = styles.documentElement
      document.body.style.cssText = styles.body
      wrapper.style.cssText = styles.wrapper
      content.style.cssText = styles.content
    }

    const media = gsap.matchMedia()
    media.add(
      {
        all: 'all',
        reduced: REDUCED_MOTION_QUERY,
        enhanced: ENHANCED_SCROLL_QUERY,
      },
      (context) => {
        setPrefersReducedMotion(Boolean(context.conditions?.reduced))
        setEnhancedScrollEnabled(Boolean(context.conditions?.enhanced))

        if (!enabled || !context.conditions?.enhanced) return

        const smoother = ScrollSmoother.create({
          wrapper,
          content,
          smooth: 1,
          smoothTouch: 0,
        })

        return () => {
          smoother.kill()
          restoreInitialStyles()
        }
      },
    )

    if (!enabled) {
      restoreInitialStyles()
    }

    const contentFrame = window.requestAnimationFrame(() => {
      setIsScrollReady(enabled)
    })

    return () => {
      window.cancelAnimationFrame(contentFrame)
      media.revert()
      restoreInitialStyles()
    }
  }, [enabled])

  useLayoutEffect(() => {
    const styles = initialScrollStylesRef.current
    const wrapper = wrapperRef.current
    const content = contentRef.current

    if (
      !isScrollReady ||
      enhancedScrollEnabled ||
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
    const refreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => window.cancelAnimationFrame(refreshFrame)
  }, [enhancedScrollEnabled, isScrollReady])

  return {
    wrapperRef,
    contentRef,
    enhancedScrollEnabled,
    isScrollReady,
    prefersReducedMotion,
  }
}
