import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds = [0]
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  disconnect() {}

  observe(target: Element) {
    this.callback(
      [
        {
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: target.getBoundingClientRect(),
          isIntersecting: true,
          rootBounds: null,
          target,
          time: 0,
        },
      ],
      this,
    )
  }

  takeRecords() {
    return []
  }

  unobserve() {}
}

globalThis.IntersectionObserver = TestIntersectionObserver

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
