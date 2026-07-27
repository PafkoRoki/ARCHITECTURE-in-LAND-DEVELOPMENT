import AppLoader from './components/AppLoader'
import ScrubbedBentoGallery from './components/ScrubbedBentoGallery'
import { useSmoothScroll } from './hooks/useSmoothScroll'

function App() {
  const { wrapperRef, contentRef, isScrollReady, prefersReducedMotion } =
    useSmoothScroll()

  return (
    <>
      <AppLoader />
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef}>
          <ScrubbedBentoGallery
            key={prefersReducedMotion ? 'reduced-motion' : 'smooth-motion'}
            isScrollReady={isScrollReady}
          />
        </div>
      </div>
    </>
  )
}

export default App
