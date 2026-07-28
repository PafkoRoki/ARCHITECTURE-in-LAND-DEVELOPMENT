import { FOOTER_CONTENT } from '../content/landingPageContent'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer" aria-labelledby="site-footer-heading">
      <div className="site-footer__inner">
        <div className="site-footer__eyebrow-row">
          <span className="site-footer__marker" aria-hidden="true" />
          <p className="site-footer__eyebrow">{FOOTER_CONTENT.eyebrow}</p>
        </div>

        <h2 id="site-footer-heading" className="site-footer__heading">
          {FOOTER_CONTENT.heading}
        </h2>

        <p className="site-footer__supporting-text">
          {FOOTER_CONTENT.supportingText}
        </p>

        <div className="site-footer__identity-row">
          <p className="site-footer__identity">{FOOTER_CONTENT.identity}</p>
          <p className="site-footer__copyright">
            &copy; {currentYear}
          </p>
        </div>
      </div>
    </footer>
  )
}
