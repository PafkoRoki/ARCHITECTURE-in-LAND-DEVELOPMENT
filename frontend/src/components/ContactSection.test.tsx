import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CONTACT_TESTIMONIALS } from '../content/landingPageContent'
import { ContactSection } from './ContactSection'

const testimonialMocks = vi.hoisted(() => ({
  props: vi.fn(),
}))

vi.mock('./AnimatedTestimonials', async () => {
  const React = await import('react')

  return {
    AnimatedTestimonials: (props: Readonly<{
      autoplay?: boolean
      testimonials: readonly {
        designation: string
        name: string
        quote: string
        src: string
      }[]
    }>) => {
      testimonialMocks.props(props)

      return React.createElement(
        'ol',
        { 'data-testid': 'testimonial-samples' },
        props.testimonials.map((testimonial) =>
          React.createElement(
            'li',
            { key: testimonial.name },
            testimonial.name,
            testimonial.quote,
          ),
        ),
      )
    },
  }
})

const EXPECTED_TESTIMONIALS = [
  {
    name: 'Property developer',
    designation: 'Illustrative testimonial',
    quote:
      'The team turned a complex site into a clear visual story that made early decisions easier for everyone involved.',
  },
  {
    name: 'Architecture studio',
    designation: 'Illustrative testimonial',
    quote:
      'The process was clear from the first brief, and the final images captured both the architecture and the atmosphere.',
  },
  {
    name: 'Design team',
    designation: 'Illustrative testimonial',
    quote:
      'Their architectural perspective brought precision, credibility, and a strong sense of place to every visualization.',
  },
] as const

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ContactSection', () => {
  it('keeps the ordered illustrative testimonials centralized in content', () => {
    expect(
      CONTACT_TESTIMONIALS.map(({ designation, name, quote }) => ({
        designation,
        name,
        quote,
      })),
    ).toEqual(EXPECTED_TESTIMONIALS)

    CONTACT_TESTIMONIALS.forEach(({ src }) => {
      expect(src).toMatch(/\.(?:jpg|png)$/)
    })
  })

  it('renders the exact contact copy, accessible required fields, and sample disclosure', () => {
    render(<ContactSection />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Start a project' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Tell us what you have in mind. We\u2019ll get back to you with the next steps.',
      ),
    ).toBeInTheDocument()

    const email = screen.getByLabelText('Email address.')
    const brief = screen.getByLabelText('What would you like to create?')

    expect(email).toHaveAttribute('type', 'email')
    expect(email).toBeRequired()
    expect(brief).toBeRequired()
    expect(screen.getByRole('button', { name: 'Send inquiry' })).toHaveAttribute(
      'type',
      'submit',
    )

    expect(screen.getByText('Opinie')).toBeInTheDocument()
    expect(
      screen.getAllByRole('listitem').map((item) => item.textContent),
    ).toEqual(
      EXPECTED_TESTIMONIALS.map(({ name, quote }) => `${name}${quote}`),
    )
    expect(testimonialMocks.props).toHaveBeenLastCalledWith(
      expect.objectContaining({
        autoplay: false,
        testimonials: CONTACT_TESTIMONIALS,
      }),
    )
  })

  it('validates email format and prevents a presentational submit without clearing values or making a request', () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactSection />)

    const email = screen.getByLabelText<HTMLInputElement>('Email address.')
    const brief = screen.getByLabelText<HTMLTextAreaElement>(
      'What would you like to create?',
    )
    const form = email.closest('form')

    expect(form).not.toBeNull()
    expect(form).not.toHaveAttribute('action')

    fireEvent.change(email, { target: { value: 'not-an-email' } })
    expect(email).toBeInvalid()

    fireEvent.change(email, { target: { value: 'hello@example.com' } })
    fireEvent.change(brief, {
      target: { value: 'A mixed-use neighborhood concept' },
    })
    expect(email).toBeValid()

    const submitEvent = createEvent.submit(form as HTMLFormElement)
    fireEvent(form as HTMLFormElement, submitEvent)

    expect(submitEvent.defaultPrevented).toBe(true)
    expect(email).toHaveValue('hello@example.com')
    expect(brief).toHaveValue('A mixed-use neighborhood concept')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(
      screen.queryByText(/thank you|success|submitted/i),
    ).not.toBeInTheDocument()
  })
})
