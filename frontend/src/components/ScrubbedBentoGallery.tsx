import { ArchitectureArticle } from './ArchitectureArticle'
import { BentoGallery } from './BentoGallery'
import { ContactSection } from './ContactSection'
import { Footer } from './Footer'
import { Hero } from './Hero'
import { OurProcess } from './OurProcess'
import { WhyWorkWithUs } from './WhyWorkWithUs'
import './ScrubbedBentoGallery.css'
import './Hero.css'
import './BentoGallery.css'
import './ArchitectureArticle.css'
import './WhyWorkWithUs.css'
import './OurProcess.css'
import './ContactSection.css'
import './Footer.css'

type ScrollReadyProps = Readonly<{
  isScrollReady: boolean
}>

function ScrubbedBentoGallery({ isScrollReady }: ScrollReadyProps) {
  return (
    <>
      <main>
        <Hero id="home" />

        <BentoGallery isScrollReady={isScrollReady} />

        <ArchitectureArticle id="about" />

        <WhyWorkWithUs id="services" isScrollReady={isScrollReady} />

        <OurProcess isScrollReady={isScrollReady} />

        <ContactSection id="contact" />
      </main>

      <Footer />
    </>
  )
}

export default ScrubbedBentoGallery
