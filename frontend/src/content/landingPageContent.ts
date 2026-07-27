import architectsImage from '../assets/architects.jpg'
import cityImage from '../assets/city.png'
import houseImage from '../assets/house.jpg'
import houseArchitectImage from '../assets/house_architect.jpg'
import housesImage from '../assets/houses.png'
import poznanImage from '../assets/poznan.jpg'
import renderImage from '../assets/render.png'
import visualizationImage from '../assets/visualization.jpg'

export type GalleryImages = readonly string[]

export const GALLERY_IMAGES = [
  poznanImage,
  cityImage,
  architectsImage,
  houseArchitectImage,
  housesImage,
  renderImage,
  houseImage,
  visualizationImage,
] as const satisfies GalleryImages

export type ArchitectureArticleContent = Readonly<{
  heading: string
  paragraphs: readonly string[]
}>

const ARTICLE_COPY =
  'Architecture gives land development its structure, identity, and long-term value. Thoughtful design connects buildings to landscape, movement, and community while turning constraints into opportunities.'

export const ARCHITECTURE_ARTICLE_CONTENT = {
  heading: 'Architecture in land development',
  paragraphs: [
    ARTICLE_COPY,
    'Every site begins with its own conditions: orientation, access, topography, context, and the needs of the people who will use it. Reading those conditions carefully allows a project to feel rooted in place rather than imposed upon it.',
    'From the first study to the final visualization, a clear architectural idea helps align planning, design, and development decisions. The result is a coherent environment that works at every scale.',
    'Land development is often described through numbers: area, density, yield, cost, and time. Architecture translates those measurements into lived experience. It determines how a street feels at walking pace, where daylight reaches a room, how a courtyard is shared, and whether a new district develops an identity that people can recognize and value.',
    'A successful plan balances private ambition with public value. Buildings may define the commercial character of a project, but the spaces between them determine how the development connects to its surroundings. Streets, squares, paths, planting, and thresholds form a continuous public realm that can invite activity, support safety, and make everyday movement intuitive.',
    'Density is most effective when it is treated as a design opportunity rather than a target in isolation. Compact development can support public transport, local services, and active streets, yet its quality depends on proportion, daylight, privacy, and access to open space. Architecture makes density legible by shaping mass into a sequence of places with distinct scales and uses.',
    'Landscape is not the remainder left after buildings are positioned. It is a primary system that manages water, moderates temperature, supports biodiversity, and gives a project seasonal character. When landscape and architecture are developed together, ecological performance becomes part of the spatial experience instead of an engineering layer added near the end of the process.',
    'Ultimately, architecture gives development a direction beyond short-term delivery. It connects commercial objectives with environmental performance, social life, and a lasting sense of place. When those priorities reinforce one another, land becomes more than a collection of plots: it becomes a framework for buildings, landscapes, and communities to mature together.',
  ],
} as const satisfies ArchitectureArticleContent

export type WhyWorkWithUsBenefit = Readonly<{
  number: string
  title: string
  description: string
  image: string
}>

export type WhyWorkWithUsContent = readonly [
  heading: string,
  benefits: readonly [
    WhyWorkWithUsBenefit,
    WhyWorkWithUsBenefit,
    WhyWorkWithUsBenefit,
    WhyWorkWithUsBenefit,
  ],
]

export const WHY_WORK_WITH_US_CONTENT = [
  'Why work with\u00A0us?',
  [
    {
      number: '01',
      title: 'Endless creative potential for\u00A0bold ideas',
      description:
        'Your vision sets the scale – we match it. Whether shaping skyline, launching a product line, or building a brand, our 3D visualization services scale with\u00A0your ambition.',
      image: poznanImage,
    },
    {
      number: '02',
      title: 'Fast delivery. Clear process. No surprises',
      description:
        'Our efficient workflows and clear communication ensure fast delivery with no unexpected delays. You stay informed about progress, next steps, and delivery times.',
      image: houseArchitectImage,
    },
    {
      number: '03',
      title: 'Global vision. Local insight',
      description:
        'With clients worldwide, we bring a global perspective while respecting local nuance. From regional architecture to\u00A0international design trends, we craft visuals that speak to\u00A0your market and stand out globally.',
      image: renderImage,
    },
    {
      number: '04',
      title: 'Architectural expertise at\u00A0our foundation',
      description:
        'With architects and\u00A0designers on our team, we understand structure and essence, bringing your vision to\u00A0life with authenticity and\u00A0depth.',
      image: architectsImage,
    },
  ],
] as const satisfies WhyWorkWithUsContent

export const [WHY_WORK_WITH_US_HEADING, WHY_WORK_WITH_US_BENEFITS] =
  WHY_WORK_WITH_US_CONTENT
