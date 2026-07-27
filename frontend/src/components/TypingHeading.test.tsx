import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TypingHeading } from './TypingHeading'

const motionMocks = vi.hoisted(() => ({
  inView: false,
  prefersReducedMotion: false,
  useInView: vi.fn(),
  useReducedMotion: vi.fn(),
}))

vi.mock('motion/react', async () => {
  const React = await import('react')

  function MotionSpan(props: Record<string, unknown>) {
    const domProps = { ...props }
    const animate = domProps.animate

    delete domProps.animate
    delete domProps.variants

    return React.createElement('span', {
      ...domProps,
      'data-animation-state': animate,
    })
  }

  return {
    motion: { span: MotionSpan },
    useInView: motionMocks.useInView,
    useReducedMotion: motionMocks.useReducedMotion,
  }
})

function HeadingHarness({ text }: Readonly<{ text: string }>) {
  return (
    <h2 aria-label={text}>
      <TypingHeading text={text} />
    </h2>
  )
}

beforeEach(() => {
  vi.useFakeTimers()
  motionMocks.inView = false
  motionMocks.prefersReducedMotion = false
  motionMocks.useInView.mockImplementation(() => motionMocks.inView)
  motionMocks.useReducedMotion.mockImplementation(
    () => motionMocks.prefersReducedMotion,
  )
})

describe('TypingHeading', () => {
  it('types once on first view and leaves the completed heading in place', async () => {
    const text = 'Type'
    const view = render(<HeadingHarness text={text} />)
    const animatedText = view.container.querySelector(
      '[data-slot="typing-text"]',
    )
    const cursor = view.container.querySelector(
      '[data-slot="typing-text-cursor"]',
    )

    expect(animatedText).toHaveTextContent('')
    expect(cursor).toHaveAttribute('data-animation-state', 'blinking')
    expect(motionMocks.useInView).toHaveBeenCalledWith(
      expect.anything(),
      { once: true, margin: '0px' },
    )

    motionMocks.inView = true
    view.rerender(<HeadingHarness text={text} />)
    await act(async () => vi.advanceTimersByTimeAsync(0))

    expect(cursor).toHaveAttribute('data-animation-state', 'visible')

    await act(async () => vi.advanceTimersByTimeAsync(100))
    expect(animatedText).toHaveTextContent('T')

    await act(async () =>
      vi.advanceTimersByTimeAsync(text.length * 100),
    )
    expect(animatedText).toHaveTextContent(text)
    expect(cursor).toHaveAttribute('data-animation-state', 'blinking')

    motionMocks.inView = false
    view.rerender(<HeadingHarness text={text} />)
    motionMocks.inView = true
    view.rerender(<HeadingHarness text={text} />)
    await act(async () => vi.advanceTimersByTimeAsync(1_000))

    expect(animatedText).toHaveTextContent(text)
  })

  it('keeps the full accessible name while visual text is still typing', async () => {
    const text = 'Accessible heading'
    const view = render(<HeadingHarness text={text} />)

    expect(
      screen.getByRole('heading', { level: 2, name: text }),
    ).toBeInTheDocument()
    expect(
      view.container.querySelector('.typing-heading'),
    ).toHaveAttribute('aria-hidden', 'true')

    motionMocks.inView = true
    view.rerender(<HeadingHarness text={text} />)
    await act(async () => vi.advanceTimersByTimeAsync(100))

    expect(
      screen.getByRole('heading', { level: 2, name: text }),
    ).toBeInTheDocument()
  })

  it('renders complete static text without a cursor for reduced motion', () => {
    const text = 'Static heading'
    motionMocks.prefersReducedMotion = true

    const view = render(<HeadingHarness text={text} />)

    expect(
      screen.getByRole('heading', { level: 2, name: text }),
    ).toBeInTheDocument()
    expect(
      view.container.querySelector('.typing-heading__static'),
    ).toHaveTextContent(text)
    expect(
      view.container.querySelector('[data-slot="typing-text"]'),
    ).not.toBeInTheDocument()
    expect(
      view.container.querySelector('[data-slot="typing-text-cursor"]'),
    ).not.toBeInTheDocument()
  })
})
