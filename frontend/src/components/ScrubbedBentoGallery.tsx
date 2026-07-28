import { ArchitectureArticle } from './ArchitectureArticle'
import { BentoGallery } from './BentoGallery'
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
import './Footer.css'

type ScrollReadyProps = Readonly<{
  isScrollReady: boolean
}>

function ScrubbedBentoGallery({ isScrollReady }: ScrollReadyProps) {
  return (
    <>
      <main>
        <Hero />
        <BentoGallery isScrollReady={isScrollReady} />
        <ArchitectureArticle />
        <WhyWorkWithUs isScrollReady={isScrollReady} />
        <OurProcess isScrollReady={isScrollReady} />
      </main>
      <Footer />
    </>
  )
}

export default ScrubbedBentoGallery
