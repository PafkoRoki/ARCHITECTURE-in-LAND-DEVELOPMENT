import { ArchitectureArticle } from './ArchitectureArticle'
import { BentoGallery } from './BentoGallery'
import { WhyWorkWithUs } from './WhyWorkWithUs'
import './ScrubbedBentoGallery.css'
import './BentoGallery.css'
import './ArchitectureArticle.css'
import './WhyWorkWithUs.css'

type ScrollReadyProps = Readonly<{
  enhancedScrollEnabled: boolean
  isScrollReady: boolean
}>

function ScrubbedBentoGallery({
  enhancedScrollEnabled,
  isScrollReady,
}: ScrollReadyProps) {
  return (
    <main>
      <BentoGallery
        enhancedScrollEnabled={enhancedScrollEnabled}
        isScrollReady={isScrollReady}
      />
      <ArchitectureArticle />
      <WhyWorkWithUs
        enhancedScrollEnabled={enhancedScrollEnabled}
        isScrollReady={isScrollReady}
      />
    </main>
  )
}

export default ScrubbedBentoGallery
