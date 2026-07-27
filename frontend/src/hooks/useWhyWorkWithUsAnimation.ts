import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  gsap,
  ScrollSmoother,
  ScrollTrigger,
} from '../lib/gsap'
import {
  WHY_WORK_WITH_US_ANIMATION_QUERY,
  WHY_WORK_WITH_US_BENEFITS,
} from '../content/landingPageContent'

type UseWhyWorkWithUsAnimationOptions = Readonly<{
  isScrollReady: boolean
  sectionRef: RefObject<HTMLElement | null>
}>

export function useWhyWorkWithUsAnimation({
  isScrollReady,
  sectionRef,
}: UseWhyWorkWithUsAnimationOptions) {
  const timelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null)
  const scrollTweenRef = useRef<ReturnType<typeof gsap.to> | null>(null)
  const [isAnimated, setIsAnimated] = useState(() =>
    window.matchMedia(WHY_WORK_WITH_US_ANIMATION_QUERY).matches,
  )
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const animationQuery = window.matchMedia(
      WHY_WORK_WITH_US_ANIMATION_QUERY,
    )
    const syncAnimationMode = () => {
      setIsAnimated(animationQuery.matches)

      if (!animationQuery.matches) setActiveIndex(0)
    }

    syncAnimationMode()
    animationQuery.addEventListener('change', syncAnimationMode)

    return () => {
      animationQuery.removeEventListener('change', syncAnimationMode)
    }
  }, [])

  useLayoutEffect(() => {
    const section = sectionRef.current

    if (!section || !isAnimated || !isScrollReady) return

    let animationContext: ReturnType<typeof gsap.context> | undefined
    let refreshTimeout: number | undefined

    const setupTimeout = window.setTimeout(() => {
      animationContext = gsap.context(() => {
        const wrapper = section.querySelector<HTMLElement>(
          '.why-work-with-us__wrapper',
        )
        const panels = Array.from(
          section.querySelectorAll<HTMLElement>('.why-work-with-us__item'),
        )
        const images = Array.from(
          section.querySelectorAll<HTMLImageElement>(
            '.why-work-with-us__image',
          ),
        )

        if (!wrapper || panels.length !== WHY_WORK_WITH_US_BENEFITS.length) {
          return
        }

        ScrollTrigger.create({
          trigger: wrapper,
          start: 'top top',
          endTrigger: section,
          end: 'bottom bottom',
          pin: true,
          invalidateOnRefresh: true,
        })

        gsap.set(panels, {
          zIndex: (index) => index,
        })
        gsap.set(images, {
          opacity: (index) => (index === 0 ? 1 : 0),
        })

        const syncActiveIndex = (progress: number) => {
          const nextIndex = Math.min(
            panels.length - 1,
            Math.max(0, Math.floor(progress * panels.length - 0.01)),
          )

          setActiveIndex((currentIndex) =>
            currentIndex === nextIndex ? currentIndex : nextIndex,
          )
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / panels.length,
              duration: 1,
              ease: 'power4.inOut',
            },
            onUpdate: ({ progress }) => syncActiveIndex(progress),
          },
        })

        let previous:
          | {
              body: HTMLElement
              divider: HTMLElement
              header: HTMLElement
            }
          | undefined

        panels.forEach((panel, index) => {
          const body = panel.querySelector<HTMLElement>(
            '.why-work-with-us__body',
          )
          const divider = panel.querySelector<HTMLElement>(
            '.why-work-with-us__divider',
          )
          const header = panel.querySelector<HTMLElement>(
            '[data-why-work-with-us-header]',
          )
          const numberBackground = panel.querySelector<HTMLElement>(
            '.why-work-with-us__number-background',
          )

          if (!body || !divider || !header) return

          if (index > 0 && previous) {
            gsap.set(body, { height: 0 })

            timeline.to(
              body,
              {
                height: 'auto',
                duration: 1,
                ease: 'none',
              },
              index,
            )

            if (numberBackground) {
              timeline.to(
                numberBackground,
                {
                  opacity: 0,
                  duration: 1,
                  ease: 'none',
                },
                index,
              )
            }

            if (images[index]) {
              timeline.to(
                images[index],
                {
                  opacity: 1,
                  duration: 0.6,
                  ease: 'none',
                },
                index,
              )
            }

            timeline.to(
              previous.body,
              {
                height: 0,
                duration: 1,
                ease: 'none',
              },
              index,
            )
            timeline.to(
              previous.header,
              {
                opacity: 0.3,
                duration: 1,
                ease: 'none',
              },
              index,
            )
            timeline.to(
              previous.divider,
              {
                opacity: 0,
                duration: 1,
                ease: 'none',
              },
              index,
            )
          }

          timeline.to(
            divider,
            {
              width: '100%',
              duration: 1,
              ease: 'none',
            },
            index,
          )

          previous = { body, divider, header }
        })

        timelineRef.current = timeline
        syncActiveIndex(timeline.scrollTrigger?.progress ?? 0)
      }, section)

      refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 0)
    }, 0)

    return () => {
      window.clearTimeout(setupTimeout)
      if (refreshTimeout !== undefined) window.clearTimeout(refreshTimeout)
      scrollTweenRef.current?.kill()
      scrollTweenRef.current = null
      timelineRef.current = null
      animationContext?.revert()
    }
  }, [isAnimated, isScrollReady, sectionRef])

  const scrollToBenefit = (index: number) => {
    const timelineScrollTrigger = timelineRef.current?.scrollTrigger

    if (!isAnimated || !timelineScrollTrigger) return

    const progress = (index + 1) / WHY_WORK_WITH_US_BENEFITS.length
    const target =
      timelineScrollTrigger.start +
      (timelineScrollTrigger.end - timelineScrollTrigger.start) * progress
    const boundedTarget = gsap.utils.clamp(
      0,
      ScrollTrigger.maxScroll(window),
      target,
    )
    const smoother = ScrollSmoother.get()

    scrollTweenRef.current?.kill()
    scrollTweenRef.current = smoother
      ? gsap.to(smoother, {
          scrollTop: boundedTarget,
          duration: 1,
          ease: 'power2.inOut',
          overwrite: 'auto',
        })
      : gsap.to(window, {
          scrollTo: boundedTarget,
          duration: 1,
          ease: 'power2.inOut',
          overwrite: 'auto',
        })
  }

  return { activeIndex, isAnimated, scrollToBenefit }
}
