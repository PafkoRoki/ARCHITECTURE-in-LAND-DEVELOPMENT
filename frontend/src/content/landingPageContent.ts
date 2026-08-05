import architectsImage from '../assets/architects.jpg'
import houseArchitectImage from '../assets/house_architect.jpg'
import poznanImage from '../assets/poznan.jpg'
import renderImage from '../assets/render.png'
import gallery01Image from '../assets/gallery-01.webp'
import gallery02Image from '../assets/gallery-02.webp'
import gallery03Image from '../assets/gallery-03.webp'
import gallery04Image from '../assets/gallery-04.webp'
import gallery05Image from '../assets/gallery-05.webp'
import gallery06Image from '../assets/gallery-06.webp'
import gallery07Image from '../assets/gallery-07.webp'
import gallery08Image from '../assets/gallery-08.webp'
import process01Image from '../assets/process-01.webp'
import process02Image from '../assets/process-02.webp'
import process03Image from '../assets/process-03.webp'
import process04Image from '../assets/process-04.webp'
import process05Image from '../assets/process-05.webp'
import review1 from '../assets/review1.jpg'
import review2 from '../assets/review2.jpg'
import review3 from '../assets/review3.jpg'

export type GalleryImages = readonly string[]

export const GALLERY_IMAGES = [
  gallery01Image,
  gallery02Image,
  gallery03Image,
  gallery04Image,
  gallery05Image,
  gallery06Image,
  gallery07Image,
  gallery08Image,
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

export const WHY_WORK_WITH_US_ANIMATION_QUERY =
  '(min-width: 480px) and (prefers-reduced-motion: no-preference)'

export type ContactContent = Readonly<{
  heading: string
  supportingText: string
  emailLabel: string
  projectLabel: string
  submitLabel: string
  sampleLabel: string
}>

export type ContactTestimonial = Readonly<{
  quote: string
  name: string
  designation: string
  src: string
}>

export const CONTACT_CONTENT = {
  heading: 'Start a project',
  supportingText:
    'Tell us what you have in mind. We’ll get back to you with the next steps.',
  emailLabel: 'Email address.',
  projectLabel: 'What would you like to create?',
  submitLabel: 'Send inquiry',
  sampleLabel: 'Opinie',
} as const satisfies ContactContent

export const CONTACT_TESTIMONIALS = [
  {
    quote:
      'The team turned a complex site into a clear visual story that made early decisions easier for everyone involved.',
    name: 'Property developer',
    designation: 'Illustrative testimonial',
    src: review1,
  },
  {
    quote:
      'The process was clear from the first brief, and the final images captured both the architecture and the atmosphere.',
    name: 'Architecture studio',
    designation: 'Illustrative testimonial',
    src: review2,
  },
  {
    quote:
      'Their architectural perspective brought precision, credibility, and a strong sense of place to every visualization.',
    name: 'Design team',
    designation: 'Illustrative testimonial',
    src: review3,
  },
] as const satisfies readonly [
  ContactTestimonial,
  ContactTestimonial,
  ContactTestimonial,
]

export type ProcessStep = Readonly<{
  number: string
  title: string
  description: string
  image: string
  imagePresentation: 'diagram' | 'photo'
}>

export type ProcessContent = Readonly<{
  heading: string
  steps: readonly [
    ProcessStep,
    ProcessStep,
    ProcessStep,
    ProcessStep,
    ProcessStep,
  ]
}>

export const PROCESS_CONTENT = {
  heading: 'Nasz proces',
  steps: [
    {
      number: '01',
      title: 'Poznanie potrzeb',
      description:
        'Zaczynamy od rozmowy, analizy działki lub inwestycji oraz ustalenia budżetu, priorytetów i oczekiwań.',
      image: process01Image,
      imagePresentation: 'diagram',
    },
    {
      number: '02',
      title: 'Koncepcja',
      description:
        'Tworzymy pierwsze szkice i układ funkcjonalny, ustalając skalę, kierunek i najważniejsze założenia projektu.',
      image: process02Image,
      imagePresentation: 'diagram',
    },
    {
      number: '03',
      title: 'Dopracowanie koncepcji',
      description:
        'Rozwijamy wybrany wariant w modelu 3D, dopracowujemy bryłę, układ i materiały oraz przygotowujemy wizualizacje.',
      image: process03Image,
      imagePresentation: 'diagram',
    },
    {
      number: '04',
      title: 'Projekt architektoniczno-budowlany',
      description:
        'Przekładamy koncepcję na kompletne rozwiązania projektowe, przygotowujemy dokumentację i koordynujemy uzgodnienia branżowe.',
      image: process04Image,
      imagePresentation: 'diagram',
    },
    {
      number: '05',
      title: 'Dokumentacja i nadzór',
      description:
        'Przygotowujemy materiały do pozwolenia na budowę i wspieramy proces realizacji na etapie budowy.',
      image: process05Image,
      imagePresentation: 'photo',
    },
  ],
} as const satisfies ProcessContent

export const {
  heading: PROCESS_HEADING,
  steps: PROCESS_STEPS,
} = PROCESS_CONTENT

export type FooterBusinessDetail = Readonly<{
  label: string
  value: string
}>

export type FooterContent = Readonly<{
  eyebrow: string
  heading: string
  supportingText: string
  identity: string
  businessDetails: readonly FooterBusinessDetail[]
}>

export const FOOTER_CONTENT = {
  eyebrow: 'ARCHITEKTURA / TEREN / SPOŁECZNOŚĆ',
  heading: 'Od terenu do miejsc na lata.',
  supportingText:
    'Tworzymy ramy dla budynków, krajobrazu i społeczności, które mogą rozwijać się razem.',
  identity: 'Architecture in Land Development',
  businessDetails: [] as readonly FooterBusinessDetail[],
} as const satisfies FooterContent
