import { useId, useRef } from 'react'
import {
  WHY_WORK_WITH_US_BENEFITS,
  WHY_WORK_WITH_US_HEADING,
} from '../content/landingPageContent'
import type { WhyWorkWithUsBenefit } from '../content/landingPageContent'
import { useWhyWorkWithUsAnimation } from '../hooks/useWhyWorkWithUsAnimation'
import { TypingHeading } from './TypingHeading'

type BenefitItemProps = Readonly<{
  activeIndex: number
  benefit: WhyWorkWithUsBenefit
  bodyId: string
  index: number
  isAnimated: boolean
  onSelect: (index: number) => void
  titleId: string
}>

function BenefitItem({
  activeIndex,
  benefit,
  bodyId,
  index,
  isAnimated,
  onSelect,
  titleId,
}: BenefitItemProps) {
  return (
    <li className="why-work-with-us__item">
      {isAnimated ? (
        <h3 className="why-work-with-us__title-shell">
          <button
            id={titleId}
            className="why-work-with-us__header why-work-with-us__control"
            type="button"
            aria-expanded={activeIndex === index}
            aria-controls={bodyId}
            data-why-work-with-us-header
            onClick={() => onSelect(index)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') {
                return
              }

              event.preventDefault()
              onSelect(index)
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
          <h3 id={titleId} className="why-work-with-us__title">
            {benefit.title}
          </h3>
        </div>
      )}

      <div
        id={bodyId}
        className="why-work-with-us__body"
        role={isAnimated ? 'region' : undefined}
        aria-labelledby={isAnimated ? titleId : undefined}
        aria-hidden={isAnimated ? activeIndex !== index : undefined}
      >
        <p className="why-work-with-us__description">
          {benefit.description}
        </p>
      </div>

      <span className="why-work-with-us__divider" aria-hidden="true" />
    </li>
  )
}

type WhyWorkWithUsProps = Readonly<{
  id?: string
  isScrollReady: boolean
}>

export function WhyWorkWithUs({ id, isScrollReady }: WhyWorkWithUsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const idPrefix = useId()
  const { activeIndex, isAnimated, scrollToBenefit } =
    useWhyWorkWithUsAnimation({ isScrollReady, sectionRef })

  return (
    <section
      ref={sectionRef}
      id={id}
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
            aria-label={WHY_WORK_WITH_US_HEADING}
          >
            <TypingHeading text={WHY_WORK_WITH_US_HEADING} />
          </h2>

          <div className="why-work-with-us__list-wrapper">
            <ol className="why-work-with-us__list">
              {WHY_WORK_WITH_US_BENEFITS.map((benefit, index) => {
                const bodyId = `${idPrefix}-benefit-${benefit.number}`
                const titleId = `${bodyId}-title`

                return (
                  <BenefitItem
                    activeIndex={activeIndex}
                    benefit={benefit}
                    bodyId={bodyId}
                    index={index}
                    isAnimated={isAnimated}
                    key={benefit.number}
                    onSelect={scrollToBenefit}
                    titleId={titleId}
                  />
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
