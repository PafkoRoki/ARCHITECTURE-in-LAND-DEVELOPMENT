import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { ExpoScaleEase } from 'gsap/EasePack'
import { Flip } from 'gsap/Flip'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import architectsImage from '../assets/architects.jpg'
import cityImage from '../assets/city.png'
import houseImage from '../assets/house.jpg'
import houseArchitectImage from '../assets/house_architect.jpg'
import housesImage from '../assets/houses.png'
import poznanImage from '../assets/poznan.jpg'
import renderImage from '../assets/render.png'
import visualizationImage from '../assets/visualization.jpg'
import './ScrubbedBentoGallery.css'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip, ExpoScaleEase)

const GALLERY_IMAGES = [
  poznanImage,
  cityImage,
  architectsImage,
  houseArchitectImage,
  housesImage,
  renderImage,
  houseImage,
  visualizationImage,
] as const

const ARTICLE_COPY =
  'Architecture gives land development its structure, identity, and long-term value. Thoughtful design connects buildings to landscape, movement, and community while turning constraints into opportunities.'

const ARTICLE_PARAGRAPHS = [
  ARTICLE_COPY,
  'Every site begins with its own conditions: orientation, access, topography, context, and the needs of the people who will use it. Reading those conditions carefully allows a project to feel rooted in place rather than imposed upon it.',
  'From the first study to the final visualization, a clear architectural idea helps align planning, design, and development decisions. The result is a coherent environment that works at every scale.',
  'Land development is often described through numbers: area, density, yield, cost, and time. Architecture translates those measurements into lived experience. It determines how a street feels at walking pace, where daylight reaches a room, how a courtyard is shared, and whether a new district develops an identity that people can recognize and value.',
  'A successful plan balances private ambition with public value. Buildings may define the commercial character of a project, but the spaces between them determine how the development connects to its surroundings. Streets, squares, paths, planting, and thresholds form a continuous public realm that can invite activity, support safety, and make everyday movement intuitive.',
  'Density is most effective when it is treated as a design opportunity rather than a target in isolation. Compact development can support public transport, local services, and active streets, yet its quality depends on proportion, daylight, privacy, and access to open space. Architecture makes density legible by shaping mass into a sequence of places with distinct scales and uses.',
  'Landscape is not the remainder left after buildings are positioned. It is a primary system that manages water, moderates temperature, supports biodiversity, and gives a project seasonal character. When landscape and architecture are developed together, ecological performance becomes part of the spatial experience instead of an engineering layer added near the end of the process.',
  'Ultimately, architecture gives development a direction beyond short-term delivery. It connects commercial objectives with environmental performance, social life, and a lasting sense of place. When those priorities reinforce one another, land becomes more than a collection of plots: it becomes a framework for buildings, landscapes, and communities to mature together.',
] as const

type WhyWorkWithUsBenefit = Readonly<{
  number: string
  title: string
  description: string
  image: string
}>

type WhyWorkWithUsContent = readonly [
  heading: string,
  benefits: readonly [
    WhyWorkWithUsBenefit,
    WhyWorkWithUsBenefit,
    WhyWorkWithUsBenefit,
    WhyWorkWithUsBenefit,
  ],
]

const WHY_WORK_WITH_US_CONTENT = [
  'Why work with\u00A0us?',
  [
    {
      number: '01',
      title: 'Endless creative potential for\u00A0bold ideas',
      description:
        'Your vision sets the scale – we match it. Whether shaping skyline, launching a product line, or building a brand, our 3D visualization services scale with\u00A0your ambition.',
      image: poznanImage,
    },
    {
      number: '02',
      title: 'Fast delivery. Clear process. No surprises',
      description:
        'Our efficient workflows and clear communication ensure fast delivery with no unexpected delays. You stay informed about progress, next steps, and delivery times.',
      image: houseArchitectImage,
    },
    {
      number: '03',
      title: 'Global vision. Local insight',
      description:
        'With clients worldwide, we bring a global perspective while respecting local nuance. From regional architecture to\u00A0international design trends, we craft visuals that speak to\u00A0your market and stand out globally.',
      image: renderImage,
    },
    {
      number: '04',
      title: 'Architectural expertise at\u00A0our foundation',
      description:
        'With architects and\u00A0designers on our team, we understand structure and essence, bringing your vision to\u00A0life with authenticity and\u00A0depth.',
      image: architectsImage,
    },
  ],
] as const satisfies WhyWorkWithUsContent

const [WHY_WORK_WITH_US_HEADING, WHY_WORK_WITH_US_BENEFITS] =
  WHY_WORK_WITH_US_CONTENT
const WHY_WORK_WITH_US_ANIMATION_QUERY =
  '(min-width: 480px) and (prefers-reduced-motion: no-preference)'

