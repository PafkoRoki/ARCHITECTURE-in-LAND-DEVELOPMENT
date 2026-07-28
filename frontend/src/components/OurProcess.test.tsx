import { act, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  PROCESS_CONTENT,
  PROCESS_HEADING,
} from '../content/landingPageContent'
import { OurProcess } from './OurProcess'
import ScrubbedBentoGallery from './ScrubbedBentoGallery'

const motionMocks = vi.hoisted(() => ({
  heightTransform: 'mock-height-transform',
  opacityTransform: 'mock-opacity-transform',
  prefersReducedMotion: false,
  scrollYProgress: { kind: 'mock-scroll-progress' },
  useReducedMotion: vi.fn<() => boolean>(),
  useScroll: vi.fn<(options: unknown) => unknown>(),
  useTransform:
    vi.fn<
      (
        value: unknown,
        input: readonly number[],
        output: readonly number[],
      ) => unknown
    >(),
}))

vi.mock('motion/react', async () => {
  const React = await import('react')

  function MotionDiv({
    style,
    ...props
  }: Readonly<{
    style?: Readonly<Record<string, unknown>>
    [key: string]: unknown
  }>) {
    return React.createElement('div', {
      ...props,
      'data-rendered-height': String(style?.height),
      'data-rendered-opacity': String(style?.opacity),
    })
  }

  return {
    motion: { div: MotionDiv },
    useReducedMotion: motionMocks.useReducedMotion,
    useScroll: motionMocks.useScroll,
    useTransform: motionMocks.useTransform,
  }
})

vi.mock('./TypingHeading', async () => {
  const React = await import('react')

  return {
    TypingHeading: ({ text }: Readonly<{ text: string }>) =>
      React.createElement('span', null, text),
  }
})

vi.mock('../hooks/useBentoGalleryAnimation', () => ({
  useBentoGalleryAnimation: vi.fn(),
}))

vi.mock('../hooks/useWhyWorkWithUsAnimation', () => ({
  useWhyWorkWithUsAnimation: () => ({
    activeIndex: 0,
    isAnimated: false,
    scrollToBenefit: vi.fn(),
  }),
}))

vi.mock('./ContactSection', async () => {
  const React = await import('react')

  return {
    ContactSection: () =>
      React.createElement('section', { className: 'contact-section' }),
  }
})

const EXPECTED_STEPS = [
  {
    number: '01',
    title: 'Poznanie potrzeb',
    description:
      'Zaczynamy od rozmowy, analizy działki lub inwestycji oraz ustalenia budżetu, priorytetów i oczekiwań.',
    image: 'houses.png',
  },
  {
    number: '02',
    title: 'Koncepcja',
    description:
      'Tworzymy pierwsze szkice i układ funkcjonalny, ustalając skalę, kierunek i najważniejsze założenia projektu.',
    image: 'city.png',
  },
  {
    number: '03',
    title: 'Dopracowanie koncepcji',
    description:
      'Rozwijamy wybrany wariant w modelu 3D, dopracowujemy bryłę, układ i materiały oraz przygotowujemy wizualizacje.',
    image: 'visualization.jpg',
  },
  {
    number: '04',
    title: 'Projekt architektoniczno-budowlany',
    description:
      'Przekładamy koncepcję na kompletne rozwiązania projektowe, przygotowujemy dokumentację i koordynujemy uzgodnienia branżowe.',
    image: 'house.jpg',
  },
  {
    number: '05',
    title: 'Dokumentacja i nadzór',
    description:
      'Przygotowujemy materiały do pozwolenia na budowę i wspieramy proces realizacji na etapie budowy.',
    image: 'architects.jpg',
  },
] as const

const resizeObserverMocks = {
  disconnect: vi.fn<() => void>(),
  observe: vi.fn<(target: Element) => void>(),
}
let measuredHeight = 640
let resizeObserverCallback: ResizeObserverCallback | undefined

