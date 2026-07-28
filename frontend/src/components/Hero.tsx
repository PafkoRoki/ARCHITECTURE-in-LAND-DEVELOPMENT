import { TypingHeading } from './TypingHeading'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__meta">
        <p>Poznań, 2026</p>
      </div>

      <h1
        id="hero-title"
        className="hero__title"
        aria-label="Architecture in Land Development"
      >
        <TypingHeading text="Architecture in Land Development" />
      </h1>
    </section>
  )
}
