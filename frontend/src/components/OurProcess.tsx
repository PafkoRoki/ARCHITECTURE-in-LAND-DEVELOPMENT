import { useId } from 'react'
import {
  PROCESS_HEADING,
  PROCESS_STEPS,
} from '../content/landingPageContent'
import { Timeline } from './Timeline'
import type { TimelineEntry } from './Timeline'
import { TypingHeading } from './TypingHeading'

type OurProcessProps = Readonly<{
  isScrollReady: boolean
}>

const PROCESS_TIMELINE_DATA: readonly TimelineEntry[] = PROCESS_STEPS.map(
  (step) => ({
    id: step.number,
    marker: step.number,
    title: step.title,
    content: (
      <div className="our-process__entry">
        <p className="our-process__description">{step.description}</p>
        <div className="our-process__image-frame" aria-hidden="true">
          <img
            className="our-process__image"
            src={step.image}
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </div>
      </div>
    ),
  }),
)

export function OurProcess({ isScrollReady }: OurProcessProps) {
  const headingId = useId()

  return (
    <section className="our-process" aria-labelledby={headingId}>
      <div className="our-process__wrapper">
        <header className="our-process__header">
          <h2
            id={headingId}
            className="our-process__heading"
            aria-label={PROCESS_HEADING}
          >
            <TypingHeading text={PROCESS_HEADING} />
          </h2>
        </header>

        <Timeline
          data={PROCESS_TIMELINE_DATA}
          isScrollReady={isScrollReady}
        />
      </div>
    </section>
  )
}
