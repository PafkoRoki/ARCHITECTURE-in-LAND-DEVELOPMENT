import { ExpoScaleEase } from 'gsap/EasePack'
import { Flip } from 'gsap/Flip'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  Flip,
  ExpoScaleEase,
)

export {
  ExpoScaleEase,
  Flip,
  gsap,
  ScrollSmoother,
  ScrollToPlugin,
  ScrollTrigger,
}
