export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__meta">
        <p>Architecture in Land Development</p>
        <p aria-hidden="true">PL — 2026</p>
      </div>

      <h1
        id="hero-title"
        className="hero__title"
        aria-label="Land, considered."
      >
        <span aria-hidden="true">Land,</span>
        <span aria-hidden="true">considered.</span>
      </h1>
    </section>
  )
}
