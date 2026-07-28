import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import './AnimatedTestimonials.css'

export type Testimonial = Readonly<{
  quote: string
  name: string
  designation: string
  src: string
}>

export type AnimatedTestimonialsProps = Readonly<{
  testimonials: readonly Testimonial[]
  autoplay?: boolean
}>

const CARD_ROTATIONS = [-8, 6, -4, 8, -6] as const
const AUTOPLAY_INTERVAL = 5000

export function AnimatedTestimonials({
  testimonials,
  autoplay = false,
}: AnimatedTestimonialsProps) {
  const [active, setActive] = useState(0)
  const prefersReducedMotion = Boolean(useReducedMotion())
  const testimonialCount = testimonials.length

  const handleNext = useCallback(() => {
    if (testimonialCount < 2) return
    setActive((current) => {
      const normalized = current < testimonialCount ? current : 0
      return (normalized + 1) % testimonialCount
    })
  }, [testimonialCount])

  const handlePrevious = useCallback(() => {
    if (testimonialCount < 2) return
    setActive((current) => {
      const normalized = current < testimonialCount ? current : 0
      return (normalized - 1 + testimonialCount) % testimonialCount
    })
  }, [testimonialCount])

  useEffect(() => {
    if (!autoplay || prefersReducedMotion || testimonialCount < 2) {
      return
    }

    const interval = window.setInterval(handleNext, AUTOPLAY_INTERVAL)
    return () => window.clearInterval(interval)
  }, [autoplay, handleNext, prefersReducedMotion, testimonialCount])

  if (testimonialCount === 0) return null

  const safeActive = active < testimonialCount ? active : 0
  const currentTestimonial = testimonials[safeActive]

  return (
    <div className="animated-testimonials">
      <div className="animated-testimonials__layout">
        <div className="animated-testimonials__stage">
          {testimonials.map((testimonial, index) => {
            const isActive = index === safeActive
            const relativeIndex =
              (index - safeActive + testimonialCount) % testimonialCount
            const restingRotation =
              CARD_ROTATIONS[relativeIndex % CARD_ROTATIONS.length]

            return (
              <motion.figure
                className="animated-testimonials__card"
                key={`${testimonial.src}-${testimonial.name}`}
                initial={
                  prefersReducedMotion
                    ? false
                    : {
                        opacity: 0,
                        rotate: restingRotation,
                        scale: 0.9,
                        z: -100,
                      }
                }
                animate={
                  prefersReducedMotion
                    ? {
                        opacity: isActive ? 1 : 0,
                        rotate: 0,
                        scale: 1,
                        z: 0,
                        zIndex: isActive ? 40 : 0,
                      }
                    : {
                        opacity: isActive ? 1 : 0.68,
                        rotate: isActive ? 0 : restingRotation,
                        scale: isActive ? 1 : 0.94,
                        z: isActive ? 0 : -100,
                        zIndex: isActive
                          ? 40
                          : testimonialCount + 2 - relativeIndex,
                        y: isActive ? [0, -56, 0] : 0,
                      }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.4, ease: 'easeInOut' }
                }
                aria-hidden={!isActive}
              >
                <img
                  className="animated-testimonials__image"
                  src={testimonial.src}
                  alt={`${testimonial.name} project`}
                  draggable="false"
                />
              </motion.figure>
            )
          })}
        </div>

        <div className="animated-testimonials__content">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="animated-testimonials__copy"
              key={`${safeActive}-${currentTestimonial.name}`}
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -20 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.2, ease: 'easeInOut' }
              }
              aria-live="polite"
              aria-atomic="true"
            >
              <h3 className="animated-testimonials__name">
                {currentTestimonial.name}
              </h3>
              <p className="animated-testimonials__designation">
                {currentTestimonial.designation}
              </p>
              <blockquote className="animated-testimonials__quote">
                {prefersReducedMotion ? (
                  currentTestimonial.quote
                ) : (
                  <>
                    <span className="animated-testimonials__sr-only">
                      {currentTestimonial.quote}
                    </span>
                    <span aria-hidden="true">
                      {currentTestimonial.quote
                        .split(' ')
                        .map((word, index) => (
                          <motion.span
                            className="animated-testimonials__word"
                            key={`${word}-${index}`}
                            initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.02 * index,
                              duration: 0.2,
                              ease: 'easeInOut',
                            }}
                          >
                            {word}&nbsp;
                          </motion.span>
                        ))}
                    </span>
                  </>
                )}
              </blockquote>
            </motion.div>
          </AnimatePresence>

          {testimonialCount > 1 ? (
            <div
              className="animated-testimonials__controls"
              aria-label="Testimonial navigation"
            >
              <button
                className="animated-testimonials__control"
                type="button"
                aria-label="Previous testimonial"
                onClick={handlePrevious}
              >
                <IconArrowLeft aria-hidden="true" stroke={1.75} />
              </button>
              <p className="animated-testimonials__counter" aria-hidden="true">
                {String(safeActive + 1).padStart(2, '0')} /{' '}
                {String(testimonialCount).padStart(2, '0')}
              </p>
              <button
                className="animated-testimonials__control"
                type="button"
                aria-label="Next testimonial"
                onClick={handleNext}
              >
                <IconArrowRight aria-hidden="true" stroke={1.75} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