type ScrollReadyProps = Readonly<{
  isScrollReady: boolean
}>

function WhyWorkWithUs({ isScrollReady }: ScrollReadyProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<gsap.core.Timeline>(null)
  const scrollTweenRef = useRef<gsap.core.Tween>(null)
  const idPrefix = useId()
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

    let animationContext: gsap.Context | undefined
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
  }, [isAnimated, isScrollReady])

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

  return (
    <section
      ref={sectionRef}
      className={`why-work-with-us${
        isAnimated ? ' why-work-with-us--animated' : ''
      }`}
      aria-labelledby={`${idPrefix}-heading`}
    >
      <div className="why-work-with-us__wrapper">
        <div className="why-work-with-us__content">
          <h2
            id={`${idPrefix}-heading`}
            className="why-work-with-us__heading"
          >
            {WHY_WORK_WITH_US_HEADING}
          </h2>

          <div className="why-work-with-us__list-wrapper">
            <ol className="why-work-with-us__list">
              {WHY_WORK_WITH_US_BENEFITS.map((benefit, index) => {
                const bodyId = `${idPrefix}-benefit-${benefit.number}`
                const titleId = `${bodyId}-title`

                return (
                  <li
                    className="why-work-with-us__item"
                    key={benefit.number}
                  >
                    {isAnimated ? (
                      <h3 className="why-work-with-us__title-shell">
                        <button
                          id={titleId}
                          className="why-work-with-us__header why-work-with-us__control"
                          type="button"
                          aria-expanded={activeIndex === index}
                          aria-controls={bodyId}
                          data-why-work-with-us-header
                          onClick={() => scrollToBenefit(index)}
                          onKeyDown={(event) => {
                            if (event.key !== 'Enter' && event.key !== ' ') {
                              return
                            }

                            event.preventDefault()
                            scrollToBenefit(index)
                          }}
                        >
                          <span className="why-work-with-us__number">
                            <span className="why-work-with-us__number-text">
                              {benefit.number}
                            </span>
                            {index > 0 ? (
                              <span
                                className="why-work-with-us__number-background"
                                aria-hidden="true"
                              />
                            ) : null}
                          </span>
                          <span className="why-work-with-us__title">
                            {benefit.title}
                          </span>
                        </button>
                      </h3>
                    ) : (
                      <div
                        className="why-work-with-us__header"
                        data-why-work-with-us-header
                      >
                        <span className="why-work-with-us__number">
                          <span className="why-work-with-us__number-text">
                            {benefit.number}
                          </span>
                          {index > 0 ? (
                            <span
                              className="why-work-with-us__number-background"
                              aria-hidden="true"
                            />
                          ) : null}
                        </span>
                        <h3
                          id={titleId}
                          className="why-work-with-us__title"
                        >
                          {benefit.title}
                        </h3>
                      </div>
                    )}

                    <div
                      id={bodyId}
                      className="why-work-with-us__body"
                      role={isAnimated ? 'region' : undefined}
                      aria-labelledby={isAnimated ? titleId : undefined}
                      aria-hidden={
                        isAnimated ? activeIndex !== index : undefined
                      }
                    >
                      <p className="why-work-with-us__description">
                        {benefit.description}
                      </p>
                    </div>

                    <span
                      className="why-work-with-us__divider"
                      aria-hidden="true"
                    />
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="why-work-with-us__images" aria-hidden="true">
          {WHY_WORK_WITH_US_BENEFITS.map((benefit) => (
            <img
              className="why-work-with-us__image"
              src={benefit.image}
              alt=""
              draggable="false"
              key={benefit.number}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/*
 * Scrubbed Bento Gallery by GreenSock:
 * https://codepen.io/GreenSock/pen/vYMzKZx
 * Public Pen source used under the MIT license.
 */
function ScrubbedBentoGallery({ isScrollReady }: ScrollReadyProps) {
  const galleryRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const gallery = galleryRef.current
    const galleryWrap = gallery?.parentElement

    if (!gallery || !galleryWrap || !isScrollReady) return

    const galleryItems = Array.from(
      gallery.querySelectorAll<HTMLElement>('.gallery__item'),
    )
    let flipContext: gsap.Context | undefined
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
              pin: galleryWrap,
            },
          })
          .add(flip)

        return () => gsap.set(galleryItems, { clearProps: 'all' })
      }, gallery)

      refreshCall.restart(true)
    }

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
  }, [isScrollReady])

  return (
    <main>
      <div className="gallery-wrap" aria-hidden="true">
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

      <article className="gallery-copy">
        <h2>Architecture in land development</h2>
        {ARTICLE_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <WhyWorkWithUs isScrollReady={isScrollReady} />
    </main>
  )
}

export default ScrubbedBentoGallery
