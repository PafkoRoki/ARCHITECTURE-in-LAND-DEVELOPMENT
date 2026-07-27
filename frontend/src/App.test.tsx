import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const appMocks = vi.hoisted(() => ({
  contentRef: { current: null as HTMLDivElement | null },
  enhancedScrollEnabled: true,
  isScrollReady: false,
  prefersReducedMotion: false,
  useSmoothScroll: vi.fn(),
  wrapperRef: { current: null as HTMLDivElement | null },
}))

vi.mock('./hooks/useSmoothScroll', () => ({
  useSmoothScroll: appMocks.useSmoothScroll,
}))

vi.mock('./components/AppLoader', () => ({
  default: ({ onComplete }: Readonly<{ onComplete: () => void }>) => (
    <button type="button" onClick={onComplete}>
      Complete loader
    </button>
  ),
}))

vi.mock('./components/ScrubbedBentoGallery', () => ({
  default: ({
    enhancedScrollEnabled,
    isScrollReady,
  }: Readonly<{
    enhancedScrollEnabled: boolean
    isScrollReady: boolean
  }>) => (
    <output
      data-testid="page-state"
      data-enhanced={enhancedScrollEnabled}
      data-ready={isScrollReady}
    />
  ),
}))

beforeEach(() => {
  appMocks.contentRef.current = null
  appMocks.wrapperRef.current = null
  appMocks.enhancedScrollEnabled = true
  appMocks.isScrollReady = false
  appMocks.prefersReducedMotion = false
  appMocks.useSmoothScroll.mockImplementation(() => ({
    contentRef: appMocks.contentRef,
    enhancedScrollEnabled: appMocks.enhancedScrollEnabled,
    isScrollReady: appMocks.isScrollReady,
    prefersReducedMotion: appMocks.prefersReducedMotion,
    wrapperRef: appMocks.wrapperRef,
  }))
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    })),
  )
})

afterEach(() => vi.unstubAllGlobals())

describe('App loading lifecycle', () => {
  it('keeps page content inert until loading completes, then enables scrolling', () => {
    render(<App />)

    const wrapper = document.querySelector('#smooth-wrapper')
    expect(wrapper).toHaveAttribute('inert')
    expect(wrapper).toHaveAttribute('aria-busy', 'true')
    expect(appMocks.useSmoothScroll).toHaveBeenLastCalledWith({
      enabled: false,
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Complete loader' }),
    )

    expect(
      screen.queryByRole('button', { name: 'Complete loader' }),
    ).not.toBeInTheDocument()
    expect(wrapper).not.toHaveAttribute('inert')
    expect(wrapper).not.toHaveAttribute('aria-busy')
    expect(appMocks.useSmoothScroll).toHaveBeenLastCalledWith({
      enabled: true,
    })
    expect(screen.getByTestId('page-state')).toHaveAttribute(
      'data-enhanced',
      'true',
    )
  })

  it('bypasses the animated loader for reduced-motion users', () => {
    appMocks.enhancedScrollEnabled = false
    appMocks.isScrollReady = true
    appMocks.prefersReducedMotion = true
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: true,
        removeEventListener: vi.fn(),
      })),
    )

    render(<App />)

    expect(
      screen.queryByRole('button', { name: 'Complete loader' }),
    ).not.toBeInTheDocument()
    expect(document.querySelector('#smooth-wrapper')).not.toHaveAttribute(
      'inert',
    )
    expect(appMocks.useSmoothScroll).toHaveBeenLastCalledWith({
      enabled: true,
    })
    expect(screen.getByTestId('page-state')).toHaveAttribute(
      'data-enhanced',
      'false',
    )
    expect(screen.getByTestId('page-state')).toHaveAttribute(
      'data-ready',
      'true',
    )
  })
})
