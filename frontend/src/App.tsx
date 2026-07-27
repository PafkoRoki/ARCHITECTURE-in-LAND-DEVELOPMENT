import { useCallback, useEffect, useState } from 'react'
import AppLoader from './components/AppLoader'
import ScrubbedBentoGallery from './components/ScrubbedBentoGallery'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { REDUCED_MOTION_QUERY } from './lib/responsiveMotion'

function shouldShowLoader() {
  return (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function' ||
    !window.matchMedia(REDUCED_MOTION_QUERY).matches
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(shouldShowLoader)
  const {
    wrapperRef,
    contentRef,
    isScrollReady,
    enhancedScrollEnabled,
  } = useSmoothScroll({ enabled: !isLoading })
  const handleLoaderComplete = useCallback(() => setIsLoading(false), [])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsLoading(false)
    }

    reducedMotion.addEventListener('change', handleReducedMotionChange)

    return () => {
      reducedMotion.removeEventListener(
        'change',
        handleReducedMotionChange,
      )
    }
  }, [])

  return (
    <>
      {isLoading ? <AppLoader onComplete={handleLoaderComplete} /> : null}
      <div
        id="smooth-wrapper"
        ref={wrapperRef}
        inert={isLoading || undefined}
        aria-busy={isLoading || undefined}
      >
        <div id="smooth-content" ref={contentRef}>
          <ScrubbedBentoGallery
            key={enhancedScrollEnabled ? 'enhanced-scroll' : 'native-scroll'}
            enhancedScrollEnabled={enhancedScrollEnabled}
            isScrollReady={isScrollReady}
          />
        </div>
      </div>
    </>
  )
}

export default App