const assetName = (source: string) =>
  source.split('/').at(-1)?.split('?')[0]

beforeEach(() => {
  motionMocks.useReducedMotion.mockClear()
  motionMocks.useScroll.mockClear()
  motionMocks.useTransform.mockClear()
  motionMocks.prefersReducedMotion = false
  motionMocks.useReducedMotion.mockImplementation(
    () => motionMocks.prefersReducedMotion,
  )
  motionMocks.useScroll.mockImplementation(() => ({
    scrollYProgress: motionMocks.scrollYProgress,
  }))
  motionMocks.useTransform.mockImplementation(
    (_value, input) =>
      input[1] === 0.1
        ? motionMocks.opacityTransform
        : motionMocks.heightTransform,
  )

  resizeObserverMocks.disconnect.mockClear()
  resizeObserverMocks.observe.mockClear()
  measuredHeight = 640
  resizeObserverCallback = undefined

  class ResizeObserverMock {
    constructor(callback: ResizeObserverCallback) {
      resizeObserverCallback = callback
    }

    disconnect() {
      resizeObserverMocks.disconnect()
    }

    observe(target: Element) {
      resizeObserverMocks.observe(target)
    }

    unobserve() {}
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => ({
      bottom: measuredHeight,
      height: measuredHeight,
      left: 0,
      right: 1200,
      top: 0,
      width: 1200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  )
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('OurProcess content and semantics', () => {
  it('keeps the exact five-step Polish content and local image order', () => {
    expect({
      heading: PROCESS_CONTENT.heading,
      steps: PROCESS_CONTENT.steps.map((step) => ({
        number: step.number,
        title: step.title,
        description: step.description,
        image: assetName(step.image),
      })),
    }).toEqual({
      heading: 'Nasz proces',
      steps: EXPECTED_STEPS,
    })
  })

  it('renders a labelled section, an ordered list, and decorative lazy images', () => {
    const { container } = render(<OurProcess isScrollReady={false} />)
    const section = screen.getByRole('region', { name: PROCESS_HEADING })
    const heading = within(section).getByRole('heading', {
      level: 2,
      name: PROCESS_HEADING,
    })
    const list = within(section).getByRole('list')
    const items = within(list).getAllByRole('listitem')
    const titles = within(list).getAllByRole('heading', { level: 3 })
    const markers = Array.from(
      list.querySelectorAll<HTMLElement>('.timeline__marker'),
    )
    const descriptions = Array.from(
      list.querySelectorAll<HTMLElement>('.our-process__description'),
    )
    const images = Array.from(
      list.querySelectorAll<HTMLImageElement>('.our-process__image'),
    )

    expect(section).toHaveAttribute('aria-labelledby', heading.id)
    expect(
      within(section).queryByText(
        'Od pierwszej rozmowy po realizację — prowadzimy projekt jasno, etap po etapie.',
      ),
    ).not.toBeInTheDocument()
    expect(items).toHaveLength(5)
    expect(titles.map((title) => title.textContent)).toEqual(
      EXPECTED_STEPS.map((step) => step.title),
    )
    expect(markers.map((marker) => marker.textContent)).toEqual(
      EXPECTED_STEPS.map((step) => step.number),
    )
    expect(markers.every((marker) => marker.ariaHidden === 'true')).toBe(
      true,
    )
    expect(descriptions.map((description) => description.textContent)).toEqual(
      EXPECTED_STEPS.map((step) => step.description),
    )
    expect(images.map((image) => assetName(image.src))).toEqual(
      EXPECTED_STEPS.map((step) => step.image),
    )
    images.forEach((image) => {
      expect(image).toHaveAttribute('alt', '')
      expect(image).toHaveAttribute('loading', 'lazy')
      expect(image).toHaveAttribute('decoding', 'async')
      expect(image).toHaveAttribute('draggable', 'false')
      expect(image.parentElement).toHaveAttribute('aria-hidden', 'true')
    })
    expect(container.querySelectorAll('ol.timeline__list')).toHaveLength(1)
  })
})

describe('OurProcess timeline states', () => {
  it('renders the measured rail statically until scrolling is ready', () => {
    const { container } = render(<OurProcess isScrollReady={false} />)
    const timeline = container.querySelector('.timeline')
    const progress = container.querySelector('[data-timeline-progress]')

    expect(timeline).toHaveAttribute('data-timeline-animated', 'false')
    expect(progress).toHaveStyle({ height: '640px', opacity: '1' })
    expect(motionMocks.useScroll).not.toHaveBeenCalled()
    expect(motionMocks.useTransform).not.toHaveBeenCalled()
  })

  it('uses document-scroll transforms when scrolling is ready', () => {
    const { container } = render(<OurProcess isScrollReady />)
    const timeline = container.querySelector('.timeline')
    const progress = container.querySelector('[data-timeline-progress]')

    expect(timeline).toHaveAttribute('data-timeline-animated', 'true')
    expect(progress).toHaveAttribute(
      'data-rendered-height',
      motionMocks.heightTransform,
    )
    expect(progress).toHaveAttribute(
      'data-rendered-opacity',
      motionMocks.opacityTransform,
    )
    expect(motionMocks.useScroll).toHaveBeenCalledWith(
      expect.objectContaining({
        offset: ['start 10%', 'end 50%'],
        target: expect.objectContaining({ current: timeline }),
      }),
    )
    expect(motionMocks.useTransform).toHaveBeenCalledWith(
      motionMocks.scrollYProgress,
      [0, 1],
      [0, 640],
    )
    expect(motionMocks.useTransform).toHaveBeenCalledWith(
      motionMocks.scrollYProgress,
      [0, 0.1],
      [0, 1],
    )
  })

  it('keeps the measured rail static when reduced motion is preferred', () => {
    motionMocks.prefersReducedMotion = true

    const { container } = render(<OurProcess isScrollReady />)
    const timeline = container.querySelector('.timeline')
    const progress = container.querySelector('[data-timeline-progress]')

    expect(timeline).toHaveAttribute('data-timeline-animated', 'false')
    expect(progress).toHaveStyle({ height: '640px', opacity: '1' })
    expect(motionMocks.useScroll).not.toHaveBeenCalled()
    expect(motionMocks.useTransform).not.toHaveBeenCalled()
  })

  it('observes the ordered list for size changes and disconnects on cleanup', () => {
    const { container, unmount } = render(
      <OurProcess isScrollReady={false} />,
    )
    const list = container.querySelector('ol.timeline__list')

    expect(resizeObserverMocks.observe).toHaveBeenCalledOnce()
    expect(resizeObserverMocks.observe).toHaveBeenCalledWith(list)

    act(() => {
      measuredHeight = 720
      resizeObserverCallback?.([], {} as ResizeObserver)
    })

    expect(
      container.querySelector('[data-timeline-progress]'),
    ).toHaveStyle({ height: '720px' })

    unmount()

    expect(resizeObserverMocks.disconnect).toHaveBeenCalledOnce()
  })
})

describe('OurProcess page placement', () => {
  it('places the process after WhyWorkWithUs and the contact section before the footer', () => {
    const { container } = render(
      <ScrubbedBentoGallery isScrollReady={false} />,
    )
    const main = container.querySelector('main')
    const whyWorkWithUs = main?.querySelector('.why-work-with-us')
    const process = main?.querySelector('.our-process')
    const contact = main?.querySelector('.contact-section')
    const footer = container.querySelector('footer')

    expect(main).not.toBeNull()
    expect(whyWorkWithUs?.nextElementSibling).toBe(process)
    expect(process?.nextElementSibling).toBe(contact)
    expect(main?.lastElementChild).toBe(contact)
    expect(main?.nextElementSibling).toBe(footer)
  })
})
