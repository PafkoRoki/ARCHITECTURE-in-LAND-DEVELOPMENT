import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BentoGallery } from '../components/BentoGallery'

const bentoMocks = vi.hoisted(() => ({
  contexts: [] as Array<{ revert: ReturnType<typeof vi.fn> }>,
  delayedCalls: [] as Array<{
    kill: ReturnType<typeof vi.fn>
    pause: ReturnType<typeof vi.fn>
    restart: ReturnType<typeof vi.fn>
  }>,
  flipGetState: vi.fn(),
  flipTo: vi.fn(),
  refresh: vi.fn(),
  set: vi.fn(),
  timelineAdd: vi.fn(),
}))

vi.mock('../lib/gsap', () => ({
  ExpoScaleEase: { config: vi.fn(() => 'configured-ease') },
  Flip: {
    getState: bentoMocks.flipGetState,
    to: bentoMocks.flipTo,
  },
  ScrollTrigger: { refresh: bentoMocks.refresh },
  gsap: {
    context: (callback: () => void | (() => void)) => {
      const cleanup = callback()
      const context = {
        revert: vi.fn(() => {
          if (typeof cleanup === 'function') cleanup()
        }),
      }
      bentoMocks.contexts.push(context)
      return context
    },
    delayedCall: (_delay: number, callback: () => void) => {
      const control = {
        kill: vi.fn(),
        pause: vi.fn(),
        restart: vi.fn(),
      }
      control.pause.mockReturnValue(control)
      control.restart.mockImplementation(() => {
        callback()
        return control
      })
      bentoMocks.delayedCalls.push(control)
      return control
    },
    set: bentoMocks.set,
    timeline: vi.fn(() => ({ add: bentoMocks.timelineAdd })),
  },
}))

describe('useBentoGalleryAnimation', () => {
  beforeEach(() => {
    bentoMocks.contexts.length = 0
    bentoMocks.delayedCalls.length = 0
  })

  it('leaves the native gallery untouched when enhanced scrolling is disabled', () => {
    const addListener = vi.spyOn(window, 'addEventListener')
    const { container } = render(
      <BentoGallery
        enhancedScrollEnabled={false}
        isScrollReady
      />,
    )

    expect(bentoMocks.contexts).toHaveLength(0)
    expect(bentoMocks.delayedCalls).toHaveLength(0)
    expect(bentoMocks.flipGetState).not.toHaveBeenCalled()
    expect(bentoMocks.flipTo).not.toHaveBeenCalled()
    expect(bentoMocks.refresh).not.toHaveBeenCalled()
    expect(addListener).not.toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    )
    expect(container.querySelector('.gallery')).not.toHaveClass(
      'gallery--final',
    )
  })

  it('rebuilds on resize and releases delayed calls, context, and listener', () => {
    const removeListener = vi.spyOn(window, 'removeEventListener')
    const { container, unmount } = render(
      <BentoGallery enhancedScrollEnabled isScrollReady />,
    )
    const gallery = container.querySelector('.gallery')

    expect(bentoMocks.contexts).toHaveLength(1)
    expect(bentoMocks.flipGetState).toHaveBeenCalledOnce()
    expect(bentoMocks.delayedCalls).toHaveLength(2)
    expect(gallery).not.toHaveClass('gallery--final')

    window.dispatchEvent(new Event('resize'))
    expect(bentoMocks.contexts).toHaveLength(2)
    expect(bentoMocks.contexts[0]?.revert).toHaveBeenCalledOnce()
    expect(bentoMocks.flipGetState).toHaveBeenCalledTimes(2)

    unmount()
    expect(bentoMocks.delayedCalls[0]?.kill).toHaveBeenCalledOnce()
    expect(bentoMocks.delayedCalls[1]?.kill).toHaveBeenCalledOnce()
    expect(bentoMocks.contexts[1]?.revert).toHaveBeenCalledOnce()
    expect(removeListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    )
    expect(gallery).not.toHaveClass('gallery--final')
  })

  it('fully tears down the enhanced gallery when eligibility is lost', () => {
    const removeListener = vi.spyOn(window, 'removeEventListener')
    const { container, rerender } = render(
      <BentoGallery enhancedScrollEnabled isScrollReady />,
    )
    const gallery = container.querySelector('.gallery')
    const firstContext = bentoMocks.contexts[0]
    const [refreshCall, resizeCall] = bentoMocks.delayedCalls

    rerender(
      <BentoGallery
        enhancedScrollEnabled={false}
        isScrollReady
      />,
    )

    expect(firstContext?.revert).toHaveBeenCalledOnce()
    expect(refreshCall?.kill).toHaveBeenCalledOnce()
    expect(resizeCall?.kill).toHaveBeenCalledOnce()
    expect(removeListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    )
    expect(bentoMocks.set).toHaveBeenCalledWith(
      expect.any(Array),
      { clearProps: 'all' },
    )
    expect(gallery).not.toHaveClass('gallery--final')
    expect(bentoMocks.contexts).toHaveLength(1)
  })
})
