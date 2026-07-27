import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AppLoader from './AppLoader'

const loaderMocks = vi.hoisted(() => ({
  complete: undefined as undefined | (() => void),
  contextRevert: vi.fn(),
  timeline: vi.fn(),
}))

vi.mock('../lib/gsap', () => ({
  gsap: {
    context: (callback: () => void) => {
      callback()
      return { revert: loaderMocks.contextRevert }
    },
    timeline: (options: unknown) => {
      loaderMocks.timeline(options)
      return {
        clear: vi.fn(),
        eventCallback: vi.fn(
          (_event: string, callback: () => void) => {
            loaderMocks.complete = callback
          },
        ),
        progress: vi.fn(() => ({ clear: vi.fn() })),
        to: vi.fn(),
      }
    },
  },
}))

let initialDocumentStyles = ''
let initialBodyStyles = ''
let initialDocumentClasses = ''
let initialBodyClasses = ''

beforeEach(() => {
  initialDocumentStyles = document.documentElement.style.cssText
  initialBodyStyles = document.body.style.cssText
  initialDocumentClasses = document.documentElement.className
  initialBodyClasses = document.body.className
  loaderMocks.complete = undefined
})

afterEach(() => {
  document.documentElement.style.cssText = initialDocumentStyles
  document.body.style.cssText = initialBodyStyles
  document.documentElement.className = initialDocumentClasses
  document.body.className = initialBodyClasses
})

describe('AppLoader', () => {
  it('owns and cleans up only the document scroll-lock classes it adds', () => {
    document.documentElement.style.setProperty(
      'overflow',
      'scroll',
      'important',
    )
    document.body.style.setProperty('overflow', 'clip')
    document.documentElement.classList.add('app-scroll-locked')
    const documentOverflow = document.documentElement.style.cssText
    const bodyOverflow = document.body.style.cssText

    const { unmount } = render(<AppLoader onComplete={vi.fn()} />)

    expect(document.documentElement).toHaveClass('app-scroll-locked')
    expect(document.body).toHaveClass('app-scroll-locked')
    expect(document.documentElement.style.cssText).toBe(documentOverflow)
    expect(document.body.style.cssText).toBe(bodyOverflow)

    unmount()

    expect(document.documentElement).toHaveClass('app-scroll-locked')
    expect(document.body).not.toHaveClass('app-scroll-locked')
    expect(document.documentElement.style.cssText).toBe(documentOverflow)
    expect(document.body.style.cssText).toBe(bodyOverflow)
    expect(loaderMocks.contextRevert).toHaveBeenCalledOnce()
  })

  it('forwards animation completion to its controller', () => {
    const onComplete = vi.fn()
    render(<AppLoader onComplete={onComplete} />)

    act(() => loaderMocks.complete?.())

    expect(onComplete).toHaveBeenCalledOnce()
  })
})
