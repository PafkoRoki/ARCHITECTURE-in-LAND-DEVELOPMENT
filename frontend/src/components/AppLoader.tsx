import { useId, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import './AppLoader.css'

const NUM_POINTS = 10
const DELAY_POINTS_MAX = 0.3
const DELAY_PER_PATH = 0.25
const DURATION = 0.9

/*
 * SVG Shape Overlays by GreenSock:
 * https://codepen.io/GreenSock/pen/qBedXpg
 * Forked from Blake Bowen: https://codepen.io/osublake/pen/BYwgBg
 * Adapted from Codrops: https://tympanus.net/codrops/2017/10/17/dynamic-shape-overlays-with-svg/
 */
type AppLoaderAnimationProps = {
  onComplete: () => void
}

type AppLoaderProps = Readonly<{
  onComplete: () => void
}>

const SCROLL_LOCK_CLASS = 'app-scroll-locked'

function lockDocumentScroll() {
  const targets = [document.documentElement, document.body]
  const existingLocks = targets.map((target) =>
    target.classList.contains(SCROLL_LOCK_CLASS),
  )

  targets.forEach((target) => {
    target.classList.add(SCROLL_LOCK_CLASS)
  })

  return () => {
    targets.forEach((target, index) => {
      if (!existingLocks[index]) target.classList.remove(SCROLL_LOCK_CLASS)
    })
  }
}

function AppLoaderAnimation({ onComplete }: AppLoaderAnimationProps) {
  const overlayRef = useRef<SVGSVGElement>(null)
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const gradient1Id = `${gradientId}-gradient1`
  const gradient2Id = `${gradientId}-gradient2`

  useLayoutEffect(() => {
    const overlay = overlayRef.current

    if (!overlay) return

    const paths = Array.from(
      overlay.querySelectorAll<SVGPathElement>('.shape-overlays__path'),
    )
    const numPaths = paths.length
    const pointsDelay: number[] = []
    const allPoints: number[][] = []
    const isOpened = false

    for (let i = 0; i < numPaths; i++) {
      const points: number[] = []
      allPoints.push(points)

      for (let j = 0; j < NUM_POINTS; j++) {
        points.push(100)
      }
    }

    function render() {
      for (let i = 0; i < numPaths; i++) {
        const path = paths[i]
        const points = allPoints[i]

        let d = ''
        d += isOpened ? `M 0 0 V ${points[0]} C` : `M 0 ${points[0]} C`

        for (let j = 0; j < NUM_POINTS - 1; j++) {
          const p = ((j + 1) / (NUM_POINTS - 1)) * 100
          const cp = p - (1 / (NUM_POINTS - 1) / 2) * 100
          d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`
        }

        d += isOpened ? ' V 100 H 0' : ' V 0 H 0'
        path.setAttribute('d', d)
      }
    }

    render()

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onUpdate: render,
        defaults: {
          ease: 'power2.inOut',
          duration: DURATION,
        },
      })

      function toggle() {
        timeline.progress(0).clear()

        for (let i = 0; i < NUM_POINTS; i++) {
          pointsDelay[i] = Math.random() * DELAY_POINTS_MAX
        }

        for (let i = 0; i < numPaths; i++) {
          const points = allPoints[i]
          const pathDelay =
            DELAY_PER_PATH * (isOpened ? i : numPaths - i - 1)

          for (let j = 0; j < NUM_POINTS; j++) {
            const delay = pointsDelay[j]
            timeline.to(points, { [j]: 0 }, delay + pathDelay)
          }
        }
      }

      toggle()
      timeline.eventCallback('onComplete', onComplete)
    }, overlay)

    return () => {
      context.revert()
    }
  }, [onComplete])

  return (
    <svg
      ref={overlayRef}
      className="shape-overlays"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradient1Id}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ff8709" />
          <stop offset="100%" stopColor="#ffa500" />
        </linearGradient>
        <linearGradient
          id={gradient2Id}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffd9b0" />
          <stop offset="100%" stopColor="#ff8709" />
        </linearGradient>
      </defs>
      <path
        className="shape-overlays__path"
        fill={`url(#${gradient2Id})`}
      />
      <path
        className="shape-overlays__path"
        fill={`url(#${gradient1Id})`}
      />
    </svg>
  )
}

function AppLoader({ onComplete }: AppLoaderProps) {
  useLayoutEffect(() => lockDocumentScroll(), [])

  return <AppLoaderAnimation onComplete={onComplete} />
}

export default AppLoader
