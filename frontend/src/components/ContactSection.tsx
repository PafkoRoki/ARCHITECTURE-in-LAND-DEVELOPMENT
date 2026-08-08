import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import {
  CONTACT_CONTENT,
  CONTACT_TESTIMONIALS,
} from '../content/landingPageContent'
import { AnimatedTestimonials } from './AnimatedTestimonials'

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const idPrefix = useId()
  const headingId = `${idPrefix}-heading`
  const emailId = `${idPrefix}-email`
  const projectId = `${idPrefix}-project`

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <section className="contact-section" aria-labelledby={headingId}>
      <div className="contact-section__wrapper">
        <div className="contact-section__form-panel">
          <header className="contact-section__header">
            <h2 id={headingId} className="contact-section__heading">
              {CONTACT_CONTENT.heading}
            </h2>
            <p className="contact-section__supporting-text">
              {CONTACT_CONTENT.supportingText}
            </p>
          </header>

          <form
            className="contact-section__form"
            aria-label="Project inquiry"
            onSubmit={handleSubmit}
          >
            <div className="contact-section__field">
              <label className="contact-section__label" htmlFor={emailId}>
                {CONTACT_CONTENT.emailLabel}
              </label>
              <input
                id={emailId}
                className="contact-section__input"
                type="email"
                name="email"
                autoComplete="email"
                required
              />
            </div>

            <div className="contact-section__field">
              <label className="contact-section__label" htmlFor={projectId}>
                {CONTACT_CONTENT.projectLabel}
              </label>
              <textarea
                id={projectId}
                className="contact-section__textarea"
                name="project-brief"
                rows={6}
                required
              />
            </div>

            <button
              className="contact-section__submit"
              type="submit"
              disabled={isSubmitted}
            >
              {CONTACT_CONTENT.submitLabel}
            </button>
            {isSubmitted ? (
              <p
                className="contact-section__success"
                role="status"
                aria-live="polite"
              >
                Thank you! Your inquiry has been received.
              </p>
            ) : null}
          </form>
        </div>

        <div
          className="contact-section__testimonials-panel"
          aria-label={CONTACT_CONTENT.sampleLabel}
        >
          <p className="contact-section__sample-label">
            {CONTACT_CONTENT.sampleLabel}
          </p>
          <AnimatedTestimonials
            testimonials={CONTACT_TESTIMONIALS}
            autoplay={false}
          />
        </div>
      </div>
    </section>
  )
}
