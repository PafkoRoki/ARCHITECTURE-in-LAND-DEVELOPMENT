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

  it('configures pinning and snapping, then releases media and animation resources', () => {
    let mediaListener: (() => void) | undefined
    const mediaQuery = {
      matches: true,
      addEventListener: vi.fn(
        (_event: string, listener: () => void) => {
          mediaListener = listener
        },
      ),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))

    const { unmount } = render(<WhyWorkWithUs isScrollReady />)
    act(() => vi.runAllTimers())

    expect(mediaQuery.addEventListener).toHaveBeenCalledWith(
      'change',
      mediaListener,
    )
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
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith(
      'change',
      mediaListener,
    )
    expect(whyMocks.tweenKill).toHaveBeenCalledOnce()
    expect(whyMocks.contextRevert).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })
})
