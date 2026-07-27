import { ARCHITECTURE_ARTICLE_CONTENT } from '../content/landingPageContent'

export function ArchitectureArticle() {
  return (
    <article className="gallery-copy">
      <h2>{ARCHITECTURE_ARTICLE_CONTENT.heading}</h2>
      {ARCHITECTURE_ARTICLE_CONTENT.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </article>
  )
}
