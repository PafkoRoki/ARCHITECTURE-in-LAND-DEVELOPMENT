import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSmoothScroll } from './useSmoothScroll'

const ENHANCED_SCROLL_QUERY =
  '(min-width: 992px) and (min-height: 600px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

type MotionConditions = Readonly<{
  enhanced: boolean
  reduced: boolean
}>

const animationMocks = vi.hoisted(() => ({
  activeCleanup: undefined as undefined | (() => void),
  conditions: { enhanced: true, reduced: false },
  mediaAdd: vi.fn(),
  mediaCallback: undefined as
    | undefined
    | ((conditions: MotionConditions) => void),
  mediaRevert: vi.fn(),
  matchMedia: vi.fn(),
  refresh: vi.fn(),
  smootherCreate: vi.fn(),
  smootherKill: vi.fn(),
}))

vi.mock('../lib/gsap', () => ({
  gsap: { matchMedia: animationMocks.matchMedia },
  ScrollSmoother: { create: animationMocks.smootherCreate },
  ScrollTrigger: { refresh: animationMocks.refresh },
}))

function HookHarness({ enabled }: Readonly<{ enabled: boolean }>) {
  const {
    contentRef,
    enhancedScrollEnabled,
    isScrollReady,
    prefersReducedMotion,
    wrapperRef,
  } = useSmoothScroll({ enabled })

  return (
    <>
      <output
        data-testid="state"
        data-enhanced={enhancedScrollEnabled}
        data-ready={isScrollReady}
        data-reduced={prefersReducedMotion}
      />
      <div ref={wrapperRef} data-testid="wrapper" style={{ position: 'relative' }}>
        <div ref={contentRef} data-testid="content" style={{ opacity: 0.5 }} />
      </div>
    </>
  )
}

let initialDocumentStyles = ''
let initialBodyStyles = ''
let frameCallbacks: FrameRequestCallback[] = []

beforeEach(() => {
  initialDocumentStyles = document.documentElement.style.cssText
  initialBodyStyles = document.body.style.cssText
  frameCallbacks = []
  animationMocks.conditions = { enhanced: true, reduced: false }
  animationMocks.activeCleanup = undefined
  animationMocks.mediaCallback = undefined
  animationMocks.smootherCreate.mockReturnValue({
    kill: animationMocks.smootherKill,
  })
  animationMocks.matchMedia.mockImplementation(() => ({
    add: (
      queries: unknown,
      callback: (context: {
        conditions?: MotionConditions
      }) => void | (() => void),
    ) => {
      animationMocks.mediaAdd(queries)
      animationMocks.mediaCallback = (conditions) => {
        animationMocks.activeCleanup?.()
        animationMocks.activeCleanup = undefined
        const cleanup = callback({ conditions })
        animationMocks.activeCleanup =
          typeof cleanup === 'function' ? cleanup : undefined
      }
      animationMocks.mediaCallback(animationMocks.conditions)
    },
    revert: () => {
      animationMocks.mediaRevert()
      animationMocks.activeCleanup?.()
      animationMocks.activeCleanup = undefined
    },
  }))

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches:
        (query === REDUCED_MOTION_QUERY &&
          animationMocks.conditions.reduced) ||
        (query === ENHANCED_SCROLL_QUERY &&
          animationMocks.conditions.enhanced),
    })),
  )
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      frameCallbacks.push(callback)
      return frameCallbacks.length
    }),
  )
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

afterEach(() => {
  document.documentElement.style.cssText = initialDocumentStyles
  document.body.style.cssText = initialBodyStyles
  vi.unstubAllGlobals()
})

describe('useSmoothScroll', () => {
  it('does not initialize scrolling until the loader enables it', () => {
    const { rerender } = render(<HookHarness enabled={false} />)

    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-ready',
      'false',
    )
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-enhanced',
      'true',
    )
    expect(animationMocks.smootherCreate).not.toHaveBeenCalled()

    rerender(<HookHarness enabled />)
    expect(animationMocks.smootherCreate).toHaveBeenCalledOnce()

    act(() => frameCallbacks.at(-1)?.(0))
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-ready',
      'true',
    )
  })

  it('uses native scrolling when enhanced capabilities do not match', () => {
    animationMocks.conditions = { enhanced: false, reduced: false }

    render(<HookHarness enabled />)

    expect(animationMocks.mediaAdd).toHaveBeenCalledWith({
      all: 'all',
      enhanced: ENHANCED_SCROLL_QUERY,
      reduced: REDUCED_MOTION_QUERY,
    })
    expect(animationMocks.smootherCreate).not.toHaveBeenCalled()
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-enhanced',
      'false',
    )

    act(() => frameCallbacks.at(-1)?.(0))
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-ready',
      'true',
    )
  })

  it('creates enhanced scrolling, becomes ready on the next frame, and cleans up', () => {
    const cancelFrame = vi.mocked(window.cancelAnimationFrame)
    const { unmount } = render(<HookHarness enabled />)

    expect(animationMocks.smootherCreate).toHaveBeenCalledWith({
      wrapper: screen.getByTestId('wrapper'),
      content: screen.getByTestId('content'),
      smooth: 1,
      smoothTouch: 0,
    })
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-enhanced',
      'true',
    )
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-ready',
      'false',
    )

    act(() => frameCallbacks.at(-1)?.(0))
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-ready',
      'true',
    )

    unmount()
    expect(cancelFrame).toHaveBeenCalledWith(1)
    expect(animationMocks.mediaRevert).toHaveBeenCalledOnce()
    expect(animationMocks.smootherKill).toHaveBeenCalledOnce()
  })

  it('restores captured inline styles when enhanced eligibility is lost', () => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.body.style.margin = '2px'

    render(<HookHarness enabled />)
    const wrapper = screen.getByTestId('wrapper')
    const content = screen.getByTestId('content')
    const capturedStyles = {
      documentElement: document.documentElement.style.cssText,
      body: document.body.style.cssText,
      wrapper: wrapper.style.cssText,
      content: content.style.cssText,
    }

    act(() => frameCallbacks.at(-1)?.(0))

    document.documentElement.style.cssText = 'overflow: hidden;'
    document.body.style.cssText = 'height: 999px;'
    wrapper.style.cssText = 'position: fixed;'
    content.style.cssText = 'transform: translateY(20px);'

    act(() => {
      animationMocks.mediaCallback?.({
        enhanced: false,
        reduced: false,
      })
    })
    act(() => frameCallbacks.at(-1)?.(0))

    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-enhanced',
      'false',
    )
    expect(document.documentElement.style.cssText).toBe(
      capturedStyles.documentElement,
    )
    expect(document.body.style.cssText).toBe(capturedStyles.body)
    expect(wrapper.style.cssText).toBe(capturedStyles.wrapper)
    expect(content.style.cssText).toBe(capturedStyles.content)
    expect(animationMocks.smootherKill).toHaveBeenCalledOnce()
    expect(animationMocks.refresh).toHaveBeenCalledOnce()
  })

  it('reports reduced motion and never creates a smoother', () => {
    animationMocks.conditions = { enhanced: false, reduced: true }

    render(<HookHarness enabled />)

    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-reduced',
      'true',
    )
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-enhanced',
      'false',
    )
    expect(animationMocks.smootherCreate).not.toHaveBeenCalled()
  })
})
