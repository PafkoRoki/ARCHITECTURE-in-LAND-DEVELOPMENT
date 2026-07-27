import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSmoothScroll } from './useSmoothScroll'

type MotionConditions = Readonly<{
  reduced: boolean
  smooth: boolean
}>

const animationMocks = vi.hoisted(() => ({
  activeCleanup: undefined as undefined | (() => void),
  conditions: { reduced: false, smooth: true },
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

function HookHarness() {
  const {
    contentRef,
    isScrollReady,
    prefersReducedMotion,
    wrapperRef,
  } = useSmoothScroll()

  return (
    <>
      <output
        data-testid="state"
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

beforeEach(() => {
  initialDocumentStyles = document.documentElement.style.cssText
  initialBodyStyles = document.body.style.cssText
  animationMocks.conditions = { reduced: false, smooth: true }
  animationMocks.activeCleanup = undefined
  animationMocks.mediaCallback = undefined
  animationMocks.smootherCreate.mockReturnValue({
    kill: animationMocks.smootherKill,
  })
  animationMocks.matchMedia.mockImplementation(() => ({
    add: (
      _queries: unknown,
      callback: (context: {
        conditions?: MotionConditions
      }) => void | (() => void),
    ) => {
      animationMocks.mediaCallback = (conditions) => {
        animationMocks.activeCleanup?.()
        const cleanup = callback({ conditions })
        animationMocks.activeCleanup =
          typeof cleanup === 'function' ? cleanup : undefined
      }
      animationMocks.mediaCallback(animationMocks.conditions)
    },
    revert: () => {
      animationMocks.mediaRevert()
      animationMocks.activeCleanup?.()
    },
  }))

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches:
        query === '(prefers-reduced-motion: reduce)' &&
        animationMocks.conditions.reduced,
    })),
  )
})

afterEach(() => {
  document.documentElement.style.cssText = initialDocumentStyles
  document.body.style.cssText = initialBodyStyles
  vi.unstubAllGlobals()
})

describe('useSmoothScroll', () => {
  it('creates smooth scrolling, becomes ready on the next frame, and cleans up', () => {
    let frameCallback: FrameRequestCallback | undefined
    const requestFrame = vi.fn((callback: FrameRequestCallback) => {
      frameCallback = callback
      return 41
    })
    const cancelFrame = vi.fn()
    vi.stubGlobal('requestAnimationFrame', requestFrame)
    vi.stubGlobal('cancelAnimationFrame', cancelFrame)

    const { unmount } = render(<HookHarness />)

    expect(animationMocks.smootherCreate).toHaveBeenCalledWith({
      wrapper: screen.getByTestId('wrapper'),
      content: screen.getByTestId('content'),
      smooth: 1,
      smoothTouch: 0,
    })
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-ready',
      'false',
    )

    act(() => frameCallback?.(0))
    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-ready',
      'true',
    )

    unmount()
    expect(cancelFrame).toHaveBeenCalledWith(41)
    expect(animationMocks.mediaRevert).toHaveBeenCalledOnce()
    expect(animationMocks.smootherKill).toHaveBeenCalledOnce()
  })

  it('restores captured inline styles when motion changes to reduced', () => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.body.style.margin = '2px'
    let frameCallback: FrameRequestCallback | undefined
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frameCallback = callback
        return 7
      }),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    render(<HookHarness />)
    const wrapper = screen.getByTestId('wrapper')
    const content = screen.getByTestId('content')
    const capturedStyles = {
      documentElement: document.documentElement.style.cssText,
      body: document.body.style.cssText,
      wrapper: wrapper.style.cssText,
      content: content.style.cssText,
    }

    document.documentElement.style.cssText = 'overflow: hidden;'
    document.body.style.cssText = 'height: 999px;'
    wrapper.style.cssText = 'position: fixed;'
    content.style.cssText = 'transform: translateY(20px);'

    act(() => {
      animationMocks.mediaCallback?.({ reduced: true, smooth: false })
      frameCallback?.(0)
    })

    expect(screen.getByTestId('state')).toHaveAttribute(
      'data-reduced',
      'true',
    )
    expect(document.documentElement.style.cssText).toBe(
      capturedStyles.documentElement,
    )
    expect(document.body.style.cssText).toBe(capturedStyles.body)
    expect(wrapper.style.cssText).toBe(capturedStyles.wrapper)
    expect(content.style.cssText).toBe(capturedStyles.content)
    expect(animationMocks.refresh).toHaveBeenCalledOnce()
  })
})
