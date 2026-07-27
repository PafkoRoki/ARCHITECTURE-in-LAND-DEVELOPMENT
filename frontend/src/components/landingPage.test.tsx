import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ArchitectureArticle } from './ArchitectureArticle'
import { BentoGallery } from './BentoGallery'
import { WhyWorkWithUs } from './WhyWorkWithUs'
import {
  ARCHITECTURE_ARTICLE_CONTENT,
  GALLERY_IMAGES,
  WHY_WORK_WITH_US_BENEFITS,
} from '../content/landingPageContent'

const whyAnimation = vi.hoisted(() => ({
  current: {
    activeIndex: 0,
    isAnimated: false,
    scrollToBenefit: vi.fn<(index: number) => void>(),
  },
}))

vi.mock('../hooks/useBentoGalleryAnimation', () => ({
  useBentoGalleryAnimation: vi.fn(),
}))

vi.mock('../hooks/useWhyWorkWithUsAnimation', () => ({
  useWhyWorkWithUsAnimation: () => whyAnimation.current,
}))

const expectedParagraphs = [
  'Architecture gives land development its structure, identity, and long-term value. Thoughtful design connects buildings to landscape, movement, and community while turning constraints into opportunities.',
  'Every site begins with its own conditions: orientation, access, topography, context, and the needs of the people who will use it. Reading those conditions carefully allows a project to feel rooted in place rather than imposed upon it.',
  'From the first study to the final visualization, a clear architectural idea helps align planning, design, and development decisions. The result is a coherent environment that works at every scale.',
  'Land development is often described through numbers: area, density, yield, cost, and time. Architecture translates those measurements into lived experience. It determines how a street feels at walking pace, where daylight reaches a room, how a courtyard is shared, and whether a new district develops an identity that people can recognize and value.',
  'A successful plan balances private ambition with public value. Buildings may define the commercial character of a project, but the spaces between them determine how the development connects to its surroundings. Streets, squares, paths, planting, and thresholds form a continuous public realm that can invite activity, support safety, and make everyday movement intuitive.',
  'Density is most effective when it is treated as a design opportunity rather than a target in isolation. Compact development can support public transport, local services, and active streets, yet its quality depends on proportion, daylight, privacy, and access to open space. Architecture makes density legible by shaping mass into a sequence of places with distinct scales and uses.',
  'Landscape is not the remainder left after buildings are positioned. It is a primary system that manages water, moderates temperature, supports biodiversity, and gives a project seasonal character. When landscape and architecture are developed together, ecological performance becomes part of the spatial experience instead of an engineering layer added near the end of the process.',
  'Ultimately, architecture gives development a direction beyond short-term delivery. It connects commercial objectives with environmental performance, social life, and a lasting sense of place. When those priorities reinforce one another, land becomes more than a collection of plots: it becomes a framework for buildings, landscapes, and communities to mature together.',
] as const

const expectedGalleryImages = [
  'poznan.jpg',
  'city.png',
  'architects.jpg',
  'house_architect.jpg',
  'houses.png',
  'render.png',
  'house.jpg',
  'visualization.jpg',
] as const

const expectedBenefits = [
  ['01', 'Endless creative potential for\u00A0bold ideas'],
  ['02', 'Fast delivery. Clear process. No surprises'],
  ['03', 'Global vision. Local insight'],
  ['04', 'Architectural expertise at\u00A0our foundation'],
] as const

const assetName = (source: string) => source.split('/').at(-1)

beforeEach(() => {
  whyAnimation.current.activeIndex = 0
  whyAnimation.current.isAnimated = false
  whyAnimation.current.scrollToBenefit = vi.fn()
})

describe('landing page content', () => {
  it('keeps the gallery, article, and benefit content in the intended order', () => {
    expect(GALLERY_IMAGES.map(assetName)).toEqual(expectedGalleryImages)
    expect(ARCHITECTURE_ARTICLE_CONTENT).toEqual({
      heading: 'Architecture in land development',
      paragraphs: expectedParagraphs,
    })
    expect(
      WHY_WORK_WITH_US_BENEFITS.map(({ number, title }) => [number, title]),
    ).toEqual(expectedBenefits)
  })

  it('renders the ordered decorative gallery and exact article copy', () => {
    const { container: gallery } = render(
      <BentoGallery isScrollReady={false} />,
    )
    const galleryWrapper = gallery.querySelector('.gallery-wrap')
    const galleryImages = Array.from(gallery.querySelectorAll('img'))

    expect(galleryWrapper).toHaveAttribute('aria-hidden', 'true')
    expect(galleryImages.map((image) => assetName(image.src))).toEqual(
      expectedGalleryImages,
    )
    expect(galleryImages.every((image) => image.alt === '')).toBe(true)

    const { container: article } = render(<ArchitectureArticle />)
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Architecture in land development',
      }),
    ).toBeInTheDocument()
    expect(
      Array.from(article.querySelectorAll('p'), (paragraph) =>
        paragraph.textContent,
      ),
    ).toEqual(expectedParagraphs)
  })
})

describe('WhyWorkWithUs', () => {
  it('renders a fully expanded, noninteractive fallback with decorative images', () => {
    const { container } = render(<WhyWorkWithUs isScrollReady={false} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4)

    const bodies = container.querySelectorAll('.why-work-with-us__body')
    expect(bodies).toHaveLength(4)
    bodies.forEach((body) => {
      expect(body).not.toHaveAttribute('aria-hidden')
      expect(body).not.toHaveAttribute('aria-labelledby')
    })

    const imageWrapper = container.querySelector(
      '.why-work-with-us__images',
    )
    const images = Array.from(
      container.querySelectorAll<HTMLImageElement>(
        '.why-work-with-us__image',
      ),
    )
    expect(imageWrapper).toHaveAttribute('aria-hidden', 'true')
    expect(images.map((image) => assetName(image.src))).toEqual([
      'poznan.jpg',
      'house_architect.jpg',
      'render.png',
      'architects.jpg',
    ])
    images.forEach((image) => {
      expect(image).toHaveAttribute('alt', '')
      expect(image).toHaveAttribute('draggable', 'false')
    })
  })

  it('connects animated controls to regions and supports click and keyboard selection', () => {
    whyAnimation.current.activeIndex = 1
    whyAnimation.current.isAnimated = true
    const selectBenefit = whyAnimation.current.scrollToBenefit

    const { container } = render(<WhyWorkWithUs isScrollReady />)

    const buttons = screen.getAllByRole('button')
    const regions = Array.from(
      container.querySelectorAll<HTMLElement>(
        '.why-work-with-us__body[role="region"]',
      ),
    )
    expect(buttons).toHaveLength(4)
    expect(regions).toHaveLength(4)

    buttons.forEach((button, index) => {
      const controlledId = button.getAttribute('aria-controls')
      expect(button).toHaveAttribute(
        'aria-expanded',
        index === 1 ? 'true' : 'false',
      )
      expect(regions[index]).toHaveAttribute('id', controlledId)
      expect(regions[index]).toHaveAttribute(
        'aria-labelledby',
        button.id,
      )
      expect(regions[index]).toHaveAttribute(
        'aria-hidden',
        index === 1 ? 'false' : 'true',
      )
    })

    fireEvent.click(buttons[2])
    fireEvent.keyDown(buttons[0], { key: 'Enter' })
    fireEvent.keyDown(buttons[3], { key: ' ' })

    expect(selectBenefit.mock.calls).toEqual([[2], [0], [3]])
  })
})
