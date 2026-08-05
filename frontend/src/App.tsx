import AppLoader from './components/AppLoader'
import ScrubbedBentoGallery from './components/ScrubbedBentoGallery'
import StaggeredMenu from './components/StaggeredMenu'
import { useSmoothScroll } from './hooks/useSmoothScroll'

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact-section' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];


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
            logoUrl="https://raw.githubusercontent.com/PafkoRoki/PAAS/main/public/Assets/logo.svg"
            accentColor="#ff8709"
            onMenuOpen={() => console.log('Menu opened')}
            onMenuClose={() => console.log('Menu closed')}
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
