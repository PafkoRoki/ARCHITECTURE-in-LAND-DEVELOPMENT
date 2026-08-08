import AppLoader from './components/AppLoader'
import ScrubbedBentoGallery from './components/ScrubbedBentoGallery'
import StaggeredMenu from './components/StaggeredMenu'
import { useSmoothScroll } from './hooks/useSmoothScroll'

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home section', link: '#home' },
  { label: 'About', ariaLabel: 'Go to about section', link: '#about' },
  { label: 'Services', ariaLabel: 'Go to services section', link: '#services' },
  { label: 'Contact', ariaLabel: 'Go to contact section', link: '#contact' }
]

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
]

const logoUrl = new URL('./assets/logo.svg', import.meta.url).href

function App() {
  const { wrapperRef, contentRef, isScrollReady, prefersReducedMotion } =
    useSmoothScroll()

  return (
    <>
      <AppLoader />
        <div style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 1000, pointerEvents: 'none'}}>
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#ff8709"
            openMenuButtonColor="#ff8709"
            changeMenuColorOnOpen={true}
            colors={["#f0f0f0", "#f0f0f0", "#ff8709"]}
            logoUrl={logoUrl}
            accentColor="#ff8709"
          />
        </div>
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
