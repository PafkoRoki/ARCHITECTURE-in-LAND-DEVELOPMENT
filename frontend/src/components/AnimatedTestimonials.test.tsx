import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AnimatedTestimonials } from './AnimatedTestimonials'
import type { Testimonial } from './AnimatedTestimonials'

const motionMocks = vi.hoisted(() => ({
  prefersReducedMotion: false,
  renderedProps: [] as Array<{
    animate: unknown
    element: string
    exit: unknown
    initial: unknown
    transition: unknown
  }>,
  useReducedMotion: vi.fn<() => boolean>(),
}))

vi.mock('motion/react', async () => {
  const React = await import('react')
  const componentCache = new Map<
    string,
    (props: Record<string, unknown>) => React.ReactNode
  >()

  const motion = new Proxy<
    Record<string, (props: Record<string, unknown>) => React.ReactNode>
  >(
    {},
    {
      get: (_target, element: string) => {
        const cached = componentCache.get(element)

        if (cached) {
          return cached
        }

        const MotionElement = (props: Record<string, unknown>) => {
          motionMocks.renderedProps.push({
            animate: props.animate,
            element,
            exit: props.exit,
            initial: props.initial,
            transition: props.transition,
          })

          const domProps = { ...props }
          for (const property of [
            'animate',
            'custom',
            'exit',
            'initial',
            'layout',
            'layoutId',
            'transition',
            'variants',
            'whileHover',
            'whileTap',
          ]) {
            delete domProps[property]
          }

          return React.createElement(element, domProps)
        }

        componentCache.set(element, MotionElement)
        return MotionElement
      },
    },
  )

  return {
    AnimatePresence: ({ children }: Readonly<{ children: React.ReactNode }>) =>
      React.createElement(React.Fragment, null, children),
    motion,
    useReducedMotion: motionMocks.useReducedMotion,
  }
})

const TESTIMONIALS = [
  {
    quote: 'First testimonial quote.',
    name: 'First client',
    designation: 'Developer',
    src: '/first.jpg',
  },
  {
    quote: 'Second testimonial quote.',
    name: 'Second client',
    designation: 'Architect',
    src: '/second.jpg',
  },
  {
    quote: 'Third testimonial quote.',
    name: 'Third client',
    designation: 'Designer',
    src: '/third.jpg',
  },
] as const satisfies readonly Testimonial[]

beforeEach(() => {
  motionMocks.prefersReducedMotion = false
  motionMocks.renderedProps.length = 0
  motionMocks.useReducedMotion.mockImplementation(
    () => motionMocks.prefersReducedMotion,
  )
})

describe('AnimatedTestimonials', () => {
  it('announces the active testimonial and wraps both labelled controls', () => {
    const { container } = render(
      <AnimatedTestimonials testimonials={TESTIMONIALS} />,
    )
    const previous = screen.getByRole('button', {
      name: 'Previous testimonial',
    })
    const next = screen.getByRole('button', { name: 'Next testimonial' })
    const liveRegion = () =>
      container.querySelector('[aria-live="polite"]')

    expect(previous).toHaveAttribute('type', 'button')
    expect(next).toHaveAttribute('type', 'button')
    expect(liveRegion()).toHaveAttribute('aria-atomic', 'true')
    expect(liveRegion()).toHaveTextContent('First testimonial quote.')
    expect(
      screen.getByRole('img', { name: 'First client project' }),
    ).toBeInTheDocument()

    fireEvent.click(previous)
    expect(liveRegion()).toHaveTextContent('Third testimonial quote.')
    expect(
      screen.getByRole('img', { name: 'Third client project' }),
    ).toBeInTheDocument()

    fireEvent.click(next)
    expect(liveRegion()).toHaveTextContent('First testimonial quote.')

    fireEvent.click(next)
    expect(liveRegion()).toHaveTextContent('Second testimonial quote.')
    fireEvent.click(next)
    expect(liveRegion()).toHaveTextContent('Third testimonial quote.')
    fireEvent.click(next)
    expect(liveRegion()).toHaveTextContent('First testimonial quote.')
  })

  it('stays on the first item when autoplay is omitted', () => {
    vi.useFakeTimers()
    const { container } = render(
      <AnimatedTestimonials testimonials={TESTIMONIALS} />,
    )
    const liveRegion = container.querySelector('[aria-live="polite"]')

    act(() => vi.advanceTimersByTime(30_000))

    expect(liveRegion).toHaveTextContent('First testimonial quote.')
  })

  it('renders nothing for an empty collection and hides navigation for one item', () => {
    const empty = render(<AnimatedTestimonials testimonials={[]} />)
    expect(empty.container).toBeEmptyDOMElement()
    empty.unmount()

    const intervalSpy = vi.spyOn(globalThis, 'setInterval')
    const { container } = render(
      <AnimatedTestimonials testimonials={[TESTIMONIALS[0]]} autoplay />,
    )

    expect(container).toHaveTextContent('First testimonial quote.')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(intervalSpy).not.toHaveBeenCalled()
  })

  it('renders static copy with zero-duration card transitions for reduced motion', () => {
    motionMocks.prefersReducedMotion = true

    render(<AnimatedTestimonials testimonials={TESTIMONIALS} />)

    expect(motionMocks.useReducedMotion).toHaveBeenCalled()

    const cards = motionMocks.renderedProps.filter(
      ({ element }) => element === 'figure',
    )
    expect(cards).toHaveLength(TESTIMONIALS.length)
    cards.forEach(({ animate, initial, transition }) => {
      expect(initial).toBe(false)
      expect(animate).toMatchObject({ rotate: 0, scale: 1, z: 0 })
      expect(animate).not.toHaveProperty('y')
      expect(transition).toEqual({ duration: 0 })
    })

    expect(JSON.stringify(motionMocks.renderedProps)).not.toContain('blur')
    expect(screen.getByText('First testimonial quote.')).toBeInTheDocument()
  })
})
