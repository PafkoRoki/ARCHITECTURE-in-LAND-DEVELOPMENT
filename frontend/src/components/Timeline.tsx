import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'

export type TimelineEntry = Readonly<{
  id: string
  marker: string
  title: string
  content: ReactNode
}>

export type TimelineProps = Readonly<{
  data: readonly TimelineEntry[]
  isScrollReady: boolean
}>

type AnimatedTimelineProgressProps = Readonly<{
  containerRef: RefObject<HTMLDivElement | null>
  height: number
}>

function AnimatedTimelineProgress({
  containerRef,
  height,
}: AnimatedTimelineProgressProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  })
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <motion.div
      className="timeline__progress"
      data-timeline-progress
      style={{ height: heightTransform, opacity: opacityTransform }}
    />
  )
}

export function Timeline({ data, isScrollReady }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const [height, setHeight] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const list = listRef.current

    if (!list) return

    const updateHeight = () => {
      setHeight(list.getBoundingClientRect().height)
    }

    updateHeight()

    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(updateHeight)
    observer.observe(list)

    return () => observer.disconnect()
  }, [data])

  const isAnimated = isScrollReady && prefersReducedMotion === false

  return (
    <div
      ref={containerRef}
      className="timeline"
      data-timeline-animated={isAnimated ? 'true' : 'false'}
    >
      <div className="timeline__body">
        <ol ref={listRef} className="timeline__list">
          {data.map((entry) => (
            <li className="timeline__item" key={entry.id}>
              <div className="timeline__sticky">
                <span className="timeline__marker" aria-hidden="true">
                  {entry.marker}
                </span>
                <h3 className="timeline__title">{entry.title}</h3>
              </div>
              <div className="timeline__content">{entry.content}</div>
            </li>
          ))}
        </ol>

        <div
          className="timeline__rail"
          style={{ height }}
          aria-hidden="true"
        >
          {isAnimated ? (
            <AnimatedTimelineProgress
              containerRef={containerRef}
              height={height}
            />
          ) : (
            <div
              className="timeline__progress"
              data-timeline-progress
              style={{ height, opacity: 1 }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
