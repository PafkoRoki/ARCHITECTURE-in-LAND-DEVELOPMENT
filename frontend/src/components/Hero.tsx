import { TypingHeading } from './TypingHeading'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__meta">
      </div>

      <h1
        id="hero-title"
        className="hero__title"
        aria-label="Architecture in Land Development"
      >
        <TypingHeading text="ARCHITECTURE in LAND DEVELOPMENT" />
      </h1>
    </section>
  )
}
