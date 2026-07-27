import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WhyWorkWithUs } from '../components/WhyWorkWithUs'

const whyMocks = vi.hoisted(() => ({
  contextRevert: vi.fn(),
  createScrollTrigger: vi.fn(),
  refresh: vi.fn(),
  set: vi.fn(),
  timeline: vi.fn(),
  timelineTo: vi.fn(),
  tweenKill: vi.fn(),
  tweenTo: vi.fn(),
}))

vi.mock('../lib/gsap', () => ({
  ScrollSmoother: { get: vi.fn(() => null) },
  ScrollTrigger: {
    create: whyMocks.createScrollTrigger,
    maxScroll: vi.fn(() => 2_000),
    refresh: whyMocks.refresh,
  },
  gsap: {
    context: (callback: () => void) => {
      callback()
      return { revert: whyMocks.contextRevert }
    },
    set: whyMocks.set,
    timeline: whyMocks.timeline,
    to: whyMocks.tweenTo,
    utils: { clamp: (_min: number, _max: number, value: number) => value },
  },
}))

describe('useWhyWorkWithUsAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const timeline = {
      scrollTrigger: { end: 500, progress: 0, start: 100 },
      to: whyMocks.timelineTo,
    }
    whyMocks.timeline.mockReturnValue(timeline)
    whyMocks.timelineTo.mockReturnValue(timeline)
    whyMocks.tweenTo.mockReturnValue({ kill: whyMocks.tweenKill })
  })

  it('keeps native benefits static and does not allocate animation resources', () => {
    const { container } = render(
      <WhyWorkWithUs
        enhancedScrollEnabled={false}
        isScrollReady
      />,
    )

    expect(whyMocks.createScrollTrigger).not.toHaveBeenCalled()
    expect(whyMocks.timeline).not.toHaveBeenCalled()
    expect(whyMocks.set).not.toHaveBeenCalled()
    expect(container.querySelector('.why-work-with-us')).not.toHaveClass(
      'why-work-with-us--animated',
    )
    expect(
      container.querySelector('.why-work-with-us__images'),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    container
      .querySelectorAll('.why-work-with-us__body')
      .forEach((body) => {
        expect(body).not.toHaveAttribute('aria-hidden')
        expect(body).not.toHaveAttribute('role')
      })
  })

  it('configures desktop pinning and snapping, then releases animation resources', () => {
    const { unmount } = render(
      <WhyWorkWithUs enhancedScrollEnabled isScrollReady />,
    )
    act(() => vi.runAllTimers())

    expect(whyMocks.createScrollTrigger).toHaveBeenCalledWith(
      expect.objectContaining({
        start: 'top top',
        end: 'bottom bottom',
        pin: true,
      }),
    )
    expect(whyMocks.timeline).toHaveBeenCalledWith(
      expect.objectContaining({
        scrollTrigger: expect.objectContaining({
          scrub: true,
          snap: {
            snapTo: 0.25,
            duration: 1,
            ease: 'power4.inOut',
          },
        }),
      }),
    )

    fireEvent.click(screen.getAllByRole('button')[2])
    expect(whyMocks.tweenTo).toHaveBeenCalledWith(
      window,
      expect.objectContaining({
        scrollTo: 400,
        duration: 1,
        ease: 'power2.inOut',
      }),
    )

    unmount()
    expect(whyMocks.tweenKill).toHaveBeenCalledOnce()
    expect(whyMocks.contextRevert).toHaveBeenCalledOnce()
  })

  it('tears down pinning and exposes static content when eligibility is lost', () => {
    const { container, rerender } = render(
      <WhyWorkWithUs enhancedScrollEnabled isScrollReady />,
    )
    act(() => vi.runAllTimers())

    fireEvent.click(screen.getAllByRole('button')[1])
    rerender(
      <WhyWorkWithUs
        enhancedScrollEnabled={false}
        isScrollReady
      />,
    )

    expect(whyMocks.tweenKill).toHaveBeenCalledOnce()
    expect(whyMocks.contextRevert).toHaveBeenCalledOnce()
    expect(container.querySelector('.why-work-with-us')).not.toHaveClass(
      'why-work-with-us--animated',
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(whyMocks.timeline).toHaveBeenCalledOnce()
    container
      .querySelectorAll('.why-work-with-us__body')
      .forEach((body) => expect(body).not.toHaveAttribute('aria-hidden'))
  })
})
