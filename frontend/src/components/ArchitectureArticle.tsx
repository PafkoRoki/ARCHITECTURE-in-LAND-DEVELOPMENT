import { ARCHITECTURE_ARTICLE_CONTENT } from '../content/landingPageContent'
import { TypingHeading } from './TypingHeading'

export function ArchitectureArticle() {
  return (
    <article className="gallery-copy">
      <h2 aria-label={ARCHITECTURE_ARTICLE_CONTENT.heading}>
        <TypingHeading text={ARCHITECTURE_ARTICLE_CONTENT.heading} />
      </h2>
      {ARCHITECTURE_ARTICLE_CONTENT.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </article>
  )
}
