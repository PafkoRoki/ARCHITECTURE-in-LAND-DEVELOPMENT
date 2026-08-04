import { TypingHeading } from './TypingHeading'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__meta">
        <p></p>
      </div>

      <h1
        id="hero-title"
        className="hero__title"
        aria-label="ARCHITECTURE in LAND DEVELOPMENT"
      >
        <TypingHeading text="ARCHITECTURE in LAND DEVELOPMENT" />
      </h1>
    </section>
  )
}
