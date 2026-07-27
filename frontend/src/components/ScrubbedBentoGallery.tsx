import { ArchitectureArticle } from './ArchitectureArticle'
import { BentoGallery } from './BentoGallery'
import { WhyWorkWithUs } from './WhyWorkWithUs'
import './ScrubbedBentoGallery.css'
import './BentoGallery.css'
import './ArchitectureArticle.css'
import './WhyWorkWithUs.css'

type ScrollReadyProps = Readonly<{
  isScrollReady: boolean
}>

function ScrubbedBentoGallery({ isScrollReady }: ScrollReadyProps) {
  return (
    <main>
      <BentoGallery isScrollReady={isScrollReady} />
      <ArchitectureArticle />
      <WhyWorkWithUs isScrollReady={isScrollReady} />
    </main>
  )
}

export default ScrubbedBentoGallery
