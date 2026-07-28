import { FOOTER_CONTENT } from '../content/landingPageContent'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer" aria-labelledby="site-footer-heading">
      <div className="site-footer__inner">
        <div className="site-footer__introduction">
          <p className="site-footer__identity">{FOOTER_CONTENT.identity}</p>
          <h2 id="site-footer-heading" className="site-footer__heading">
            {FOOTER_CONTENT.heading}
          </h2>
        </div>

        <dl className="site-footer__business-details">
          {FOOTER_CONTENT.businessDetails.map((detail) => (
            <div className="site-footer__business-detail" key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>

        <p className="site-footer__copyright">&copy; {currentYear}</p>
      </div>
    </footer>
  )
}
