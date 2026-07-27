import { useLayoutEffect, useRef } from 'react'
import { ExpoScaleEase } from 'gsap/EasePack'
import { Flip } from 'gsap/Flip'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import architectsImage from '../assets/architects.jpg'
import cityImage from '../assets/city.png'
import houseImage from '../assets/house.jpg'
import houseArchitectImage from '../assets/house_architect.jpg'
import housesImage from '../assets/houses.png'
import poznanImage from '../assets/poznan.jpg'
import renderImage from '../assets/render.png'
import visualizationImage from '../assets/visualization.jpg'
import './ScrubbedBentoGallery.css'

gsap.registerPlugin(ScrollTrigger, Flip, ExpoScaleEase)

const GALLERY_IMAGES = [
  poznanImage,
  cityImage,
  architectsImage,
  houseArchitectImage,
  housesImage,
  renderImage,
  houseImage,
  visualizationImage,
] as const

const SAMPLE_COPY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const SAMPLE_PARAGRAPHS = Array.from({ length: 8 }, () => SAMPLE_COPY)

/*
 * Scrubbed Bento Gallery by GreenSock:
 * https://codepen.io/GreenSock/pen/vYMzKZx
 * Public Pen source used under the MIT license.
 */
function ScrubbedBentoGallery() {
  const galleryRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const gallery = galleryRef.current
    const galleryWrap = gallery?.parentElement

    if (!gallery || !galleryWrap) return

    const galleryItems = Array.from(
      gallery.querySelectorAll<HTMLElement>('.gallery__item'),
    )
    let flipContext: gsap.Context | undefined

    const createTween = () => {
      flipContext?.revert()
      gallery.classList.remove('gallery--final')

      flipContext = gsap.context(() => {
        gallery.classList.add('gallery--final')
        const flipState = Flip.getState(galleryItems)
        gallery.classList.remove('gallery--final')

        const flip = Flip.to(flipState, {
          simple: true,
          ease: ExpoScaleEase.config(1, 5),
        })

        gsap
          .timeline({
            scrollTrigger: {
              trigger: gallery,
              start: 'center center',
              end: '+=100%',
              scrub: true,
              pin: galleryWrap,
            },
          })
          .add(flip)

        return () => gsap.set(galleryItems, { clearProps: 'all' })
      }, gallery)
    }

    const resizeCall = gsap.delayedCall(0.2, createTween).pause()
    const handleResize = () => resizeCall.restart(true)

    createTween()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeCall.kill()
      flipContext?.revert()
      gallery.classList.remove('gallery--final')
    }
  }, [])

  return (
    <main>
      <div className="gallery-wrap" aria-hidden="true">
        <div
          ref={galleryRef}
          className="gallery gallery--bento gallery--switch"
        >
          {GALLERY_IMAGES.map((src) => (
            <div className="gallery__item" key={src}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>

      <section className="gallery-copy">
        <h2>Here is some content</h2>
        {SAMPLE_PARAGRAPHS.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>
    </main>
  )
}

export default ScrubbedBentoGallery
